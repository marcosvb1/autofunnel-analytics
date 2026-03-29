'use client'

import { create } from 'zustand'
import { applyNodeChanges, applyEdgeChanges } from '@xyflow/react'
import type { NodeChange, EdgeChange } from '@xyflow/react'
import type { FunnelNode, FunnelEdge } from '@/types/funnel'

interface CanvasState {
  nodes: FunnelNode[]
  edges: FunnelEdge[]
  selectedNodeIds: string[]
  selectedEdgeIds: string[]
}

interface CanvasActions {
  setNodes: (nodes: FunnelNode[]) => void
  setEdges: (edges: FunnelEdge[]) => void
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  addNode: (node: FunnelNode) => void
  removeNode: (nodeId: string) => void
  addEdge: (edge: FunnelEdge) => void
  removeEdge: (edgeId: string) => void
  selectNode: (nodeId: string) => void
  deselectAll: () => void
}

export const useCanvasStore = create<CanvasState & CanvasActions>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeIds: [],
  selectedEdgeIds: [],

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) as unknown as FunnelNode[] })
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) as unknown as FunnelEdge[] })
  },

  addNode: (node) => {
    set({ nodes: [...get().nodes, node] })
  },

  removeNode: (nodeId) => {
    set({
      nodes: get().nodes.filter((n) => n.id !== nodeId),
      edges: get().edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
    })
  },

  addEdge: (edge) => {
    set({ edges: [...get().edges, edge] })
  },

  removeEdge: (edgeId) => {
    set({ edges: get().edges.filter((e) => e.id !== edgeId) })
  },

  selectNode: (nodeId) => {
    set({ selectedNodeIds: [nodeId] })
  },

  deselectAll: () => {
    set({ selectedNodeIds: [], selectedEdgeIds: [] })
  },
}))
