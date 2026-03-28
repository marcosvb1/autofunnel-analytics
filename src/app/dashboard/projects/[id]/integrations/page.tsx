'use client'

import { useState, useEffect } from 'react'
import IntegrationStatus from '@/components/integrations/integration-status'
import PostHogForm from './posthog-form'
import MetaAdsForm from './meta-ads-form'
import MetaAdsSection from '@/components/integrations/meta-ads-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useMetaAds } from '@/hooks/use-meta-ads'
import type { Tables } from '@/types/database'

type Integration = Tables<'integrations'>

export default function IntegrationsPage({ params }: { params: Promise<{ id: string }> }) {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [projectId, setProjectId] = useState<string>('')
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)
  const [showMetaAdsForm, setShowMetaAdsForm] = useState(false)
  const { sync: syncMetaAds, disconnect: disconnectMetaAds } = useMetaAds(projectId)

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

  const handlePostHogSync = async () => {
    await fetch('/api/integrations/posthog/sync', {
      method: 'POST',
      headers: { 'x-project-id': projectId },
    })
  }

  const handlePostHogDisconnect = async () => {
    await fetch('/api/integrations/posthog/disconnect', {
      method: 'DELETE',
      headers: { 'x-project-id': projectId },
    })
    setIntegrations(prev => prev.filter(i => i.type !== 'posthog'))
  }

  const handleMetaAdsSync = async () => {
    await syncMetaAds()
    const response = await fetch(`/api/projects/${projectId}`)
    const data = await response.json()
    setIntegrations(data.project?.integrations || [])
  }

  const handleMetaAdsDisconnect = async () => {
    await disconnectMetaAds()
    setIntegrations(prev => prev.filter(i => i.type !== 'meta_ads'))
  }

  const handleMetaAdsConnected = () => {
    setShowMetaAdsForm(false)
    const fetchIntegrations = async () => {
      const response = await fetch(`/api/projects/${projectId}`)
      const data = await response.json()
      setIntegrations(data.project?.integrations || [])
    }
    fetchIntegrations()
  }

  const posthogIntegration = integrations.find(i => i.type === 'posthog')
  const metaAdsIntegration = integrations.find(i => i.type === 'meta_ads')

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
              <Button onClick={handlePostHogSync}>Sync Now</Button>
              <Button variant="destructive" onClick={handlePostHogDisconnect}>
                Disconnect
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <PostHogForm projectId={projectId} onConnected={() => {
          setIntegrations(prev => [...prev, {
            id: 'new',
            project_id: projectId,
            type: 'posthog',
            status: 'connected',
            last_sync_at: null,
            credentials: {},
            created_at: new Date().toISOString(),
          }])
        }} />
      )}

      {metaAdsIntegration ? (
        <Card>
          <CardHeader>
            <CardTitle>Meta Ads</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <IntegrationStatus integration={metaAdsIntegration} />
            
            <div className="flex gap-2">
              <Button onClick={handleMetaAdsSync}>Sync Now</Button>
              <Button variant="destructive" onClick={handleMetaAdsDisconnect}>
                Disconnect
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : showMetaAdsForm ? (
        <MetaAdsForm projectId={projectId} onConnected={handleMetaAdsConnected} />
      ) : (
        <MetaAdsSection 
          projectId={projectId} 
          posthogConnected={!!posthogIntegration}
          onOAuthConnect={() => setShowMetaAdsForm(true)}
        />
      )}
    </div>
  )
}