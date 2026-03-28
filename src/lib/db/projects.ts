import { createClient } from '@/lib/supabase/server'
import type { CreateProjectInput, UpdateProjectInput } from '@/lib/validations/project'

export async function getProjects(userId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      integrations (*),
      funnel_maps (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getProject(projectId: string, userId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      integrations (*),
      funnel_maps (*)
    `)
    .eq('id', projectId)
    .eq('user_id', userId)
    .single()

  if (error) throw error
  return data
}

export async function createProject(userId: string, input: CreateProjectInput) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('projects')
    .insert({
      user_id: userId,
      name: input.name,
      description: input.description,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateProject(
  projectId: string, 
  userId: string, 
  input: UpdateProjectInput
) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('projects')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq('id', projectId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteProject(projectId: string, userId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)
    .eq('user_id', userId)

  if (error) throw error
}