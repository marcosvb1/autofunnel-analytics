'use client'

import { useState } from 'react'
import type { Tables } from '@/types/database'

export function useIntegrations(projectId: string) {
  const [integrations, setIntegrations] = useState<Tables<'integrations'>[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connectPostHog = async (apiKey: string, posthogProjectId: string, host?: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
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
      
      setIntegrations(prev => [...prev, data.integration])
      return data.integration
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect PostHog')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const syncPostHog = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
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
      
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync PostHog')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectPostHog = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
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
      
      setIntegrations(prev => prev.filter(i => i.type !== 'posthog'))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect PostHog')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    integrations,
    isLoading,
    error,
    connectPostHog,
    syncPostHog,
    disconnectPostHog,
  }
}