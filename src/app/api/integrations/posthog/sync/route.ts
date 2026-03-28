import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getIntegration, updateIntegration } from '@/lib/db/integrations'
import { PostHogClient } from '@/lib/integrations/posthog/client'
import { syncPostHogPaths } from '@/lib/integrations/posthog/sync'

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

    const integration = await getIntegration(projectId, 'posthog')
    if (!integration) {
      return NextResponse.json(
        { error: 'PostHog not connected' },
        { status: 400 }
      )
    }

    const credentials = integration.credentials as {
      api_key: string
      project_id: string
      host?: string
    }

    const client = new PostHogClient(credentials)
    
    const result = await syncPostHogPaths(client, projectId)
    
    await updateIntegration(integration.id, {
      last_sync_at: new Date().toISOString(),
    })

    return NextResponse.json({ 
      success: true,
      paths_processed: result.pathsCount,
      events_processed: result.eventsCount,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to sync PostHog data' },
      { status: 500 }
    )
  }
}