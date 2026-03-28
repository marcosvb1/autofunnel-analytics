import { PostHogClient } from './client'
import { fetchPaths } from './paths'
import { fetchEvents } from './events'
import { createClient } from '@/lib/supabase/server'

export interface SyncResult {
  pathsCount: number
  eventsCount: number
  success: boolean
}

export async function syncPostHogPaths(
  client: PostHogClient,
  projectId: string,
  options?: {
    startDate?: string
    endDate?: string
  }
): Promise<SyncResult> {
  const supabase = await createClient()
  
  const paths = await fetchPaths(client, {
    startDate: options?.startDate || getDefaultStartDate(),
    endDate: options?.endDate || getDefaultEndDate(),
    limit: 1000,
  })

  const events = await fetchEvents(client, {
    startDate: options?.startDate || getDefaultStartDate(),
    endDate: options?.endDate || getDefaultEndDate(),
    limit: 1000,
  })

  const pathsJson = paths.map(p => ({
    nodes: p.nodes.map(n => ({
      url: n.url,
      type: n.type,
      occurrences: n.occurrences,
      percentage: n.percentage,
    })),
    occurrences: p.occurrences,
    conversion_rate: p.conversion_rate,
  }))

  const eventsJson = events.map(e => ({
    event: e.event,
    url: e.url,
    timestamp: e.timestamp,
    distinct_id: e.distinct_id,
  }))

  await supabase
    .from('sync_logs')
    .insert({
      project_id: projectId,
      type: 'posthog_paths',
      status: 'success',
      records_processed: paths.length,
      completed_at: new Date().toISOString(),
    })

  await supabase
    .from('sync_logs')
    .insert({
      project_id: projectId,
      type: 'posthog_events',
      status: 'success',
      records_processed: events.length,
      completed_at: new Date().toISOString(),
    })

  return {
    pathsCount: paths.length,
    eventsCount: events.length,
    success: true,
  }
}

function getDefaultStartDate(): string {
  const date = new Date()
  date.setDate(date.getDate() - 7)
  return date.toISOString().split('T')[0]
}

function getDefaultEndDate(): string {
  return new Date().toISOString().split('T')[0]
}