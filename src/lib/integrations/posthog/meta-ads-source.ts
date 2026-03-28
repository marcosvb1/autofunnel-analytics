import { PostHogClient } from './client'

export interface MetaAdsSourceStatus {
  connected: boolean
  tables: string[]
  lastSync: string | null
}

export async function checkMetaAdsSource(client: PostHogClient): Promise<MetaAdsSourceStatus> {
  const query = `
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name LIKE 'meta_ads_%'
  `
  
  try {
    const response = await client.query(query)
    
    return {
      connected: response.results.length > 0,
      tables: response.results.map((r: any) => r.table_name),
      lastSync: null,
    }
  } catch {
    return {
      connected: false,
      tables: [],
      lastSync: null,
    }
  }
}

export interface MetaAdsCampaignFromPostHog {
  id: string
  name: string
  status: string
  spend: number
  impressions: number
  clicks: number
  conversions: number
}

export async function fetchMetaAdsCampaignsViaPostHog(
  client: PostHogClient,
  dateRange?: { start: string; end: string }
): Promise<MetaAdsCampaignFromPostHog[]> {
  const startDate = dateRange?.start || 'now() - INTERVAL 30 DAY'
  const endDate = dateRange?.end || 'now()'
  
  const query = `
    SELECT 
      campaign_id,
      campaign_name,
      status,
      SUM(spend) as spend,
      SUM(impressions) as impressions,
      SUM(clicks) as clicks
    FROM meta_ads_campaign_insights
    WHERE date_start >= '${startDate}'
    AND date_stop <= '${endDate}'
    GROUP BY campaign_id, campaign_name, status
    ORDER BY spend DESC
    LIMIT 100
  `
  
  try {
    const response = await client.query(query)
    
    return response.results.map((r: any) => ({
      id: r.campaign_id,
      name: r.campaign_name,
      status: r.status,
      spend: parseFloat(r.spend || '0'),
      impressions: parseInt(r.impressions || '0'),
      clicks: parseInt(r.clicks || '0'),
      conversions: 0,
    }))
  } catch {
    return []
  }
}

export async function fetchMetaAdsAdsetsViaPostHog(
  client: PostHogClient,
  campaignId?: string,
  dateRange?: { start: string; end: string }
): Promise<any[]> {
  const startDate = dateRange?.start || 'now() - INTERVAL 30 DAY'
  const endDate = dateRange?.end || 'now()'
  
  const query = `
    SELECT 
      adset_id,
      adset_name,
      campaign_id,
      SUM(spend) as spend,
      SUM(impressions) as impressions
    FROM meta_ads_adset_insights
    WHERE date_start >= '${startDate}'
    AND date_stop <= '${endDate}'
    ${campaignId ? `AND campaign_id = '${campaignId}'` : ''}
    GROUP BY adset_id, adset_name, campaign_id
    ORDER BY spend DESC
    LIMIT 50
  `
  
  try {
    const response = await client.query(query)
    return response.results
  } catch {
    return []
  }
}