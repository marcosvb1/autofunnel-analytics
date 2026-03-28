'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import PostHogSetupGuide from '@/components/integrations/posthog-setup-guide'

interface PostHogFormProps {
  projectId: string
  onConnected: () => void
}

export default function PostHogForm({ projectId, onConnected }: PostHogFormProps) {
  const [apiKey, setApiKey] = useState('')
  const [posthogProjectId, setPosthogProjectId] = useState('')
  const [host, setHost] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showGuide, setShowGuide] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/integrations/posthog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-project-id': projectId,
        },
        body: JSON.stringify({
          api_key: apiKey,
          project_id: posthogProjectId,
          host: host || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      onConnected()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Connect PostHog</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">API Key</label>
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Project ID</label>
              <Input
                value={posthogProjectId}
                onChange={(e) => setPosthogProjectId(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Host URL (optional)</label>
              <Input
                type="url"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="https://app.posthog.com"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Connecting...' : 'Connect'}
              </Button>
              <Button variant="outline" onClick={() => setShowGuide(true)}>
                Setup Guide
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <PostHogSetupGuide
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
      />
    </>
  )
}