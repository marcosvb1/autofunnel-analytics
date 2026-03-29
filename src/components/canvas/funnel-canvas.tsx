'use client'

import { useCallback, useState } from 'react'
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
import { CanvasControls } from './canvas-controls'
import { useCanvasStore } from '@/lib/store/canvas-store'
import { computeAutoLayout } from '@/lib/layout/elk-layout'
import { FunnelNode } from '@/types/funnel'
import { useDemoFunnel } from '@/hooks/use-demo-funnel'

const nodeTypes: NodeTypes = {
  pageNode: PageNode,
}

function FunnelCanvasInner() {
  const { nodes, edges, onNodesChange, onEdgesChange, setNodes, setEdges, addNode } = useCanvasStore()
  const { fitView } = useReactFlow()
  const [nodeCounter, setNodeCounter] = useState(1)
  useDemoFunnel()

  const onLayout = useCallback(async () => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = await computeAutoLayout(nodes, edges)
    setNodes(layoutedNodes)
    setEdges(layoutedEdges)
    setTimeout(() => fitView({ padding: 0.2 }), 100)
  }, [nodes, edges, setNodes, setEdges, fitView])

  const handleAddNode = useCallback(() => {
    const newNode: FunnelNode = {
      id: `node-${Date.now()}`,
      type: 'pageNode',
      position: { x: 100 + nodeCounter * 50, y: 100 + nodeCounter * 50 },
      data: {
        id: `node-${Date.now()}`,
        label: `New Page ${nodeCounter}`,
        volume: 0,
      },
    }
    addNode(newNode)
    setNodeCounter((prev) => prev + 1)
  }, [addNode, nodeCounter])

  const handleResetZoom = useCallback(() => {
    fitView({ padding: 0.2 })
  }, [fitView])

  const handleExport = useCallback(() => {
    console.log('Export not implemented yet')
  }, [])

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

      <CanvasControls
        onAddNode={handleAddNode}
        onAutoLayout={onLayout}
        onResetZoom={handleResetZoom}
        onExport={handleExport}
      />
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
