import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateOAuthUrl, getOAuthConfig } from '@/lib/integrations/meta-ads/oauth'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const projectId = request.nextUrl.searchParams.get('project_id')
    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 })
    }

    const state = JSON.stringify({
      userId: user.id,
      projectId,
      timestamp: Date.now(),
    })

    const config = getOAuthConfig()
    const oauthUrl = generateOAuthUrl(config, state)

    return NextResponse.redirect(oauthUrl)
  } catch (error) {
    console.error('OAuth initiate error:', error)
    return NextResponse.json(
      { error: 'Failed to initiate OAuth' },
      { status: 500 }
    )
  }
}