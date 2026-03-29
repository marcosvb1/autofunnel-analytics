import { useEffect, useCallback } from 'react'
import { useCanvasStore } from '@/lib/store/canvas-store'
import { computeAutoLayout } from '@/lib/layout/elk-layout'
import { demoNodes, demoEdges } from '@/lib/demo/demo-data'

export function useDemoFunnel() {
  const { setNodes, setEdges } = useCanvasStore()

  const loadDemoFunnel = useCallback(async () => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = await computeAutoLayout(
      demoNodes,
      demoEdges
    )
    setNodes(layoutedNodes)
    setEdges(layoutedEdges)
  }, [setNodes, setEdges])

  useEffect(() => {
    loadDemoFunnel()
  }, [loadDemoFunnel])

  return { loadDemoFunnel }
}
