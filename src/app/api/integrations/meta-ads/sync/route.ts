import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getIntegration, updateIntegration } from '@/lib/db/integrations'
import { syncMetaAds } from '@/lib/integrations/meta-ads/sync'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const projectId = request.headers.get('x-project-id')
    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 })
    }

    const integration = await getIntegration(projectId, 'meta_ads')
    if (!integration) {
      return NextResponse.json(
        { error: 'Meta Ads not connected' },
        { status: 400 }
      )
    }

    const credentials = integration.credentials as {
      access_token: string
      ad_account_id: string
    }

    if (!credentials.ad_account_id) {
      return NextResponse.json(
        { error: 'Ad account not selected' },
        { status: 400 }
      )
    }

    const result = await syncMetaAds(
      credentials.access_token,
      credentials.ad_account_id,
      projectId
    )

    await updateIntegration(integration.id, {
      last_sync_at: new Date().toISOString(),
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { error: 'Failed to sync Meta Ads' },
      { status: 500 }
    )
  }
}