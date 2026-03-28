export interface PostHogPath {
  paths: PostHogPathNode[]
  start_node: string
  end_node: string
  path_length: number
  occurrences: number
}

export interface PostHogPathNode {
  node: string
  node_type: 'pageview' | 'event' | 'action'
  occurrences: number
  percentage: number
}

export interface PostHogEvent {
  event: string
  properties: Record<string, unknown>
  timestamp: string
  distinct_id: string
  url: string | null
}

export interface PostHogPathsResponse {
  results: PostHogPath[]
  has_more: boolean
  next_page: number | null
}

export interface PostHogEventsResponse {
  results: PostHogEvent[]
  has_more: boolean
  next_page: number | null
}

export interface PostHogCredentials {
  api_key: string
  project_id: string
  host?: string
}