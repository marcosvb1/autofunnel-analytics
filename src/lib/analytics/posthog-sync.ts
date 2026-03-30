const POSTHOG_API_BASE = 'https://us.i.posthog.com/api'
const POSTHOG_PROJECT_ID = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_ID
const POSTHOG_API_KEY = process.env.POSTHOG_API_KEY

export interface FunnelPath {
  nodes: string[]
  occurrences: number
}

export interface PageView {
  url: string
  count: number
}

export async function fetchFunnelPaths(projectId: string, days: number = 30): Promise<FunnelPath[]> {
  const response = await fetch(`${POSTHOG_API_BASE}/projects/${POSTHOG_PROJECT_ID}/insights/funnel/`, {
    headers: {
      'Authorization': `Bearer ${POSTHOG_API_KEY}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch funnel paths: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data.results?.map((r: any) => ({
    nodes: r.nodes,
    occurrences: r.occurrences,
  })) || []
}

export async function fetchPageViews(projectId: string): Promise<PageView[]> {
  const response = await fetch(`${POSTHOG_API_BASE}/projects/${POSTHOG_PROJECT_ID}/events/`, {
    headers: {
      'Authorization': `Bearer ${POSTHOG_API_KEY}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch page views: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data.results?.map((e: any) => ({
    url: e.properties.$current_url,
    count: e.count,
  })) || []
}
