import { MetaAdsClient } from './client'
import { fetchCampaigns, calculateTotalSpend } from './campaigns'
import { createClient } from '@/lib/supabase/server'

export interface SyncResult {
  campaignsCount: number
  totalSpend: number
  success: boolean
}

export async function syncMetaAds(
  accessToken: string,
  adAccountId: string,
  projectId: string
): Promise<SyncResult> {
  const supabase = await createClient()
  
  try {
    const client = new MetaAdsClient({
      access_token: accessToken,
      ad_account_id: adAccountId,
    })

    const campaigns = await fetchCampaigns(client, {
      limit: 100,
    })

    const totalSpend = calculateTotalSpend(campaigns)

    const { error } = await supabase
      .from('sync_logs')
      .insert({
        project_id: projectId,
        type: 'meta_ads_campaigns',
        status: 'success',
        records_processed: campaigns.length,
        completed_at: new Date().toISOString(),
      })

    if (error) {
      console.error('Failed to insert sync log:', error)
    }

    return {
      campaignsCount: campaigns.length,
      totalSpend,
      success: true,
    }
  } catch (error) {
    console.error('Meta Ads sync failed:', error)
    
    await supabase
      .from('sync_logs')
      .insert({
        project_id: projectId,
        type: 'meta_ads_campaigns',
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
        completed_at: new Date().toISOString(),
      })

    return {
      campaignsCount: 0,
      totalSpend: 0,
      success: false,
    }
  }
}