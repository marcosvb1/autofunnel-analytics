'use client'

import { useEffect, useState } from 'react'
import FunnelCanvas from './canvas/FunnelCanvas'
import { Button } from '@/components/ui/button'
import { mockFunnelMap } from '@/lib/mock/data'
import { funnelMapToReactFlow } from '@/lib/canvas/utils'
import type { FunnelNode, FunnelEdge } from '@/types/canvas'

interface FunnelMapData {
  id: string
  project_id: string
  name: string
  nodes: FunnelNode[]
  edges: FunnelEdge[]
  metadata: {
    totalVolume: number
    totalSpend: number
    totalConversions: number
    overallConversion: number
    roi: number
    detectedAt: string
    provider: string
    model: string
  }
}

interface FunnelPageClientProps {
  projectId: string
}

export default function FunnelPageClient({ projectId }: FunnelPageClientProps) {
  const [funnelMap, setFunnelMap] = useState<FunnelMapData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDetecting, setIsDetecting] = useState(false)

  useEffect(() => {
    const fetchFunnelMap = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`)
        const data = await response.json()
        
        if (data.project?.funnel_maps?.length > 0) {
          setFunnelMap(data.project.funnel_maps[0] as FunnelMapData)
        }
      } catch (error) {
        console.error('Failed to fetch funnel map:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchFunnelMap()
  }, [projectId])

  const handleLoadDemo = () => {
    const { nodes, edges } = funnelMapToReactFlow({
      id: mockFunnelMap.id,
      projectId: mockFunnelMap.project_id,
      name: mockFunnelMap.name,
      nodes: mockFunnelMap.nodes,
      edges: mockFunnelMap.edges,
      metadata: mockFunnelMap.metadata,
    })
    setFunnelMap({
      id: mockFunnelMap.id,
      project_id: mockFunnelMap.project_id,
      name: mockFunnelMap.name,
      nodes,
      edges,
      metadata: mockFunnelMap.metadata,
    })
  }

  const handleDetectFunnel = async () => {
    setIsDetecting(true)
    try {
      const response = await fetch('/api/ai/detect-funnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
      })
      
      const data = await response.json()
      
      if (data.funnel) {
        setFunnelMap(data.funnel)
      }
    } catch (error) {
      console.error('Failed to detect funnel:', error)
    } finally {
      setIsDetecting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
        <p>Loading...</p>
      </div>
    )
  }

  if (!funnelMap) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-3.5rem)] gap-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No Funnel Generated Yet</h2>
          <p className="text-gray-500 mb-4">
            Load demo data to preview the canvas, or generate with AI after connecting PostHog.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleLoadDemo} variant="outline">
            Load Demo Data
          </Button>
          <Button onClick={handleDetectFunnel} disabled={isDetecting}>
            {isDetecting ? 'Generating...' : 'Generate Funnel with AI'}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <FunnelCanvas
      projectId={projectId}
      mapId={funnelMap.id}
      initialNodes={funnelMap.nodes || []}
      initialEdges={funnelMap.edges || []}
      metadata={{
        totalVolume: funnelMap.metadata?.totalVolume || 0,
        totalSpend: funnelMap.metadata?.totalSpend || 0,
        totalConversions: funnelMap.metadata?.totalConversions || 0,
        overallConversion: funnelMap.metadata?.overallConversion || 0,
        roi: funnelMap.metadata?.roi || 0,
      }}
    />
  )
}
