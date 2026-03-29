import { MetaAdsClient } from './client'
import type { MetaCampaign, MetaCampaignInsights } from '@/types/meta-ads'

export interface NormalizedCampaign {
  id: string
  name: string
  status: string
  objective: string
  budget: number
  spend: number
  impressions: number
  clicks: number
  reach: number
  conversions: number
  startDate: string
  endDate: string | null
}

export async function fetchCampaigns(
  client: MetaAdsClient,
  options?: {
    limit?: number
    status?: string
  }
): Promise<NormalizedCampaign[]> {
  const campaigns = await client.getCampaigns(options)
  
  if (campaigns.length === 0) {
    return []
  }

  const BATCH_SIZE = 10
  const normalizedCampaigns: NormalizedCampaign[] = []

  for (let i = 0; i < campaigns.length; i += BATCH_SIZE) {
    const batch = campaigns.slice(i, i + BATCH_SIZE)
    const batchWithInsights = await Promise.all(
      batch.map(async (campaign) => ({
        campaign,
        insights: await client.getCampaignInsights(campaign.id),
      }))
    )
    
    for (const { campaign, insights } of batchWithInsights) {
      normalizedCampaigns.push(normalizeCampaign(campaign, insights))
    }
  }

  return normalizedCampaigns
}

function normalizeCampaign(
  campaign: MetaCampaign,
  insights: MetaCampaignInsights | null
): NormalizedCampaign {
  const rawBudget = campaign.daily_budget || campaign.lifetime_budget || '0'
  const budgetString = rawBudget === '' ? '0' : rawBudget
  const budget = parseFloat(budgetString) / 100
  const spend = parseFloat(insights?.spend || '0')
  const actions = insights?.actions ?? []
  const conversions = actions.find(a => 
    a.action_type === 'purchase' || a.action_type === 'omni_purchase'
  )?.value || '0'

  return {
    id: campaign.id,
    name: campaign.name,
    status: campaign.status,
    objective: campaign.objective,
    budget,
    spend,
    impressions: parseInt(insights?.impressions || '0'),
    clicks: parseInt(insights?.clicks || '0'),
    reach: parseInt(insights?.reach || '0'),
    conversions: parseInt(conversions),
    startDate: campaign.start_time,
    endDate: campaign.stop_time,
  }
}

export function filterActiveCampaigns(campaigns: NormalizedCampaign[]): NormalizedCampaign[] {
  return campaigns.filter(c => c.status === 'active')
}

export function calculateTotalSpend(campaigns: NormalizedCampaign[]): number {
  return campaigns.reduce((sum, c) => sum + c.spend, 0)
}