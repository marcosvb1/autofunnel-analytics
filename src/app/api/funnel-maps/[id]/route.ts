import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    
    const { data, error } = await supabase
      .from('funnel_maps')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

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
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    
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