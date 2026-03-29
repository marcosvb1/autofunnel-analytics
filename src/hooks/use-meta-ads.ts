'use client'

import { useState } from 'react'

export function useMetaAds(projectId: string) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initiateOAuth = async () => {
    setIsLoading(true)
    setError(null)
    
    window.location.href = `/api/integrations/meta-ads/oauth/initiate?project_id=${projectId}`
  }

  const setAdAccount = async (accountId: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/integrations/meta-ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-project-id': projectId,
        },
        body: JSON.stringify({ ad_account_id: accountId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      return data.integration
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set ad account')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const sync = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/integrations/meta-ads/sync', {
        method: 'POST',
        headers: { 'x-project-id': projectId },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const disconnect = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/integrations/meta-ads/disconnect', {
        method: 'DELETE',
        headers: { 'x-project-id': projectId },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    initiateOAuth,
    setAdAccount,
    sync,
    disconnect,
  }
}