import { NextRequest, NextResponse } from 'next/server'
import { exchangeCodeForToken, getLongLivedToken, getOAuthConfig } from '@/lib/integrations/meta-ads/oauth'
import { createIntegration } from '@/lib/db/integrations'
import { createClient } from '@/lib/supabase/server'

const STATE_EXPIRY_MS = 10 * 60 * 1000 // 10 minutes

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const code = request.nextUrl.searchParams.get('code')
    const stateParam = request.nextUrl.searchParams.get('state')
    
    if (!code || !stateParam) {
      return NextResponse.json({ error: 'Missing code or state' }, { status: 400 })
    }

    const state = JSON.parse(stateParam)
    
    if (state.userId !== user.id) {
      return NextResponse.json({ error: 'State user mismatch' }, { status: 403 })
    }

    const stateAge = Date.now() - state.timestamp
    if (stateAge > STATE_EXPIRY_MS) {
      return NextResponse.json({ error: 'State expired' }, { status: 400 })
    }

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