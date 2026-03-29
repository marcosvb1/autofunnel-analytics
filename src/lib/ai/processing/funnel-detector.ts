import { createLLMClient, LLMClient } from '@/lib/ai/client'
import { FUNNEL_DETECTION_SYSTEM_PROMPT, buildFunnelDetectionPrompt } from '@/lib/ai/prompts/funnel-detection'
import type { FunnelDetectionInput, FunnelMap, FunnelNodeData, FunnelEdgeData } from '@/types/funnel'

export type FunnelDetectionProvider = 'openai' | 'anthropic'

export interface FunnelDetectionOptions {
  provider?: FunnelDetectionProvider
}

export interface FunnelDetectionResult {
  funnel: FunnelMap
  model: string
}

export class FunnelDetector {
  private client: LLMClient
  private provider: FunnelDetectionProvider

  constructor(options: FunnelDetectionOptions = {}) {
    this.provider = options.provider || 'anthropic'
    this.client = createLLMClient(this.provider)
  }

  async detect(input: FunnelDetectionInput, projectId: string): Promise<FunnelDetectionResult> {
    const userPrompt = buildFunnelDetectionPrompt(input)
    
    const response = await this.client.complete({
      messages: [
        { role: 'system', content: FUNNEL_DETECTION_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      responseFormat: 'json',
    })

    const funnel = this.parseResponse(response.content, projectId, this.provider, response.model)

    return {
      funnel,
      model: response.model,
    }
  }

  private parseResponse(
    rawContent: string,
    projectId: string,
    provider: FunnelDetectionProvider,
    model: string
  ): FunnelMap {
    try {
      const parsed = JSON.parse(rawContent)

      return {
        id: `funnel-${projectId}-${Date.now()}`,
        projectId,
        name: `Detected Funnel - ${new Date().toISOString().split('T')[0]}`,
        nodes: this.validateNodes(parsed.nodes || []),
        edges: this.validateEdges(parsed.edges || []),
        metadata: {
          totalVolume: parsed.metadata?.totalVolume || 0,
          totalSpend: parsed.metadata?.totalSpend || 0,
          totalConversions: parsed.metadata?.totalConversions || 0,
          overallConversion: parsed.metadata?.overallConversion || 0,
          roi: parsed.metadata?.roi || 0,
          detectedAt: new Date().toISOString(),
          provider,
          model,
        },
      }
    } catch (error) {
      throw new Error(`Failed to parse funnel detection response: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private validateNodes(nodes: unknown[]): FunnelNodeData[] {
    return nodes.map((node: unknown, index: number) => {
      const n = node as Record<string, unknown>
      return {
        id: String(n.id || `node-${index}`),
        label: String(n.label || n.url || 'Unknown'),
        url: String(n.url || ''),
        type: (n.type as FunnelNodeData['type']) || 'page',
        volume: Number(n.volume) || 0,
        spend: Number(n.spend) || 0,
        campaign: n.campaign ? String(n.campaign) : undefined,
        campaignId: n.campaignId ? String(n.campaignId) : undefined,
      }
    })
  }

  private validateEdges(edges: unknown[]): FunnelEdgeData[] {
    return edges.map((edge: unknown, index: number) => {
      const e = edge as Record<string, unknown>
      return {
        source: String(e.source || ''),
        target: String(e.target || ''),
        volume: Number(e.volume) || 0,
        conversion: Number(e.conversion) || 0,
        traffic: Number(e.traffic || e.volume) || 0,
        spend: Number(e.spend) || 0,
        isMainPath: Boolean(e.isMainPath) || false,
      }
    })
  }

  static fromEnv(provider: FunnelDetectionProvider = 'anthropic'): FunnelDetector {
    return new FunnelDetector({ provider })
  }
}

export async function detectFunnel(
  input: FunnelDetectionInput,
  projectId: string,
  options?: FunnelDetectionOptions
): Promise<FunnelDetectionResult> {
  const detector = new FunnelDetector(options)
  return detector.detect(input, projectId)
}