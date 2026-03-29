'use client'

import { create } from 'zustand'
import type { CanvasState, CanvasActions, FunnelNode, FunnelEdge } from '@/types/canvas'

const initialState: CanvasState = {
  nodes: [],
  edges: [],
  selectedNodeId: null,
  isLoading: false,
  error: null,
  viewport: { x: 0, y: 0, zoom: 1 },
}

interface NodeMapState {
  nodesMap: Map<string, FunnelNode>
  edgesMap: Map<string, FunnelEdge>
}

const nodeMapState: NodeMapState = {
  nodesMap: new Map(),
  edgesMap: new Map(),
}

function mapsToArrays(state: NodeMapState): Pick<CanvasState, 'nodes' | 'edges'> {
  return {
    nodes: Array.from(state.nodesMap.values()),
    edges: Array.from(state.edgesMap.values()),
  }
}

export const useFunnelStore = create<CanvasState & CanvasActions & NodeMapState>((set, get) => ({
  ...initialState,
  ...nodeMapState,

  setNodes: (nodes) => {
    const newMap = new Map<string, FunnelNode>()
    nodes.forEach((node) => newMap.set(node.id, node))
    set({ nodes, nodesMap: newMap })
  },

  setEdges: (edges) => {
    const newMap = new Map<string, FunnelEdge>()
    edges.forEach((edge) => newMap.set(edge.id, edge))
    set({ edges, edgesMap: newMap })
  },

  addNode: (node) => {
    const newMap = new Map(get().nodesMap)
    newMap.set(node.id, node)
    set({ 
      nodes: Array.from(newMap.values()),
      nodesMap: newMap,
    })
  },

  updateNode: (id, data) => {
    const nodesMap = get().nodesMap
    const node = nodesMap.get(id)
    if (!node) return
    
    const updatedNode = { ...node, data: { ...node.data, ...data } }
    const newMap = new Map(nodesMap)
    newMap.set(id, updatedNode)
    
    set({
      nodes: Array.from(newMap.values()),
      nodesMap: newMap,
    })
  },

  removeNode: (id) => {
    const newNodesMap = new Map(get().nodesMap)
    newNodesMap.delete(id)
    
    const newEdgesMap = new Map(get().edgesMap)
    get().edges.forEach((edge) => {
      if (edge.source === id || edge.target === id) {
        newEdgesMap.delete(edge.id)
      }
    })
    
    set({
      nodes: Array.from(newNodesMap.values()),
      edges: Array.from(newEdgesMap.values()),
      nodesMap: newNodesMap,
      edgesMap: newEdgesMap,
    })
  },

  addEdge: (edge) => {
    const newMap = new Map(get().edgesMap)
    newMap.set(edge.id, edge)
    set({ 
      edges: Array.from(newMap.values()),
      edgesMap: newMap,
    })
  },

  removeEdge: (id) => {
    const newMap = new Map(get().edgesMap)
    newMap.delete(id)
    set({ 
      edges: Array.from(newMap.values()),
      edgesMap: newMap,
    })
  },

  setSelectedNode: (id) => set({ selectedNodeId: id }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  setViewport: (viewport) => set({ viewport }),

  reset: () => {
    set({
      ...initialState,
      nodesMap: new Map(),
      edgesMap: new Map(),
    })
  },

  getNode: (id) => get().nodesMap.get(id) || null,

  getEdge: (id) => get().edgesMap.get(id) || null,
}))
