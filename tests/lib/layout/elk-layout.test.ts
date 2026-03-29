import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { FunnelNode, FunnelEdge } from '@/types/funnel'

// Mock elkjs before importing the module
vi.mock('elkjs/lib/elk.bundled.js', () => {
  return {
    default: class MockELK {
      async layout(graph: unknown) {
        // Simulate successful layout with positioned nodes
        const g = graph as { children?: Array<{ id: string }> }
        return {
          children: g.children?.map((node, index) => ({
            id: node.id,
            x: index * 250, // Left-to-right positioning
            y: index % 2 === 0 ? 0 : 100, // Some vertical variation
          })),
        }
      }
    },
  }
})

// Import after mocking
import { computeAutoLayout } from '@/lib/layout/elk-layout'

describe('computeAutoLayout', () => {
  let mockNodes: FunnelNode[]
  let mockEdges: FunnelEdge[]

  beforeEach(() => {
    mockNodes = [
      {
        id: 'node-1',
        type: 'pageNode',
        position: { x: 0, y: 0 },
        data: {
          id: 'node-1',
          label: 'Landing Page',
          volume: 1000,
          url: '/landing',
          isConversion: false,
        },
      },
      {
        id: 'node-2',
        type: 'pageNode',
        position: { x: 0, y: 0 },
        data: {
          id: 'node-2',
          label: 'Checkout Page',
          volume: 500,
          url: '/checkout',
          isConversion: false,
        },
      },
      {
        id: 'node-3',
        type: 'pageNode',
        position: { x: 0, y: 0 },
        data: {
          id: 'node-3',
          label: 'Thank You',
          volume: 100,
          url: '/thank-you',
          isConversion: true,
        },
      },
    ]

    mockEdges = [
      {
        id: 'edge-1',
        source: 'node-1',
        target: 'node-2',
        type: 'smoothstep',
        data: { conversion: '50%', traffic: 500 },
      },
      {
        id: 'edge-2',
        source: 'node-2',
        target: 'node-3',
        type: 'smoothstep',
        data: { conversion: '20%', traffic: 100 },
      },
    ]
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should assign new positions to nodes', async () => {
    const result = await computeAutoLayout(mockNodes, mockEdges)

    // Each node should have a position with x and y
    result.nodes.forEach((node) => {
      expect(node.position).toBeDefined()
      expect(typeof node.position.x).toBe('number')
      expect(typeof node.position.y).toBe('number')
    })
  })

  it('should preserve node IDs and data', async () => {
    const result = await computeAutoLayout(mockNodes, mockEdges)

    // Check IDs are preserved
    expect(result.nodes.map((n) => n.id)).toEqual(['node-1', 'node-2', 'node-3'])

    // Check data is preserved
    expect(result.nodes[0].data.label).toBe('Landing Page')
    expect(result.nodes[0].data.volume).toBe(1000)
    expect(result.nodes[1].data.label).toBe('Checkout Page')
    expect(result.nodes[2].data.isConversion).toBe(true)
  })

  it('should layout nodes left-to-right (node-1.x < node-2.x < node-3.x)', async () => {
    const result = await computeAutoLayout(mockNodes, mockEdges)

    const node1 = result.nodes.find((n) => n.id === 'node-1')
    const node2 = result.nodes.find((n) => n.id === 'node-2')
    const node3 = result.nodes.find((n) => n.id === 'node-3')

    expect(node1!.position.x).toBeLessThan(node2!.position.x)
    expect(node2!.position.x).toBeLessThan(node3!.position.x)
  })

  it('should return edges unchanged', async () => {
    const result = await computeAutoLayout(mockNodes, mockEdges)

    expect(result.edges).toHaveLength(2)
    expect(result.edges[0].id).toBe('edge-1')
    expect(result.edges[0].source).toBe('node-1')
    expect(result.edges[0].target).toBe('node-2')
    expect(result.edges[1].id).toBe('edge-2')
  })

  it('should return nodes with original positions when ELK throws an error', async () => {
    // Create nodes with specific original positions to verify fallback
    const nodesWithPositions: FunnelNode[] = [
      {
        id: 'node-1',
        type: 'pageNode',
        position: { x: 100, y: 200 },
        data: {
          id: 'node-1',
          label: 'Landing Page',
          volume: 1000,
          url: '/landing',
          isConversion: false,
        },
      },
    ]

    // Spy on console.error to suppress error output during test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    // Temporarily override the mock to throw
    const { computeAutoLayout: originalCompute } = await import('@/lib/layout/elk-layout')
    
    // Create a module with error-throwing ELK
    vi.resetModules()
    vi.doMock('elkjs/lib/elk.bundled.js', () => {
      return {
        default: class MockELK {
          async layout() {
            throw new Error('ELK layout failed')
          }
        },
      }
    })

    // Re-import after re-mocking
    const { computeAutoLayout: computeWithError } = await import('@/lib/layout/elk-layout')

    const result = await computeWithError(nodesWithPositions, mockEdges)

    // Should return original nodes with original positions
    expect(result.nodes).toHaveLength(1)
    expect(result.nodes[0].position).toEqual({ x: 100, y: 200 })
    expect(result.edges).toEqual(mockEdges)

    // Verify error was logged
    expect(consoleSpy).toHaveBeenCalledWith('ELK layout error:', expect.any(Error))

    // Cleanup
    consoleSpy.mockRestore()
    vi.resetModules()
    
    // Restore original mock for subsequent tests
    vi.doMock('elkjs/lib/elk.bundled.js', () => {
      return {
        default: class MockELK {
          async layout(graph: unknown) {
            const g = graph as { children?: Array<{ id: string }> }
            return {
              children: g.children?.map((node, index) => ({
                id: node.id,
                x: index * 250,
                y: index % 2 === 0 ? 0 : 100,
              })),
            }
          }
        },
      }
    })
  })

  it('should handle empty nodes array', async () => {
    const result = await computeAutoLayout([], [])

    expect(result.nodes).toEqual([])
    expect(result.edges).toEqual([])
  })

  it('should handle single node', async () => {
    const singleNode = [mockNodes[0]]
    const result = await computeAutoLayout(singleNode, [])

    expect(result.nodes).toHaveLength(1)
    expect(result.nodes[0].id).toBe('node-1')
    expect(result.nodes[0].position).toBeDefined()
  })
})
