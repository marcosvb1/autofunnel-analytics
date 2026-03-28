import { createClient } from '@/lib/supabase/server'

export async function getIntegration(projectId: string, type: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('integrations')
    .select('*')
    .eq('project_id', projectId)
    .eq('type', type)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function getProjectIntegrations(projectId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('integrations')
    .select('*')
    .eq('project_id', projectId)

  if (error) throw error
  return data
}

export async function createIntegration(
  projectId: string,
  type: 'posthog' | 'meta_ads' | 'google_ads',
  credentials: Record<string, unknown>
) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('integrations')
    .insert({
      project_id: projectId,
      type,
      credentials,
      status: 'connected',
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateIntegration(
  integrationId: string,
  updates: {
    credentials?: Record<string, unknown>
    status?: 'connected' | 'disconnected' | 'error'
    last_sync_at?: string
  }
) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('integrations')
    .update(updates)
    .eq('id', integrationId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteIntegration(integrationId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('integrations')
    .delete()
    .eq('id', integrationId)

  if (error) throw error
}

export async function deleteProjectIntegrations(projectId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('integrations')
    .delete()
    .eq('project_id', projectId)

  if (error) throw error
}