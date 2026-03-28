'use client'

import { useCallback, useEffect } from 'react'
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
import { useFunnelCanvas } from '@/hooks/use-funnel-canvas'
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
  const { handleAutoLayout, handleSave, handleExport, isSaving } = useFunnelCanvas(projectId, mapId)

  useEffect(() => {
    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [initialNodes, initialEdges, setNodes, setEdges])

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
    <div className="flex h-[calc(100vh-3.5rem)]">
      <div className="w-64 border-r bg-gray-50 p-4">
        <MetricsPanel {...metadata} />
      </div>

      <div className="flex-1 flex flex-col">
        <ToolbarPanel
          onAutoLayout={handleAutoLayout}
          onSave={handleSave}
          onExport={handleExport}
          isSaving={isSaving}
        />

        <div className="flex-1 relative">
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
            <Controls />
            <MiniMap
              nodeColor={(node) => {
                if (node.type === 'conversion') return '#22c55e'
                if (node.type === 'event') return '#a855f7'
                return '#3b82f6'
              }}
              maskColor="rgba(0, 0, 0, 0.1)"
            />
          </ReactFlow>
        </div>
      </div>
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