import { describe, it, expect, beforeEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useCanvasStore } from '@/lib/store/canvas-store'
import type { FunnelNode, FunnelEdge } from '@/types/funnel'

// Helper to create a test node
const createTestNode = (id: string, x = 0, y = 0): FunnelNode => ({
  id,
  type: 'pageNode',
  position: { x, y },
  data: {
    id,
    label: `Node ${id}`,
    volume: 100,
  },
})

// Helper to create a test edge
const createTestEdge = (id: string, source: string, target: string): FunnelEdge => ({
  id,
  source,
  target,
  type: 'smoothstep',
  animated: true,
  data: {
    conversion: '10%',
    traffic: 100,
  },
})

describe('Canvas Store', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    const { result } = renderHook(() => useCanvasStore())
    act(() => {
      result.current.deselectAll()
    })
    useCanvasStore.setState({
      nodes: [],
      edges: [],
      selectedNodeIds: [],
      selectedEdgeIds: [],
    })
  })

  it('should initialize with empty arrays', () => {
    const { result } = renderHook(() => useCanvasStore())

    expect(result.current.nodes).toEqual([])
    expect(result.current.edges).toEqual([])
    expect(result.current.selectedNodeIds).toEqual([])
    expect(result.current.selectedEdgeIds).toEqual([])
  })

  it('setNodes works', () => {
    const { result } = renderHook(() => useCanvasStore())
    const nodes = [createTestNode('1'), createTestNode('2')]

    act(() => {
      result.current.setNodes(nodes)
    })

    expect(result.current.nodes).toHaveLength(2)
    expect(result.current.nodes[0].id).toBe('1')
    expect(result.current.nodes[1].id).toBe('2')
  })

  it('setEdges works', () => {
    const { result } = renderHook(() => useCanvasStore())
    const edges = [createTestEdge('e1', '1', '2'), createTestEdge('e2', '2', '3')]

    act(() => {
      result.current.setEdges(edges)
    })

    expect(result.current.edges).toHaveLength(2)
    expect(result.current.edges[0].id).toBe('e1')
    expect(result.current.edges[1].id).toBe('e2')
  })

  it('onNodesChange applies position changes', () => {
    const { result } = renderHook(() => useCanvasStore())
    const node = createTestNode('1', 0, 0)

    act(() => {
      result.current.setNodes([node])
    })

    // Apply position change
    act(() => {
      result.current.onNodesChange([
        {
          id: '1',
          type: 'position',
          position: { x: 100, y: 200 },
        },
      ])
    })

    expect(result.current.nodes[0].position).toEqual({ x: 100, y: 200 })
  })

  it('onEdgesChange works', () => {
    const { result } = renderHook(() => useCanvasStore())
    const edge = createTestEdge('e1', '1', '2')

    act(() => {
      result.current.setEdges([edge])
    })

    // Apply a remove change
    act(() => {
      result.current.onEdgesChange([
        {
          id: 'e1',
          type: 'remove',
        },
      ])
    })

    expect(result.current.edges).toHaveLength(0)
  })

  it('addNode adds a node', () => {
    const { result } = renderHook(() => useCanvasStore())
    const node = createTestNode('1')

    act(() => {
      result.current.addNode(node)
    })

    expect(result.current.nodes).toHaveLength(1)
    expect(result.current.nodes[0].id).toBe('1')
  })

  it('removeNode removes node and connected edges', () => {
    const { result } = renderHook(() => useCanvasStore())
    const node1 = createTestNode('1')
    const node2 = createTestNode('2')
    const node3 = createTestNode('3')
    const edge1 = createTestEdge('e1', '1', '2')
    const edge2 = createTestEdge('e2', '2', '3')

    act(() => {
      result.current.setNodes([node1, node2, node3])
      result.current.setEdges([edge1, edge2])
    })

    // Remove node 2 - should also remove edges connected to it
    act(() => {
      result.current.removeNode('2')
    })

    expect(result.current.nodes).toHaveLength(2)
    expect(result.current.nodes.find((n) => n.id === '2')).toBeUndefined()
    expect(result.current.edges).toHaveLength(0)
    expect(result.current.edges.find((e) => e.id === 'e1')).toBeUndefined()
    expect(result.current.edges.find((e) => e.id === 'e2')).toBeUndefined()
  })

  it('addEdge works', () => {
    const { result } = renderHook(() => useCanvasStore())
    const edge = createTestEdge('e1', '1', '2')

    act(() => {
      result.current.addEdge(edge)
    })

    expect(result.current.edges).toHaveLength(1)
    expect(result.current.edges[0].id).toBe('e1')
  })

  it('removeEdge works', () => {
    const { result } = renderHook(() => useCanvasStore())
    const edge1 = createTestEdge('e1', '1', '2')
    const edge2 = createTestEdge('e2', '2', '3')

    act(() => {
      result.current.setEdges([edge1, edge2])
    })

    act(() => {
      result.current.removeEdge('e1')
    })

    expect(result.current.edges).toHaveLength(1)
    expect(result.current.edges[0].id).toBe('e2')
  })

  it('selectNode selects a single node', () => {
    const { result } = renderHook(() => useCanvasStore())

    act(() => {
      result.current.selectNode('1')
    })

    expect(result.current.selectedNodeIds).toEqual(['1'])
  })

  it('deselectAll clears all selections', () => {
    const { result } = renderHook(() => useCanvasStore())

    act(() => {
      result.current.selectNode('1')
      result.current.selectedEdgeIds = ['e1']
    })

    act(() => {
      result.current.deselectAll()
    })

    expect(result.current.selectedNodeIds).toEqual([])
    expect(result.current.selectedEdgeIds).toEqual([])
  })

  it('should have viewMode state', () => {
    const state = useCanvasStore.getState()
    expect(state.viewMode).toBe('metrics')
  })

  it('should set viewMode', () => {
    useCanvasStore.getState().setViewMode('heat')
    expect(useCanvasStore.getState().viewMode).toBe('heat')
  })

  it('should set expanded node', () => {
    useCanvasStore.getState().setExpandedNode('node-123')
    expect(useCanvasStore.getState().expandedNodeId).toBe('node-123')
  })

  it('should clear expanded node', () => {
    useCanvasStore.getState().setExpandedNode('node-123')
    useCanvasStore.getState().setExpandedNode(null)
    expect(useCanvasStore.getState().expandedNodeId).toBeNull()
  })
})
