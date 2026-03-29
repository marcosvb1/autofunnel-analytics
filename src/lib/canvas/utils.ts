import type { FunnelNode, FunnelEdge } from '@/types/canvas'
import type { FunnelMap, FunnelNodeData, FunnelEdgeData } from '@/types/funnel'

export function funnelMapToReactFlow(funnel: FunnelMap): {
  nodes: FunnelNode[]
  edges: FunnelEdge[]
} {
  const nodes: FunnelNode[] = funnel.nodes.map((node) => ({
    id: node.id,
    type: getNodeType(node.type as string),
    position: (node.position as { x: number; y: number }) || { x: 0, y: 0 },
    data: {
      id: node.id,
      label: node.label,
      url: node.url,
      type: node.type,
      volume: node.volume,
      spend: node.spend,
      campaign: node.campaign,
      campaignId: node.campaignId,
    },
  }))

  const edges: FunnelEdge[] = funnel.edges.map((edge) => ({
    id: String(edge.id),
    source: edge.source,
    target: edge.target,
    type: 'funnel',
    data: {
      source: edge.source,
      target: edge.target,
      volume: edge.volume ?? 0,
      conversion: edge.conversion,
      traffic: edge.traffic ?? edge.volume ?? 0,
      spend: edge.spend as number | undefined,
      isMainPath: edge.isMainPath ?? false,
    },
  }))

  return { nodes, edges }
}

function getNodeType(type: string): string {
  if (type === 'conversion') return 'conversion'
  if (type === 'event') return 'event'
  return 'page'
}

export function reactFlowToFunnelMap(
  nodes: FunnelNode[],
  edges: FunnelEdge[],
  projectId: string
): FunnelMap {
  return {
    id: crypto.randomUUID(),
    projectId,
    name: 'Edited Funnel',
    nodes: nodes.map((node) => ({
      id: node.id,
      label: node.data?.label ?? '',
      url: node.data?.url ?? '',
      type: node.data?.type ?? 'page',
      volume: node.data?.volume ?? 0,
      spend: node.data?.spend ?? 0,
      campaign: node.data?.campaign ?? '',
      campaignId: node.data?.campaignId ?? '',
      position: node.position,
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      volume: edge.data?.volume ?? 0,
      conversion: edge.data?.conversion ?? 0,
      traffic: edge.data?.traffic ?? edge.data?.volume ?? 0,
      spend: edge.data?.spend ?? 0,
      isMainPath: edge.data?.isMainPath ?? false,
    })),
    metadata: {
      totalVolume: nodes.reduce((sum, n) => sum + (n.data?.volume ?? 0), 0),
      totalSpend: nodes.reduce((sum, n) => sum + (n.data?.spend ?? 0), 0),
      totalConversions: 0,
      overallConversion: 0,
      roi: 0,
      detectedAt: new Date().toISOString(),
      provider: 'openai',
      model: 'gpt-4',
    },
  }
}

export function formatVolume(volume: number): string {
  if (volume >= 1000000) {
    return `${(volume / 1000000).toFixed(1)}M`
  }
  if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}K`
  }
  return String(volume)
}

export function formatSpend(spend: number): string {
  if (spend < 0) return `-$${Math.abs(spend).toFixed(0)}`
  return `$${spend.toFixed(0)}`
}

export function formatConversion(conversion: number): string {
  return `${conversion.toFixed(1)}%`
}

export function getConversionColor(conversion: number): string {
  if (conversion >= 30) return 'text-green-600'
  if (conversion >= 15) return 'text-yellow-600'
  return 'text-red-600'
}