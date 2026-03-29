import { createLLMClient, LLMClient } from '@/lib/ai/client'
import { FunnelMap } from '@/types/funnel'
import { ATTRIBUTION_SYSTEM_PROMPT, buildAttributionPrompt } from '@/lib/ai/prompts/attribution'

export interface AttributionEntry {
  campaignId: string
  campaignName: string
  conversions: number
  revenue: number
  spend: number
  roi: number
  attributionType: 'first-touch' | 'last-touch' | 'multi-touch'
}

export interface AttributionSummary {
  totalConversions: number
  totalRevenue: number
  totalSpend: number
  overallROI: number
  topCampaign: string
}

export interface AttributionResult {
  attributions: AttributionEntry[]
  summary: AttributionSummary
  insights: string[]
}

export interface AttributionProcessorOptions {
  provider?: 'openai' | 'anthropic'
  attributionType?: 'first-touch' | 'last-touch' | 'multi-touch'
}

const CONVERSION_VALUE = 100

export class AttributionProcessor {
  private client: LLMClient

  constructor(options: AttributionProcessorOptions = {}) {
    this.client = createLLMClient(options.provider || 'anthropic')
  }

  async process(funnel: FunnelMap): Promise<AttributionResult> {
    const userPrompt = buildAttributionPrompt({
      nodes: funnel.nodes,
      edges: funnel.edges
    })

    const response = await this.client.complete({
      messages: [
        { role: 'system', content: ATTRIBUTION_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.2,
      responseFormat: 'json',
    })
    
    try {
      const result = this.parseResponse(response.content)
      return this.validateAndEnrich(result, funnel)
    } catch {
      return this.calculateFallbackAttribution(funnel)
    }
  }

  private parseResponse(content: string): AttributionResult {
    return JSON.parse(content) as AttributionResult
  }

  private validateAndEnrich(result: AttributionResult, funnel: FunnelMap): AttributionResult {
    const totalConversions = funnel.metadata.totalConversions
    const totalRevenue = totalConversions * CONVERSION_VALUE
    const totalSpend = funnel.metadata.totalSpend

    const overallROI = totalSpend > 0 ? totalRevenue / totalSpend : 0

    result.summary.totalConversions = totalConversions
    result.summary.totalRevenue = totalRevenue
    result.summary.totalSpend = totalSpend
    result.summary.overallROI = overallROI

    result.attributions.forEach(attr => {
      if (attr.spend > 0) {
        attr.roi = attr.revenue / attr.spend
      }
    })

    return result
  }

  private calculateFallbackAttribution(funnel: FunnelMap): AttributionResult {
    const campaignNodes = funnel.nodes.filter(n => n.campaign && n.campaignId)
    
    const totalConversions = funnel.metadata.totalConversions
    const totalRevenue = totalConversions * CONVERSION_VALUE
    const totalSpend = funnel.metadata.totalSpend
    const overallROI = totalSpend > 0 ? totalRevenue / totalSpend : 0

    if (campaignNodes.length === 0) {
      return {
        attributions: [],
        summary: {
          totalConversions,
          totalRevenue,
          totalSpend,
          overallROI,
          topCampaign: 'No campaigns detected'
        },
        insights: ['No campaign nodes found in the funnel to attribute conversions.']
      }
    }

    const conversionsPerCampaign = Math.floor(totalConversions / campaignNodes.length)
    const revenuePerCampaign = conversionsPerCampaign * CONVERSION_VALUE

    const attributions: AttributionEntry[] = campaignNodes.map(node => ({
      campaignId: node.campaignId ?? 'unknown',
      campaignName: node.campaign || 'Unknown',
      conversions: conversionsPerCampaign,
      revenue: revenuePerCampaign,
      spend: node.spend ?? 0,
      roi: (node.spend ?? 0) > 0 ? revenuePerCampaign / (node.spend ?? 0) : 0,
      attributionType: 'multi-touch'
    }))

    const topCampaign = attributions.reduce((top, attr) => 
      attr.roi > top.roi ? attr : top, attributions[0])

    return {
      attributions,
      summary: {
        totalConversions,
        totalRevenue,
        totalSpend,
        overallROI,
        topCampaign: topCampaign.campaignName
      },
      insights: [
        'Attribution calculated using equal distribution model (fallback).',
        `Top performing campaign: ${topCampaign.campaignName} with ROI of ${topCampaign.roi.toFixed(2)}x`,
        'Consider implementing multi-touch attribution for more accurate insights.'
      ]
    }
  }
}

export async function processAttribution(
  funnel: FunnelMap,
  options?: AttributionProcessorOptions
): Promise<AttributionResult> {
  const processor = new AttributionProcessor(options)
  return processor.process(funnel)
}