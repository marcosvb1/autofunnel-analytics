import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getIntegration } from '@/lib/db/integrations'
import { PostHogClient } from '@/lib/integrations/posthog/client'
import { detectFunnel } from '@/lib/ai/processing/funnel-detector'
import { getDefaultExcludePatterns, getDefaultConversionUrls } from '@/lib/ai/prompts/funnel-detection'
import type { FunnelDetectionInput } from '@/types/funnel'
import type { PostHogPath } from '@/types/posthog'

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

    const body = await request.json()
    const { conversionUrls, excludePatterns } = body

    const posthogIntegration = await getIntegration(projectId, 'posthog')
    if (!posthogIntegration) {
      return NextResponse.json(
        { error: 'PostHog integration not found' },
        { status: 400 }
      )
    }

    const credentials = posthogIntegration.credentials as {
      api_key: string
      project_id: string
      host?: string
    }

    const posthogClient = new PostHogClient({
      api_key: credentials.api_key,
      project_id: credentials.project_id,
      host: credentials.host,
    })

    const pathsData = await posthogClient.getPaths({ limit: 100 })
    const paths = transformPaths(pathsData.results || [])

    const input: FunnelDetectionInput = {
      paths,
      conversionUrls: conversionUrls || getDefaultConversionUrls(),
      excludePatterns: excludePatterns || getDefaultExcludePatterns(),
    }

    const result = await detectFunnel(input, projectId)

    const { data: savedFunnel, error: saveError } = await supabase
      .from('funnel_maps')
      .insert({
        project_id: projectId,
        name: result.funnel.name,
        nodes: result.funnel.nodes as unknown as Record<string, unknown>[],
        edges: result.funnel.edges as unknown as Record<string, unknown>[],
        metadata: result.funnel.metadata as unknown as Record<string, unknown>,
        is_auto_generated: true,
      })
      .select()
      .single()

    if (saveError) {
      console.error('Failed to save funnel:', saveError)
      return NextResponse.json(
        { error: 'Failed to save funnel to database' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      funnel: {
        ...savedFunnel,
        nodes: savedFunnel.nodes as unknown as typeof result.funnel.nodes,
        edges: savedFunnel.edges as unknown as typeof result.funnel.edges,
        metadata: savedFunnel.metadata as unknown as typeof result.funnel.metadata,
      },
      model: result.model,
    }, { status: 201 })
  } catch (error) {
    console.error('Funnel detection error:', error)
    return NextResponse.json(
      { error: 'Failed to detect funnel' },
      { status: 500 }
    )
  }
}

function transformPaths(paths: PostHogPath[]): FunnelDetectionInput['paths'] {
  return paths.map((path) => ({
    nodes: path.paths.map((p) => p.node),
    occurrences: path.occurrences,
  }))
}