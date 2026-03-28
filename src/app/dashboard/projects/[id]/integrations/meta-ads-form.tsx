'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import AdAccountSelector from '@/components/integrations/ad-account-selector'
import MetaAdsSetupGuide from '@/components/integrations/meta-ads-setup-guide'
import { useMetaAds } from '@/hooks/use-meta-ads'

interface MetaAdsFormProps {
  projectId: string
  onConnected: () => void
}

export default function MetaAdsForm({ projectId, onConnected }: MetaAdsFormProps) {
  const [showGuide, setShowGuide] = useState(false)
  const [step, setStep] = useState<'oauth' | 'select-account'>('oauth')
  const { isLoading, error, initiateOAuth, setAdAccount } = useMetaAds(projectId)

  useEffect(() => {
    const connected = new URLSearchParams(window.location.search).get('meta_ads_connected')
    if (connected) {
      setStep('select-account')
    }
  }, [])

  const handleSelectAccount = async (accountId: string) => {
    await setAdAccount(accountId)
    onConnected()
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Connect Meta Ads</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          
          {step === 'oauth' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Connect your Facebook or Instagram ad account to track spend and performance.
              </p>

              <div className="flex gap-2">
                <Button onClick={initiateOAuth} disabled={isLoading}>
                  {isLoading ? 'Connecting...' : 'Connect with Facebook'}
                </Button>
                <Button variant="outline" onClick={() => setShowGuide(true)}>
                  Setup Guide
                </Button>
              </div>
            </div>
          )}

          {step === 'select-account' && (
            <AdAccountSelector projectId={projectId} onSelect={handleSelectAccount} />
          )}
        </CardContent>
      </Card>

      <MetaAdsSetupGuide isOpen={showGuide} onClose={() => setShowGuide(false)} />
    </>
  )
}