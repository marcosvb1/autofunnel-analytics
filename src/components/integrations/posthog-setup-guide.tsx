'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface PostHogSetupGuideProps {
  isOpen: boolean
  onClose: () => void
}

export default function PostHogSetupGuide({ isOpen, onClose }: PostHogSetupGuideProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>PostHog Setup Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Step 1: Get your API Key</h3>
            <p className="text-sm text-gray-600">
              Go to PostHog Settings → Project API Keys and copy your Personal API Key.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Step 2: Get your Project ID</h3>
            <p className="text-sm text-gray-600">
              The Project ID is shown in your PostHog dashboard URL or Settings page.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Step 3: Enter credentials</h3>
            <p className="text-sm text-gray-600">
              Paste both values in the form and click Connect.
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded">
            <p className="text-sm">
              <strong>Note:</strong> Your API key is stored securely and encrypted.
              We only use it to fetch path analysis data.
            </p>
          </div>

          <Button onClick={onClose}>Close</Button>
        </CardContent>
      </Card>
    </div>
  )
}