import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createIntegration, getIntegration } from '@/lib/db/integrations'
import { posthogIntegrationSchema } from '@/lib/validations/integration'
import { PostHogClient } from '@/lib/integrations/posthog/client'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validated = posthogIntegrationSchema.parse(body)
    
    const projectId = request.headers.get('x-project-id')
    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 })
    }

    const client = new PostHogClient(validated.api_key, validated.project_id)
    const isValid = await client.testConnection()
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid PostHog credentials' },
        { status: 400 }
      )
    }

    const existing = await getIntegration(projectId, 'posthog')
    if (existing) {
      return NextResponse.json(
        { error: 'PostHog already connected' },
        { status: 400 }
      )
    }

    const integration = await createIntegration(projectId, 'posthog', {
      api_key: validated.api_key,
      project_id: validated.project_id,
      host: validated.host,
    })

    return NextResponse.json({ integration }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Failed to connect PostHog' },
      { status: 500 }
    )
  }
}