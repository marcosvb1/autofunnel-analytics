import { NextRequest, NextResponse } from 'next/server'
import { exchangeCodeForToken, getLongLivedToken, getOAuthConfig } from '@/lib/integrations/meta-ads/oauth'
import { createIntegration } from '@/lib/db/integrations'

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get('code')
    const stateParam = request.nextUrl.searchParams.get('state')
    
    if (!code || !stateParam) {
      return NextResponse.json({ error: 'Missing code or state' }, { status: 400 })
    }

    const state = JSON.parse(stateParam)
    const config = getOAuthConfig()

    const shortLivedToken = await exchangeCodeForToken(code, config)
    const longLivedToken = await getLongLivedToken(shortLivedToken.access_token, config)

    await createIntegration(state.projectId, 'meta_ads', {
      access_token: longLivedToken.access_token,
      expires_in: longLivedToken.expires_in,
      user_id: state.userId,
    })

    const redirectUrl = new URL(`/dashboard/projects/${state.projectId}/integrations`, process.env.NEXT_PUBLIC_APP_URL)
    redirectUrl.searchParams.append('meta_ads_connected', 'true')

    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.json(
      { error: 'Failed to complete OAuth' },
      { status: 500 }
    )
  }
}