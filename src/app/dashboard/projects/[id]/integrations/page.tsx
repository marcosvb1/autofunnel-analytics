'use client'

import { useState, useEffect } from 'react'
import IntegrationStatus from '@/components/integrations/integration-status'
import PostHogForm from './posthog-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Integration {
  id: string
  type: 'posthog' | 'meta_ads' | 'google_ads'
  status: 'connected' | 'disconnected' | 'error'
  last_sync_at: string | null
}

export default function IntegrationsPage({ params }: { params: Promise<{ id: string }> }) {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [projectId, setProjectId] = useState<string>('')
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)

  useEffect(() => {
    params.then(p => setResolvedParams(p))
  }, [params])

  useEffect(() => {
    if (!resolvedParams) return
    setProjectId(resolvedParams.id)
    
    const fetchIntegrations = async () => {
      const response = await fetch(`/api/projects/${resolvedParams.id}`)
      const data = await response.json()
      setIntegrations(data.project?.integrations || [])
      setIsLoading(false)
    }
    fetchIntegrations()
  }, [resolvedParams])

  const handleSync = async () => {
    await fetch('/api/integrations/posthog/sync', {
      method: 'POST',
      headers: { 'x-project-id': projectId },
    })
  }

  const handleDisconnect = async () => {
    await fetch('/api/integrations/posthog/disconnect', {
      method: 'DELETE',
      headers: { 'x-project-id': projectId },
    })
    setIntegrations(prev => prev.filter(i => i.type !== 'posthog'))
  }

  const posthogIntegration = integrations.find(i => i.type === 'posthog')

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Integrations</h1>

      {posthogIntegration ? (
        <Card>
          <CardHeader>
            <CardTitle>PostHog</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <IntegrationStatus integration={posthogIntegration} />
            
            <div className="flex gap-2">
              <Button onClick={handleSync}>Sync Now</Button>
              <Button variant="destructive" onClick={handleDisconnect}>
                Disconnect
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <PostHogForm projectId={projectId} onConnected={() => {
          setIntegrations(prev => [...prev, {
            id: 'new',
            type: 'posthog',
            status: 'connected',
            last_sync_at: null,
          }])
        }} />
      )}
    </div>
  )
}