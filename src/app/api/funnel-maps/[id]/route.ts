import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { MOCK_MODE } from '@/lib/mock/config'
import { mockFunnelMap } from '@/lib/mock/data'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (MOCK_MODE) {
    if (id === 'fm-001') {
      return NextResponse.json({ funnelMap: mockFunnelMap })
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { data, error } = await supabase
      .from('funnel_maps')
      .select('*, projects!inner(user_id)')
      .eq('id', id)
      .eq('projects.user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json({ funnelMap: data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch funnel map' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (MOCK_MODE) {
    return NextResponse.json(
      { error: 'Editing disabled in demo mode' },
      { status: 403 }
    )
  }

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    const { data: existing, error: fetchError } = await supabase
      .from('funnel_maps')
      .select('id, projects!inner(user_id)')
      .eq('id', id)
      .eq('projects.user_id', user.id)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
      }
      throw fetchError
    }

    const { data, error } = await supabase
      .from('funnel_maps')
      .update({
        nodes: body.nodes,
        edges: body.edges,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ funnelMap: data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update funnel map' },
      { status: 500 }
    )
  }
}