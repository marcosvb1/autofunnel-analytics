import { createLLMClient, LLMClient } from '@/lib/ai/client'
import { buildEditingSystemPrompt, buildEditingUserPrompt } from '@/lib/ai/prompts/editing'
import { FunnelMap, FunnelNodeData, FunnelEditResult } from '@/types/funnel'

interface EditAction {
  action: 'remove_node' | 'merge_nodes' | 'filter_url' | 'highlight_path' | 'add_label' | 'explain'
  payload: Record<string, unknown>
  message: string
}

export class FunnelEditor {
  private client: LLMClient
  
  constructor() {
    this.client = createLLMClient('anthropic')
  }
  
  async processEdit(funnel: FunnelMap, instruction: string): Promise<FunnelEditResult> {
    const systemPrompt = buildEditingSystemPrompt(funnel)
    const userPrompt = buildEditingUserPrompt(instruction)
    
    const response = await this.client.complete({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      responseFormat: 'json',
    })
    
    try {
      const action = this.parseActionResponse(response.content)
      return this.applyEditAction(funnel, action)
    } catch (error) {
      return {
        success: false,
        message: `Failed to parse edit instruction: ${error instanceof Error ? error.message : 'Unknown error'}`,
        nodes: funnel.nodes,
        edges: funnel.edges
      }
    }
  }
  
  private parseActionResponse(content: string): EditAction {
    const parsed = JSON.parse(content)
    
    if (!parsed.action || !parsed.payload) {
      throw new Error('Invalid action format: missing action or payload')
    }
    
    return {
      action: parsed.action,
      payload: parsed.payload,
      message: parsed.message || 'Edit applied'
    }
  }
  
  private applyEditAction(funnel: FunnelMap, action: EditAction): FunnelEditResult {
    switch (action.action) {
      case 'remove_node':
        return this.removeNode(funnel, action.payload)
      case 'merge_nodes':
        return this.mergeNodes(funnel, action.payload)
      case 'filter_url':
        return this.filterByUrl(funnel, action.payload)
      case 'highlight_path':
        return this.highlightPath(funnel, action.payload)
      case 'add_label':
        return this.addLabel(funnel, action.payload)
      case 'explain':
        return {
          success: true,
          message: action.message,
          nodes: funnel.nodes,
          edges: funnel.edges
        }
      default:
        return {
          success: false,
          message: `Unknown action: ${action.action}`,
          nodes: funnel.nodes,
          edges: funnel.edges
        }
    }
  }
  
  private removeNode(funnel: FunnelMap, payload: Record<string, unknown>): FunnelEditResult {
    const nodeId = payload.nodeId as string
    if (!nodeId) {
      return { success: false, message: 'Missing nodeId', nodes: funnel.nodes, edges: funnel.edges }
    }
    
    const nodes = funnel.nodes.filter(n => n.id !== nodeId)
    const edges = funnel.edges.filter(e => e.source !== nodeId && e.target !== nodeId)
    
    if (nodes.length === funnel.nodes.length) {
      return { success: false, message: `Node ${nodeId} not found`, nodes: funnel.nodes, edges: funnel.edges }
    }
    
    return {
      success: true,
      message: `Removed node ${nodeId} and its connections`,
      nodes,
      edges
    }
  }
  
