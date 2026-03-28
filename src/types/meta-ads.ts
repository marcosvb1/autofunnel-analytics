export interface MetaCampaign {
  id: string
  name: string
  status: 'active' | 'paused' | 'deleted' | 'archived'
  objective: string
  daily_budget: string | null
  lifetime_budget: string | null
  created_time: string
  start_time: string
  stop_time: string | null
}

export interface MetaAdSet {
  id: string
  name: string
  campaign_id: string
  status: 'active' | 'paused'
  daily_budget: string | null
  targeting: {
    age_min?: number
    age_max?: number
    genders?: number[]
    geo_locations?: {
      countries?: string[]
      regions?: string[]
      cities?: string[]
    }
    device_platforms?: string[]
    publisher_platforms?: string[]
  }
}

export interface MetaAd {
  id: string
  name: string
  adset_id: string
  campaign_id: string
  status: 'active' | 'paused'
  creative: {
    name: string
    object_url?: string
    image_url?: string
    body?: string
    title?: string
    call_to_action_type?: string
  }
}

export interface MetaAdAccount {
  id: string
  name: string
  business_id: string
  business_name: string
  currency: string
  timezone_name: string
  amount_spent: string
  balance: string
}

export interface MetaCampaignInsights {
  id: string
  campaign_id: string
  date_start: string
  date_stop: string
  impressions: string
  clicks: string
  spend: string
  reach: string
  actions: Array<{
    action_type: string
    value: string
  }>
}

export interface MetaAdsCredentials {
  access_token: string
  ad_account_id: string
}

export interface MetaOAuthResponse {
  access_token: string
  expires_in: number
  token_type: string
}

