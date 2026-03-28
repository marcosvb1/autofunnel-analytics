import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getIntegration, updateIntegration } from '@/lib/db/integrations'
import { MetaAdsClient } from '@/lib/integrations/meta-ads/client'

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
        { error: 'Complete OAuth first' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { ad_account_id } = body

    if (!ad_account_id || typeof ad_account_id !== 'string') {
      return NextResponse.json({ error: 'Ad account ID required' }, { status: 400 })
    }

    const credentials = integration.credentials as { access_token: string }
    const client = new MetaAdsClient(credentials.access_token, ad_account_id)
    
    const isValid = await client.testConnection()
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid ad account' },
        { status: 400 }
      )
    }

    const updated = await updateIntegration(integration.id, {
      credentials: {
        ...credentials,
        ad_account_id,
      },
    })

    return NextResponse.json({ integration: updated })
  } catch (error) {
    console.error('Set ad account error:', error)
    return NextResponse.json(
      { error: 'Failed to set ad account' },
      { status: 500 }
    )
  }
}