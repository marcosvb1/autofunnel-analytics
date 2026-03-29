'use client'

import type { Tables } from '@/types/database'
import { useCachedFetch } from './use-cache'

export function useIntegrations(projectId: string) {
  const {
    data: integrations,
    isLoading,
    error,
    refetch,
    invalidate,
  } = useCachedFetch<Tables<'integrations'>[]>(
    `integrations:${projectId}`,
    async () => {
      const response = await fetch(`/api/integrations?projectId=${projectId}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error)
      }
      
      return data.integrations || []
    },
    { ttl: 5 * 60 * 1000, enabled: !!projectId }
  )

  const connectPostHog = async (apiKey: string, posthogProjectId: string, host?: string) => {
    const response = await fetch('/api/integrations/posthog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-project-id': projectId,
      },
      body: JSON.stringify({ api_key: apiKey, project_id: posthogProjectId, host }),
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error)
    }
    
    invalidate()
    return data.integration
  }

  const syncPostHog = async () => {
    const response = await fetch('/api/integrations/posthog/sync', {
      method: 'POST',
      headers: {
        'x-project-id': projectId,
      },
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error)
    }
    
    invalidate()
    return data
  }

  const disconnectPostHog = async () => {
    const response = await fetch('/api/integrations/posthog/disconnect', {
      method: 'DELETE',
      headers: {
        'x-project-id': projectId,
      },
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error)
    }
    
    invalidate()
    return data
  }

  return {
    integrations: integrations || [],
    isLoading,
    error,
    connectPostHog,
    syncPostHog,
    disconnectPostHog,
    refetch,
  }
}
