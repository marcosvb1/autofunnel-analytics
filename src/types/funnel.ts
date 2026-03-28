/**
 * Domain model for funnel data.
 * This file is shared between Phase 4 (AI) and Phase 5 (Canvas).
 * NO React Flow dependencies here - pure data structures.
 */

export interface FunnelNodeData {
  [key: string]: unknown
  id: string
  label: string
  url: string
  type: 'page' | 'event' | 'conversion'
  volume: number
  spend: number
  campaign?: string
  campaignId?: string
}

export interface FunnelEdgeData {
  [key: string]: unknown
  source: string
  target: string
  volume: number
  conversion: number
  spend: number
  isMainPath: boolean
}

export interface FunnelMap {
  id: string
  projectId: string
  name: string
  nodes: FunnelNodeData[]
  edges: FunnelEdgeData[]
  metadata: {
    totalVolume: number
    totalSpend: number
    totalConversions: number
    overallConversion: number
    roi: number
    detectedAt: string
    provider: 'openai' | 'anthropic'
    model: string
  }
}

export interface FunnelDetectionInput {
  paths: Array<{
    nodes: string[]
    occurrences: number
  }>
  campaigns?: Array<{
    id: string
    name: string
    spend: number
    landingUrl?: string
  }>
  conversionUrls: string[]
  excludePatterns: string[]
}

export interface FunnelEditInstruction {
  type: 'remove_node' | 'merge_nodes' | 'filter_url' | 'highlight_path' | 'add_label' | 'set_conversion'
  payload: Record<string, unknown>
}

export interface FunnelEditResult {
  success: boolean
  message: string
  nodes: FunnelNodeData[]
  edges: FunnelEdgeData[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  funnelSnapshot?: FunnelMap
}

export interface ChatSession {
  id: string
  projectId: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
}