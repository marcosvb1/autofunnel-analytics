/**
 * Domain model for funnel data.
 * This file is shared between Phase 4 (AI) and Phase 5 (Canvas).
 * NO React Flow dependencies here - pure data structures.
 */

// Phase 1: Page Node Data for React Flow visualization
export interface PageNodeData {
  id: string
  label: string
  volume: number
  spend?: number
  conversion?: number
  roi?: number
  campaign?: string
  isConversion?: boolean
  url?: string
}

// Phase 1: Edge Data for React Flow visualization
export interface FunnelEdgeData {
  conversion: string
  roi?: string
  traffic: number
}

// Phase 1: Funnel Metadata for overall stats
export interface FunnelMetadata {
  totalSpend: number
  totalRevenue: number
  overallROI: string
  mainCampaign: string
}

// Phase 1: React Flow compatible Node type
export interface FunnelNode {
  id: string
  type: 'pageNode'
  position: { x: number; y: number }
  data: PageNodeData
}

// Phase 1: React Flow compatible Edge type
export interface FunnelEdge {
  id: string
  source: string
  target: string
  type: 'smoothstep'
  animated?: boolean
  data?: FunnelEdgeData
}

// Legacy types - kept for backward compatibility
export interface LegacyFunnelNodeData {
  [key: string]: unknown
  id: string
  label: string
  url: string
  type: 'page' | 'event' | 'conversion'
  volume: number
  spend: number
  campaign?: string
  campaignId?: string
  position?: { x: number; y: number }
}

export interface LegacyFunnelEdgeData {
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