  private mergeNodes(funnel: FunnelMap, payload: Record<string, unknown>): FunnelEditResult {
    const sourceIds = payload.sourceIds as string[]
    const targetId = payload.targetId as string
    const newLabel = payload.newLabel as string
    
    if (!sourceIds || sourceIds.length < 2) {
      return { success: false, message: 'Need at least 2 sourceIds to merge', nodes: funnel.nodes, edges: funnel.edges }
    }
    
    const sourceNodes = funnel.nodes.filter(n => sourceIds.includes(n.id))
    if (sourceNodes.length !== sourceIds.length) {
      return { success: false, message: 'Some source nodes not found', nodes: funnel.nodes, edges: funnel.edges }
    }
    
    const mergedVolume = sourceNodes.reduce((sum, n) => sum + n.volume, 0)
    const mergedSpend = sourceNodes.reduce((sum, n) => sum + n.spend, 0)
    
    const mergedNode: FunnelNodeData = {
      id: targetId,
      label: newLabel || sourceNodes.map(n => n.label).join(' + '),
      url: sourceNodes[0].url,
      type: sourceNodes[0].type,
      volume: mergedVolume,
      spend: mergedSpend,
      campaign: sourceNodes[0].campaign
    }
    
    const remainingNodes = funnel.nodes.filter(n => !sourceIds.includes(n.id))
    const nodes = [...remainingNodes, mergedNode]
    
    const edges = funnel.edges.map(e => {
      if (sourceIds.includes(e.source)) {
        return { ...e, source: targetId }
      }
      if (sourceIds.includes(e.target)) {
        return { ...e, target: targetId }
      }
      return e
    }).filter(e => e.source !== e.target)
    
    return {
      success: true,
      message: `Merged ${sourceIds.length} nodes into ${targetId}`,
      nodes,
      edges
    }
  }
  
  private filterByUrl(funnel: FunnelMap, payload: Record<string, unknown>): FunnelEditResult {
    const pattern = payload.pattern as string
    if (!pattern) {
      return { success: false, message: 'Missing URL pattern', nodes: funnel.nodes, edges: funnel.edges }
    }
    
    const regex = new RegExp(pattern, 'i')
    const matchingNodes = funnel.nodes.filter(n => regex.test(n.url))
    const matchingIds = matchingNodes.map(n => n.id)
    
    const edges = funnel.edges.filter(e => matchingIds.includes(e.source) && matchingIds.includes(e.target))
    
    return {
      success: true,
      message: `Filtered to ${matchingNodes.length} nodes matching "${pattern}"`,
      nodes: matchingNodes,
      edges
    }
  }
  
  private highlightPath(funnel: FunnelMap, payload: Record<string, unknown>): FunnelEditResult {
    const nodeIds = payload.nodeIds as string[]
    if (!nodeIds || nodeIds.length === 0) {
      return { success: false, message: 'Missing nodeIds for path', nodes: funnel.nodes, edges: funnel.edges }
    }
    
    const nodes = funnel.nodes.map(n => ({
      ...n,
      volume: nodeIds.includes(n.id) ? n.volume : Math.floor(n.volume * 0.3)
    }))
    
    const edges = funnel.edges.map(e => ({
      ...e,
      isMainPath: nodeIds.includes(e.source) && nodeIds.includes(e.target),
      volume: nodeIds.includes(e.source) && nodeIds.includes(e.target) ? e.volume : Math.floor(e.volume * 0.3)
    }))
    
    return {
      success: true,
      message: `Highlighted path through ${nodeIds.length} nodes`,
      nodes,
      edges
    }
  }
  
  private addLabel(funnel: FunnelMap, payload: Record<string, unknown>): FunnelEditResult {
    const nodeId = payload.nodeId as string
    const label = payload.label as string
    
    if (!nodeId || !label) {
      return { success: false, message: 'Missing nodeId or label', nodes: funnel.nodes, edges: funnel.edges }
    }
    
    const nodeIndex = funnel.nodes.findIndex(n => n.id === nodeId)
    if (nodeIndex === -1) {
      return { success: false, message: `Node ${nodeId} not found`, nodes: funnel.nodes, edges: funnel.edges }
    }
    
    const nodes = [...funnel.nodes]
    nodes[nodeIndex] = { ...nodes[nodeIndex], label }
    
    return {
      success: true,
      message: `Updated label for node ${nodeId} to "${label}"`,
      nodes,
      edges: funnel.edges
    }
  }
}

export async function processEdit(funnel: FunnelMap, instruction: string): Promise<FunnelEditResult> {
  const editor = new FunnelEditor()
  return editor.processEdit(funnel, instruction)
}