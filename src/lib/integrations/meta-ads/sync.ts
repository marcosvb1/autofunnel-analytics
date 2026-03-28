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
  
  const client = new MetaAdsClient({
    access_token: accessToken,
    ad_account_id: adAccountId,
  })

  const campaigns = await fetchCampaigns(client, {
    limit: 100,
  })

  const totalSpend = calculateTotalSpend(campaigns)

  await supabase
    .from('sync_logs')
    .insert({
      project_id: projectId,
      type: 'meta_ads_campaigns',
      status: 'success',
      records_processed: campaigns.length,
      completed_at: new Date().toISOString(),
    })

  return {
    campaignsCount: campaigns.length,
    totalSpend,
    success: true,
  }
}