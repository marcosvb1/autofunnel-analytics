'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface MetaAdsSetupGuideProps {
  isOpen: boolean
  onClose: () => void
}

export default function MetaAdsSetupGuide({ isOpen, onClose }: MetaAdsSetupGuideProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Meta Ads Setup Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Step 1: Click Connect</h3>
            <p className="text-sm text-gray-600">
              Click Connect with Facebook to authorize access.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Step 2: Grant Permissions</h3>
            <p className="text-sm text-gray-600">
              Facebook will ask for permission to read your ads data.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Step 3: Select Ad Account</h3>
            <p className="text-sm text-gray-600">
              After authorization, select the ad account to track.
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded">
            <p className="text-sm">
              We only read ads data. We cannot create, modify, or delete ads.
            </p>
          </div>

          <Button onClick={onClose}>Close</Button>
        </CardContent>
      </Card>
    </div>
  )
}