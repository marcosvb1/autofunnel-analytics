import { describe, it, expect } from 'vitest'
import { layoutNodes } from '@/lib/canvas/layout'
import type { FunnelNode, FunnelEdge } from '@/types/canvas'

describe('Auto Layout', () => {
  it('should position nodes in a funnel layout', async () => {
    const nodes: FunnelNode[] = [
      { id: 'n1', data: { id: 'n1', label: 'Home', url: '/', type: 'page', volume: 100, spend: 0 }, position: { x: 0, y: 0 } },
      { id: 'n2', data: { id: 'n2', label: 'Product', url: '/product', type: 'page', volume: 50, spend: 0 }, position: { x: 0, y: 0 } },
    ]
    const edges: FunnelEdge[] = [
      { id: 'e1', source: 'n1', target: 'n2', data: { source: 'n1', target: 'n2', volume: 50, conversion: 50, spend: 0, isMainPath: true } },
    ]

    const layoutedNodes = await layoutNodes(nodes, edges)

    expect(layoutedNodes.length).toBe(2)
    expect(layoutedNodes[0].position).toBeDefined()
    expect(layoutedNodes[1].position.x).toBeGreaterThan(layoutedNodes[0].position.x)
  })
})