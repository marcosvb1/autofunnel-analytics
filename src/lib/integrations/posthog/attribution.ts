import { PostHogClient } from './client'

export interface AttributionResult {
  campaign_id: string
  campaign_name: string
  spend: number
  conversions: number
  roas: number
  cpa: number
  entry_url: string
}

export async function calculateAttribution(
  client: PostHogClient,
  conversionEvent: string = 'purchase',
  dateRange?: { start: string; end: string }
): Promise<AttributionResult[]> {
  const startDate = dateRange?.start || 'now() - INTERVAL 30 DAY'
  const endDate = dateRange?.end || 'now()'
  
  const query = `
    WITH ad_campaigns AS (
      SELECT 
        campaign_id,
        campaign_name,
        SUM(spend) as total_spend
      FROM meta_ads_campaign_insights
      WHERE date_start >= '${startDate}'
      AND date_stop <= '${endDate}'
      GROUP BY campaign_id, campaign_name
    ),
    converted_users AS (
      SELECT 
        distinct_id,
        properties.$current_url as entry_url,
        properties.$utm_campaign as campaign_id,
        MIN(timestamp) as conversion_time
      FROM events
      WHERE event = '${conversionEvent}'
      AND timestamp >= '${startDate}'
      AND timestamp <= '${endDate}'
      AND properties.$utm_source IN ('facebook', 'instagram', 'meta')
      GROUP BY distinct_id, properties.$current_url, properties.$utm_campaign
    )
    SELECT 
      a.campaign_id,
      a.campaign_name,
      a.total_spend as spend,
      COUNT(DISTINCT c.distinct_id) as conversions,
      CASE WHEN a.total_spend > 0 
        THEN COUNT(DISTINCT c.distinct_id) / a.total_spend 
        ELSE 0 
      END as roas,
      CASE WHEN COUNT(DISTINCT c.distinct_id) > 0 
        THEN a.total_spend / COUNT(DISTINCT c.distinct_id) 
        ELSE 0 
      END as cpa,
      COALESCE(
        ARRAY_AGG(DISTINCT c.entry_url)[1],
        'unknown'
      ) as entry_url
    FROM ad_campaigns a
    LEFT JOIN converted_users c ON a.campaign_id = c.campaign_id
    GROUP BY a.campaign_id, a.campaign_name, a.total_spend
    ORDER BY roas DESC
    LIMIT 100
  `
  
  try {
    const response = await client.query(query)
    
    return response.results.map((r: any) => ({
      campaign_id: r.campaign_id,
      campaign_name: r.campaign_name,
      spend: parseFloat(r.spend || '0'),
      conversions: parseInt(r.conversions || '0'),
      roas: parseFloat(r.roas || '0'),
      cpa: parseFloat(r.cpa || '0'),
      entry_url: r.entry_url,
    }))
  } catch {
    return []
  }
}

export async function getTopEntryPagesFromAds(
  client: PostHogClient,
  dateRange?: { start: string; end: string }
): Promise<{ url: string; count: number; campaign_count: number }[]> {
  const startDate = dateRange?.start || 'now() - INTERVAL 30 DAY'
  const endDate = dateRange?.end || 'now()'
  
  const query = `
    SELECT 
      properties.$current_url as url,
      COUNT(DISTINCT distinct_id) as count,
      COUNT(DISTINCT properties.$utm_campaign) as campaign_count
    FROM events
    WHERE event = '$pageview'
    AND timestamp >= '${startDate}'
    AND timestamp <= '${endDate}'
    AND properties.$utm_source IN ('facebook', 'instagram', 'meta')
    GROUP BY properties.$current_url
    ORDER BY count DESC
    LIMIT 20
  `
  
  try {
    const response = await client.query(query)
    
    return response.results.map((r: any) => ({
      url: r.url,
      count: parseInt(r.count || '0'),
      campaign_count: parseInt(r.campaign_count || '0'),
    }))
  } catch {
    return []
  }
}