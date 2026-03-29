import { PostHogClient } from './client'
import type { PostHogPath, PostHogPathNode } from '@/types/posthog'

export interface NormalizedPath {
  id: string
  nodes: NormalizedPathNode[]
  occurrences: number
  conversion_rate: number
}

export interface NormalizedPathNode {
  id: string
  url: string
  type: 'pageview' | 'event' | 'action'
  occurrences: number
  percentage: number
}

export async function fetchPaths(
  client: PostHogClient,
  options?: {
    startDate?: string
    endDate?: string
    limit?: number
    offset?: number
  }
): Promise<NormalizedPath[]> {
  const response = await client.getPaths({
    start_date: options?.startDate,
    end_date: options?.endDate,
    limit: options?.limit || 100,
  })

  let results = response.results.map(normalizePath)
  
  if (options?.offset) {
    results = results.slice(options.offset)
  }

  return results
}

function normalizePath(path: PostHogPath): NormalizedPath {
  const nodes = path.paths.map((node, index) => ({
    id: `node_${index}`,
    url: node.node,
    type: node.node_type,
    occurrences: node.occurrences,
    percentage: node.percentage,
  }))

  return {
    id: `path_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    nodes,
    occurrences: path.occurrences,
    conversion_rate: nodes[nodes.length - 1]?.percentage || 0,
  }
}

export function aggregatePaths(paths: NormalizedPath[]): Map<string, NormalizedPathNode[]> {
  const urlToNodes = new Map<string, NormalizedPathNode[]>()

  paths.forEach(path => {
    path.nodes.forEach(node => {
      const existing = urlToNodes.get(node.url) || []
      const existingNode = existing.find(n => n.id === node.id)
      
      if (!existingNode) {
        urlToNodes.set(node.url, [...existing, node])
      }
    })
  })

  return urlToNodes
}