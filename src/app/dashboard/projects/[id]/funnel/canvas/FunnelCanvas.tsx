'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  ReactFlowProvider,
  useReactFlow,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { nodeTypes } from '@/components/canvas/nodes'
import { edgeTypes } from '@/components/canvas/edges'
import ToolbarPanel from '@/components/canvas/panels/ToolbarPanel'
import MetricsPanel from '@/components/canvas/panels/MetricsPanel'
import { useFunnelStore } from '@/lib/store/funnel-store'
import { layoutNodes } from '@/lib/canvas/layout'
import type { FunnelNode, FunnelEdge } from '@/types/canvas'

interface FunnelCanvasProps {
  projectId: string
  mapId: string
  initialNodes: FunnelNode[]
  initialEdges: FunnelEdge[]
  metadata: {
    totalVolume: number
    totalSpend: number
    totalConversions: number
    overallConversion: number
    roi: number
  }
}

function SvgMarkers() {
  return (
    <defs>
      <marker
        id="arrow-main"
        viewBox="0 0 10 10"
        refX="8"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
      </marker>
      <marker
        id="arrow"
        viewBox="0 0 10 10"
        refX="8"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
      </marker>
    </defs>
  )
}

function FunnelCanvasInner({
  projectId,
  mapId,
  initialNodes,
  initialEdges,
  metadata,
}: FunnelCanvasProps) {
  const { nodes, edges, setNodes, setEdges } = useFunnelStore()
  const { getNodes, getEdges } = useReactFlow<FunnelNode, FunnelEdge>()
  const [isSaving, setIsSaving] = useState(false)
  const [showMetrics, setShowMetrics] = useState(true)

  useEffect(() => {
    if (initialNodes && initialNodes.length > 0) {
      setNodes(initialNodes)
      setEdges(initialEdges || [])
    }
  }, [])

  const handleAutoLayout = useCallback(async () => {
    try {
      const currentNodes = getNodes() as FunnelNode[]
      const currentEdges = getEdges() as FunnelEdge[]
      const layoutedNodes = await layoutNodes(currentNodes, currentEdges)
      setNodes(layoutedNodes)
    } catch (error) {
      console.error('Layout error:', error)
    }
  }, [getNodes, getEdges, setNodes])

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    try {
      const currentNodes = getNodes()
      const currentEdges = getEdges()

      const response = await fetch(`/api/funnel-maps/${mapId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodes: currentNodes,
          edges: currentEdges,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save')
      }
    } catch (error) {
      console.error('Save error:', error)
    } finally {
      setIsSaving(false)
    }
  }, [mapId, getNodes, getEdges])

  const handleExport = useCallback(async () => {
    const viewport = document.querySelector('.react-flow__viewport') as HTMLElement
    if (!viewport) return

    try {
      const { toPng } = await import('html-to-image')
      
      const dataUrl = await toPng(viewport, {
        backgroundColor: '#ffffff',
        quality: 1,
      })

      const link = document.createElement('a')
      link.download = `funnel-${mapId}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Export error:', error)
    }
  }, [mapId])

  const handleToggleMetrics = useCallback(() => {
    setShowMetrics((prev) => !prev)
  }, [])

  const onNodesChange = useCallback(
    (changes: NodeChange<FunnelNode>[]) => {
      setNodes(applyNodeChanges(changes, nodes))
    },
    [nodes, setNodes]
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange<FunnelEdge>[]) => {
      setEdges(applyEdgeChanges(changes, edges))
    },
    [edges, setEdges]
  )

  return (
    <div className="h-[calc(100vh-3.5rem)] relative">
      {/* Floating Toolbar Centralizado */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
        <ToolbarPanel
          onAutoLayout={handleAutoLayout}
          onSave={handleSave}
          onExport={handleExport}
          onToggleMetrics={handleToggleMetrics}
          isSaving={isSaving}
          showMetrics={showMetrics}
        />
      </div>

      {/* Floating Metrics Panel */}
      {showMetrics && (
        <MetricsPanel
          {...metadata}
          onClose={handleToggleMetrics}
        />
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        minZoom={0.2}
        maxZoom={2}
      >
        <SvgMarkers />
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        <Controls
          className="bg-white/80 backdrop-blur-md shadow-lg border border-gray-200 rounded-lg"
          showInteractive={false}
        />
        <MiniMap
          nodeColor={(node) => {
            if (node.type === 'conversion') return '#22c55e'
            if (node.type === 'event') return '#a855f7'
            return '#3b82f6'
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
          className="bg-white/80 backdrop-blur-md shadow-lg border border-gray-200 rounded-lg"
        />
      </ReactFlow>
    </div>
  )
}

export default function FunnelCanvas(props: FunnelCanvasProps) {
  return (
    <ReactFlowProvider>
      <FunnelCanvasInner {...props} />
    </ReactFlowProvider>
  )
}
