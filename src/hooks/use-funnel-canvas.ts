'use client'

import { useCallback, useState } from 'react'
import { useReactFlow } from '@xyflow/react'
import { layoutNodes } from '@/lib/canvas/layout'
import { useFunnelStore } from '@/lib/store/funnel-store'
import type { FunnelNode, FunnelEdge } from '@/types/canvas'

export function useFunnelCanvas(projectId: string, mapId: string) {
  const { getNodes, getEdges, setNodes } = useReactFlow<FunnelNode, FunnelEdge>()
  const { setLoading, setError } = useFunnelStore()
  const [isSaving, setIsSaving] = useState(false)

  const handleAutoLayout = useCallback(async () => {
    setLoading(true)
    try {
      const nodes = getNodes() as FunnelNode[]
      const edges = getEdges() as FunnelEdge[]
      const layoutedNodes = await layoutNodes(nodes, edges)
      setNodes(layoutedNodes)
    } catch (error) {
      setError('Failed to auto layout')
    } finally {
      setLoading(false)
    }
  }, [getNodes, getEdges, setNodes, setLoading, setError])

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    try {
      const nodes = getNodes()
      const edges = getEdges()

      const response = await fetch(`/api/funnel-maps/${mapId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodes,
          edges,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save')
      }
    } catch (error) {
      setError('Failed to save funnel')
    } finally {
      setIsSaving(false)
    }
  }, [mapId, getNodes, getEdges, setError])

  const handleExport = useCallback(async () => {
    const nodesBounds = document.querySelector('.react-flow__viewport') as HTMLElement
    if (!nodesBounds) return

    try {
      const { toPng } = await import('html-to-image')
      
      const dataUrl = await toPng(nodesBounds, {
        backgroundColor: '#ffffff',
        quality: 1,
      })

      const link = document.createElement('a')
      link.download = `funnel-${mapId}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      setError('Failed to export')
    }
  }, [mapId, setError])

  return {
    handleAutoLayout,
    handleSave,
    handleExport,
    isSaving,
  }
}