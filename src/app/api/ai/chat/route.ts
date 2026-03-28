import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { processEdit } from '@/lib/ai/processing/editor'
import type { FunnelMap, FunnelEditResult } from '@/types/funnel'

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
    const { mapId, message } = body

    if (!mapId || typeof mapId !== 'string') {
      return NextResponse.json({ error: 'Map ID required' }, { status: 400 })
    }

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message required' }, { status: 400 })
    }

    const { data: funnelRow, error: fetchError } = await supabase
      .from('funnel_maps')
      .select('*')
      .eq('id', mapId)
      .eq('project_id', projectId)
      .single()

    if (fetchError || !funnelRow) {
      return NextResponse.json(
        { error: 'Funnel map not found' },
        { status: 404 }
      )
    }

    const funnel: FunnelMap = {
      id: funnelRow.id,
      projectId: funnelRow.project_id,
      name: funnelRow.name,
      nodes: funnelRow.nodes as unknown as FunnelMap['nodes'],
      edges: funnelRow.edges as unknown as FunnelMap['edges'],
      metadata: funnelRow.metadata as unknown as FunnelMap['metadata'],
    }

    const result: FunnelEditResult = await processEdit(funnel, message)

    if (result.success) {
      const { error: updateError } = await supabase
        .from('funnel_maps')
        .update({
          nodes: result.nodes as unknown as Record<string, unknown>[],
          edges: result.edges as unknown as Record<string, unknown>[],
          updated_at: new Date().toISOString(),
        })
        .eq('id', mapId)

      if (updateError) {
        console.error('Failed to update funnel:', updateError)
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Chat edit error:', error)
    return NextResponse.json(
      { error: 'Failed to process edit' },
      { status: 500 }
    )
  }
}