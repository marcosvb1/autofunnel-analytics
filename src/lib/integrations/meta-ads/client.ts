import type { MetaAdsCredentials, MetaAdAccount, MetaCampaign, MetaCampaignInsights } from '@/types/meta-ads'

const GRAPH_API_BASE = 'https://graph.facebook.com/v18.0'

export class MetaAdsClient {
  private accessToken: string
  private adAccountId: string | null

  constructor(credentials: MetaAdsCredentials | string, adAccountId?: string) {
    if (typeof credentials === 'string') {
      this.accessToken = credentials
      this.adAccountId = adAccountId || null
    } else {
      this.accessToken = credentials.access_token
      this.adAccountId = credentials.ad_account_id
    }

    if (!this.accessToken) {
      throw new Error('Access token is required')
    }
  }

  private async request(endpoint: string, params?: Record<string, string>, timeoutMs: number = 30000) {
    const url = new URL(`${GRAPH_API_BASE}/${endpoint}`)
    
    url.searchParams.append('access_token', this.accessToken)
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const response = await fetch(url.toString(), {
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`Meta API error: ${error.error?.message || response.status}`)
      }

      return response.json()
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Meta API request timed out after ${timeoutMs / 1000}s`)
      }
      throw error
    } finally {
      clearTimeout(timeoutId)
    }
  }

  async getUser(): Promise<{ id: string; name: string }> {
    const data = await this.request('me', { fields: 'id,name' })
    return data
  }

  async getAdAccounts(): Promise<MetaAdAccount[]> {
    const data = await this.request('me/adaccounts', {
      fields: 'id,name,business_id,business_name,currency,timezone_name,amount_spent,balance',
    })
    return data.data || []
  }

  async getCampaigns(options?: {
    limit?: number
    status?: string
  }): Promise<MetaCampaign[]> {
    if (!this.adAccountId) {
      throw new Error('Ad account ID is required')
    }

    const data = await this.request(`act_${this.adAccountId}/campaigns`, {
      fields: 'id,name,status,objective,daily_budget,lifetime_budget,created_time,start_time,stop_time',
      limit: String(options?.limit || 100),
      ...(options?.status && { effective_status: JSON.stringify([options.status]) }),
    })
    return data.data || []
  }

  async getCampaignInsights(campaignId: string, options?: {
    date_start?: string
    date_end?: string
  }): Promise<MetaCampaignInsights | null> {
    if (!this.adAccountId) {
      throw new Error('Ad account ID is required')
    }

    const data = await this.request(`act_${this.adAccountId}/insights`, {
      filtering: JSON.stringify([{ field: 'campaign.id', operator: 'EQUAL', value: campaignId }]),
      fields: 'campaign_id,date_start,date_stop,impressions,clicks,spend,reach,actions',
      date_preset: 'last_7d',
      ...(options?.date_start && { date_start: options.date_start }),
      ...(options?.date_end && { date_end: options.date_end }),
    })
    return data.data?.[0] || null
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.getUser()
      return true
    } catch {
      return false
    }
  }
}