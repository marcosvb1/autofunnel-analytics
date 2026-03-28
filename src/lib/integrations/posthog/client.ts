import type { PostHogCredentials, PostHogPathsResponse, PostHogEventsResponse } from '@/types/posthog'

const DEFAULT_HOST = 'https://app.posthog.com'

export class PostHogClient {
  private apiKey: string
  private projectId: string
  private host: string

  constructor(credentials: PostHogCredentials | string, projectId?: string) {
    if (typeof credentials === 'string') {
      this.apiKey = credentials
      this.projectId = projectId!
    } else {
      this.apiKey = credentials.api_key
      this.projectId = credentials.project_id
      this.host = credentials.host || DEFAULT_HOST
    }

    if (!this.apiKey) {
      throw new Error('API key is required')
    }

    if (!this.projectId) {
      throw new Error('Project ID is required')
    }

    this.host = this.host || DEFAULT_HOST
  }

  private async request(endpoint: string, params?: Record<string, unknown>) {
    const url = new URL(`${this.host}/api/projects/${this.projectId}/${endpoint}`)
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`PostHog API error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  async getPaths(options?: {
    start_date?: string
    end_date?: string
    limit?: number
  }): Promise<PostHogPathsResponse> {
    return this.request('path_analysis', {
      ...options,
      include_start_nodes: true,
      include_end_nodes: true,
    })
  }

  async getEvents(options?: {
    start_date?: string
    end_date?: string
    limit?: number
    event?: string
  }): Promise<PostHogEventsResponse> {
    return this.request('events', {
      ...options,
      breakdown_type: 'url',
    })
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.getEvents({ limit: 1 })
      return true
    } catch {
      return false
    }
  }

  async query(sql: string, options?: {
    refresh?: 'blocking' | 'async' | 'force_blocking'
  }): Promise<{ results: Record<string, unknown>[] }> {
    const response = await fetch(`${this.host}/api/projects/${this.projectId}/query/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: {
          kind: 'HogQLQuery',
          query: sql,
        },
        refresh: options?.refresh || 'blocking',
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`HogQL query failed: ${response.status} - ${error}`)
    }

    return response.json()
  }

  async getPathsQuery(options?: {
    startPoint?: string
    endPoint?: string
    stepCount?: number
    eventTypes?: ('pageview' | 'screen' | 'custom')[]
  }): Promise<{ results: unknown[] }> {
    const body = {
      query: {
        kind: 'PathsQuery',
        source: {
          kind: 'EventsNode',
          ...(options?.eventTypes && { 
            event_types: options.eventTypes 
          }),
        },
        ...(options?.startPoint && { start_point: options.startPoint }),
        ...(options?.endPoint && { end_point: options.endPoint }),
        stepCount: options?.stepCount || 5,
      },
      refresh: 'blocking',
    }

    const response = await fetch(`${this.host}/api/projects/${this.projectId}/query/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`PathsQuery failed: ${response.status}`)
    }

    return response.json()
  }
}