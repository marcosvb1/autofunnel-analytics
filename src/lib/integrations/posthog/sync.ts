import { PostHogClient } from './client'
import { fetchPaths, type NormalizedPath } from './paths'
import { fetchEvents, type NormalizedEvent } from './events'
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
  
  const CHUNK_SIZE = 100
  const MAX_PAGES = 10
  
  const allPaths: NormalizedPath[] = []
  let hasMorePaths = true
  let pagesFetched = 0
  
  while (hasMorePaths && pagesFetched < MAX_PAGES) {
    const paths = await fetchPaths(client, {
      startDate: options?.startDate || getDefaultStartDate(),
      endDate: options?.endDate || getDefaultEndDate(),
      limit: CHUNK_SIZE,
      offset: allPaths.length,
    })

    if (paths.length === 0) {
      hasMorePaths = false
    } else {
      allPaths.push(...paths)
      pagesFetched++
    }
  }

  const allEvents: NormalizedEvent[] = []
  let hasMoreEvents = true
  let eventPagesFetched = 0
  
  while (hasMoreEvents && eventPagesFetched < MAX_PAGES) {
    const events = await fetchEvents(client, {
      startDate: options?.startDate || getDefaultStartDate(),
      endDate: options?.endDate || getDefaultEndDate(),
      limit: CHUNK_SIZE,
      offset: allEvents.length,
    })

    if (events.length === 0) {
      hasMoreEvents = false
    } else {
      allEvents.push(...events)
      eventPagesFetched++
    }
  }

  const pathsJson = allPaths.map(p => ({
    nodes: p.nodes.map(n => ({
      url: n.url,
      type: n.type,
      occurrences: n.occurrences,
      percentage: n.percentage,
    })),
    occurrences: p.occurrences,
    conversion_rate: p.conversion_rate,
  }))

  const eventsJson = allEvents.map(e => ({
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
      records_processed: allPaths.length,
      completed_at: new Date().toISOString(),
    })

  await supabase
    .from('sync_logs')
    .insert({
      project_id: projectId,
      type: 'posthog_events',
      status: 'success',
      records_processed: allEvents.length,
      completed_at: new Date().toISOString(),
    })

  return {
    pathsCount: allPaths.length,
    eventsCount: allEvents.length,
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