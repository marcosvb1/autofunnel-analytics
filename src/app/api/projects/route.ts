import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getProjects, createProject } from '@/lib/db/projects'
import { createProjectSchema } from '@/lib/validations/project'
import { MOCK_MODE } from '@/lib/mock/config'
import { mockProjects } from '@/lib/mock/data'

export async function GET() {
  if (MOCK_MODE) {
    return NextResponse.json({ projects: mockProjects })
  }

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const projects = await getProjects(user.id)
    return NextResponse.json({ projects })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  if (MOCK_MODE) {
    return NextResponse.json(
      { error: 'Project creation disabled in demo mode' },
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
    const validated = createProjectSchema.parse(body)
    
    const project = await createProject(user.id, validated)
    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}