'use client'

import { useCallback } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  ReactFlowProvider,
  NodeTypes,
} from '@xyflow/react'
import PageNode from './page-node'
import { useCanvasStore } from '@/lib/store/canvas-store'
import { computeAutoLayout } from '@/lib/layout/elk-layout'

const nodeTypes: NodeTypes = {
  pageNode: PageNode,
}

function FunnelCanvasInner() {
  const { nodes, edges, onNodesChange, onEdgesChange, setNodes, setEdges } = useCanvasStore()
  const { fitView } = useReactFlow()

  const onLayout = useCallback(async () => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = await computeAutoLayout(nodes, edges)
    setNodes(layoutedNodes)
    setEdges(layoutedEdges)
    setTimeout(() => fitView({ padding: 0.2 }), 100)
  }, [nodes, edges, setNodes, setEdges, fitView])

  return (
    <div className="w-full h-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
        minZoom={0.1}
        maxZoom={2}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
        }}
      >
        <Controls className="bg-white border border-gray-200 shadow-md rounded-lg" />
        <MiniMap
          className="bg-white border border-gray-200 shadow-md rounded-lg"
          nodeStrokeWidth={3}
          zoomable
          pannable
        />
        <Background color="#e5e7eb" gap={20} size={1} />
      </ReactFlow>

      {/* Auto-layout button */}
      <button
        onClick={onLayout}
        className="absolute top-4 right-4 z-10 px-4 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-primary-hover transition-colors font-medium text-sm"
      >
        Auto Layout
      </button>
    </div>
  )
}

export default function FunnelCanvas() {
  return (
    <ReactFlowProvider>
      <FunnelCanvasInner />
    </ReactFlowProvider>
  )
}
