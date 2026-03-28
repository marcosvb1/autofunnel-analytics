'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface MetaAdsSectionProps {
  projectId: string
  posthogConnected: boolean
  onOAuthConnect: () => void
}

interface Campaign {
  id: string
  name: string
  status: string
  spend: number
  impressions: number
}

export default function MetaAdsSection({ 
  projectId, 
  posthogConnected,
  onOAuthConnect 
}: MetaAdsSectionProps) {
  const [mode, setMode] = useState<'checking' | 'posthog' | 'posthog-not-connected' | 'oauth'>('checking')
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!posthogConnected) {
      setMode('oauth')
      setIsLoading(false)
      return
    }

    checkPostHogMetaAdsSource()
  }, [posthogConnected, projectId])

  const checkPostHogMetaAdsSource = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/integrations/meta-ads/posthog-source', {
        headers: { 'x-project-id': projectId },
      })
      
      const data = await response.json()
      
      if (data.connected) {
        setMode('posthog')
        setCampaigns(data.campaigns || [])
      } else if (data.setupUrl) {
        setMode('posthog-not-connected')
      } else {
        setMode('oauth')
      }
    } catch {
      setMode('oauth')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-gray-500 text-center">Checking Meta Ads connection...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Meta Ads
          {mode === 'posthog' && (
            <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
              via PostHog
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mode === 'posthog' && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded p-3">
              <p className="text-green-700 text-sm">
                Meta Ads data synced via PostHog Data Warehouse.
              </p>
            </div>
            
            {campaigns.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Campaigns detected:</p>
                {campaigns.slice(0, 5).map((c) => (
                  <div key={c.id} className="p-3 bg-gray-50 rounded text-sm">
                    <div className="font-medium">{c.name}</div>
                    <div className="text-gray-600">
                      Spent: ${c.spend.toFixed(2)} | {c.impressions.toLocaleString()} impressions
                    </div>
                  </div>
                ))}
                {campaigns.length > 5 && (
                  <p className="text-xs text-gray-500">+{campaigns.length - 5} more campaigns</p>
                )}
              </div>
            )}
            
            <Button variant="outline" onClick={checkPostHogMetaAdsSource}>
              Refresh Data
            </Button>
          </div>
        )}

        {mode === 'posthog-not-connected' && (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
              <p className="font-medium">Meta Ads source not connected in PostHog.</p>
              <p className="text-gray-600 text-sm mt-1">
                Connect Meta Ads in PostHog for automatic data sync.
              </p>
            </div>

            <a 
              href="https://app.posthog.com/data-management/sources" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline block"
            >
              Open PostHog Sources
            </a>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-2">
                Alternative: Connect directly via OAuth
              </p>
              <Button variant="outline" onClick={onOAuthConnect}>
                Connect Directly
              </Button>
            </div>
          </div>
        )}

        {mode === 'oauth' && (
          <div className="space-y-4">
            {!posthogConnected && (
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-sm">
                  Recommended: Connect PostHog first for automatic Meta Ads sync.
                </p>
              </div>
            )}
            
            <p className="text-sm text-gray-600">
              Connect your ad account directly to track spend and performance.
            </p>

            <Button onClick={onOAuthConnect}>
              Connect with Facebook
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}