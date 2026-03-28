'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function CallbackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  useEffect(() => {
    const error = searchParams.get('error')
    const projectId = searchParams.get('project_id')
    
    if (error) {
      console.error('OAuth error:', error)
      if (projectId) {
        router.push(`/dashboard/projects/${projectId}/integrations?error=${error}`)
      }
    } else {
      if (projectId) {
        router.push(`/dashboard/projects/${projectId}/integrations?meta_ads_connected=true`)
      }
    }
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Connecting to Meta Ads...</p>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Connecting to Meta Ads...</p>
      </div>
    </div>
  )
}

export default function MetaAdsCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CallbackContent />
    </Suspense>
  )
}