import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getIntegration } from '@/lib/db/integrations'
import { MetaAdsClient } from '@/lib/integrations/meta-ads/client'
import { mockMetaAdsAccounts } from '@/lib/mock/data'

const MOCK_MODE = process.env.MOCK_MODE === 'true'

export async function GET(request: NextRequest) {
  if (MOCK_MODE) {
    return NextResponse.json({ accounts: mockMetaAdsAccounts })
  }

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

    const credentials = integration.credentials as { access_token: string }
    const client = new MetaAdsClient(credentials.access_token)
    
    const accounts = await client.getAdAccounts()

    return NextResponse.json({ accounts })
  } catch (error) {
    console.error('Accounts fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ad accounts' },
      { status: 500 }
    )
  }
}