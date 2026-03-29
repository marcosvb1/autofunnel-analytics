/**
 * React Flow wrappers for funnel data.
 * Imports domain model from types/funnel.ts and adds React Flow specifics.
 */
import type { Node, Edge } from '@xyflow/react'
import type { FunnelNodeData, FunnelEdgeData } from './funnel'

// React Flow node/edge types
export type FunnelNode = Node<FunnelNodeData>
export type FunnelEdge = Edge<FunnelEdgeData>

// Canvas state for Zustand store
export interface CanvasState {
  nodes: FunnelNode[]
  edges: FunnelEdge[]
  selectedNodeId: string | null
  isLoading: boolean
  error: string | null
  viewport: { x: number; y: number; zoom: number }
}

// Canvas actions
export interface CanvasActions {
  setNodes: (nodes: FunnelNode[]) => void
  setEdges: (edges: FunnelEdge[]) => void
  addNode: (node: FunnelNode) => void
  updateNode: (id: string, data: Partial<FunnelNodeData>) => void
  removeNode: (id: string) => void
  addEdge: (edge: FunnelEdge) => void
  removeEdge: (id: string) => void
  setSelectedNode: (id: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setViewport: (viewport: CanvasState['viewport']) => void
  reset: () => void
}

// Layout options for Elk.js
export interface LayoutOptions {
  direction: 'LR' | 'TB' | 'RL' | 'BT'
  nodeSpacing: number
  layerSpacing: number
  padding: number
}

// Default layout
export const DEFAULT_LAYOUT: LayoutOptions = {
  direction: 'LR',
  nodeSpacing: 50,
  layerSpacing: 100,
  padding: 50,
}