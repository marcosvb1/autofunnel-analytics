import { PostHogClient } from './client'
import type { PostHogEvent } from '@/types/posthog'

export interface NormalizedEvent {
  id: string
  event: string
  url: string | null
  timestamp: string
  distinct_id: string
  properties: Record<string, unknown>
}

export async function fetchEvents(
  client: PostHogClient,
  options?: {
    startDate?: string
    endDate?: string
    limit?: number
    event?: string
  }
): Promise<NormalizedEvent[]> {
  const response = await client.getEvents({
    start_date: options?.startDate,
    end_date: options?.endDate,
    limit: options?.limit || 100,
    event: options?.event,
  })

  return response.results.map(normalizeEvent)
}

function normalizeEvent(event: PostHogEvent): NormalizedEvent {
  return {
    id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    event: event.event,
    url: event.url,
    timestamp: event.timestamp,
    distinct_id: event.distinct_id,
    properties: event.properties,
  }
}

export function filterPageviewEvents(events: NormalizedEvent[]): NormalizedEvent[] {
  return events.filter(e => e.event === '$pageview' && e.url)
}

export function filterConversionEvents(
  events: NormalizedEvent[],
  conversionUrls: string[]
): NormalizedEvent[] {
  return events.filter(e => 
    conversionUrls.some(url => e.url?.includes(url))
  )
}