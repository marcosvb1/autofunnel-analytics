import type { MetaOAuthResponse } from '@/types/meta-ads'

const GRAPH_API_BASE = 'https://graph.facebook.com/v18.0'
const OAUTH_BASE = 'https://www.facebook.com/v18.0/dialog/oauth'

interface OAuthConfig {
  appId: string
  appSecret: string
  redirectUri: string
}

export function generateOAuthUrl(config: OAuthConfig, state: string): string {
  const params = new URLSearchParams({
    client_id: config.appId,
    redirect_uri: config.redirectUri,
    state,
    response_type: 'code',
    scope: 'ads_management,ads_read,business_management',
  })

  return `${OAUTH_BASE}?${params.toString()}`
}

export async function exchangeCodeForToken(
  code: string,
  config: OAuthConfig
): Promise<MetaOAuthResponse> {
  const url = new URL(`${GRAPH_API_BASE}/oauth/access_token`)
  
  url.searchParams.append('client_id', config.appId)
  url.searchParams.append('client_secret', config.appSecret)
  url.searchParams.append('redirect_uri', config.redirectUri)
  url.searchParams.append('code', code)

  const response = await fetch(url.toString())

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`OAuth error: ${error.error?.message || response.status}`)
  }

  return response.json()
}

export async function getLongLivedToken(
  shortLivedToken: string,
  config: OAuthConfig
): Promise<MetaOAuthResponse> {
  const url = new URL(`${GRAPH_API_BASE}/oauth/access_token`)
  
  url.searchParams.append('grant_type', 'fb_exchange_token')
  url.searchParams.append('client_id', config.appId)
  url.searchParams.append('client_secret', config.appSecret)
  url.searchParams.append('fb_exchange_token', shortLivedToken)

  const response = await fetch(url.toString())

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Token exchange error: ${error.error?.message || response.status}`)
  }

  return response.json()
}

export function getOAuthConfig(): OAuthConfig {
  const appId = process.env.META_APP_ID
  const appSecret = process.env.META_APP_SECRET
  const appUrl = process.env.NEXT_PUBLIC_APP_URL

  if (!appId || !appSecret || !appUrl) {
    throw new Error('Missing Meta OAuth environment variables: META_APP_ID, META_APP_SECRET, NEXT_PUBLIC_APP_URL')
  }

  return {
    appId,
    appSecret,
    redirectUri: `${appUrl}/auth/meta-ads/callback`,
  }
}