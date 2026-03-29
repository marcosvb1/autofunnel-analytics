import type { FunnelNode, FunnelEdge } from '@/types/canvas'

let elkInstance: Awaited<ReturnType<typeof importElk>> | null = null

async function importElk() {
  const ELK = (await import('elkjs/lib/elk.bundled.js')).default
  return new ELK()
}

async function getElk() {
  if (!elkInstance) {
    elkInstance = await importElk()
  }
  return elkInstance
}

const LAYOUT_OPTIONS = {
  'elk.algorithm': 'layered',
  'elk.direction': 'RIGHT',
  'elk.spacing.nodeNode': '80',
  'elk.layered.spacing.nodeNodeBetweenLayers': '150',
  'elk.layered.spacing.edgeNodeBetweenLayers': '50',
  'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
  'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
}

export async function layoutNodes(
  nodes: FunnelNode[],
  edges: FunnelEdge[]
): Promise<FunnelNode[]> {
  if (nodes.length === 0) return []

  const elk = await getElk()

  const graph = {
    id: 'root',
    layoutOptions: LAYOUT_OPTIONS,
    children: nodes.map((node) => ({
      id: node.id,
      width: 200,
      height: 100,
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  }

  try {
    const layoutedGraph = await elk.layout(graph)
    
    const layoutedNodes = nodes.map((node) => {
      const layoutedNode = layoutedGraph.children?.find((n: any) => n.id === node.id)
      
      return {
        ...node,
        position: {
          x: layoutedNode?.x || 0,
          y: layoutedNode?.y || 0,
        },
      }
    })

    return layoutedNodes
  } catch (error) {
    console.error('Layout error:', error)
    return nodes.map((node, index) => ({
      ...node,
      position: { x: index * 250, y: 0 },
    }))
  }
}

export function calculateNodePosition(
  index: number,
  total: number
): { x: number; y: number } {
  const rowSize = Math.ceil(Math.sqrt(total))
  const row = Math.floor(index / rowSize)
  const col = index % rowSize

  return {
    x: col * 250 + 100,
    y: row * 150 + 100,
  }
}