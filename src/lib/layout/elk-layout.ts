import ELK from 'elkjs/lib/elk.bundled.js'
import type { FunnelNode, FunnelEdge } from '@/types/funnel'

const elk = new ELK()

const NODE_WIDTH = 200
const NODE_HEIGHT = 120

export async function computeAutoLayout(
  nodes: FunnelNode[],
  edges: FunnelEdge[]
): Promise<{ nodes: FunnelNode[]; edges: FunnelEdge[] }> {
  const elkGraph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'RIGHT',
      'elk.spacing.nodeNode': '50',
      'elk.layered.spacing.nodeNodeBetweenLayers': '100',
      'elk.edgeRouting': 'SPLINES',
    },
    children: nodes.map((node) => ({
      id: node.id,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  }

  try {
    const layout = await elk.layout(elkGraph)

    const positionedNodes = nodes.map((node) => {
      const elkNode = layout.children?.find((n) => n.id === node.id)
      return {
        ...node,
        position: {
          x: elkNode?.x || 0,
          y: elkNode?.y || 0,
        },
      }
    })

    return { nodes: positionedNodes, edges }
  } catch (error) {
    console.error('ELK layout error:', error)
    return { nodes, edges }
  }
}
