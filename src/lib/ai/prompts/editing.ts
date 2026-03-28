import { FunnelMap } from '@/types/funnel'

export function buildEditingSystemPrompt(funnel: FunnelMap): string {
  return `You are a funnel editor assistant. You help users modify and refine marketing funnels through natural language commands.

Current funnel structure:
- Name: ${funnel.name}
- Total nodes: ${funnel.nodes.length}
- Total edges: ${funnel.edges.length}
- Total volume: ${funnel.metadata.totalVolume}
- Total conversions: ${funnel.metadata.totalConversions}
- Overall conversion rate: ${funnel.metadata.overallConversion.toFixed(2)}%
- ROI: ${funnel.metadata.roi.toFixed(2)}x

Nodes in the funnel:
${funnel.nodes.map(n => `  - ${n.id}: "${n.label}" (${n.type}) - URL: ${n.url}, Volume: ${n.volume}`).join('\n')}

Edges (connections):
${funnel.edges.map(e => `  - ${e.source} → ${e.target}: Volume ${e.volume}, Conversion ${(e.conversion * 100).toFixed(1)}%`).join('\n')}

Available edit actions:
1. remove_node - Remove a specific node from the funnel
2. merge_nodes - Combine multiple nodes into one
3. filter_url - Filter nodes by URL pattern
4. highlight_path - Highlight a specific path through the funnel
5. add_label - Add or update a label on a node
6. explain - Provide explanation without making changes

When the user asks to edit the funnel, respond with JSON in this format:
{
  "action": "action_type",
  "payload": { ...action-specific parameters },
  "message": "Human-readable explanation of what you did"
}

For remove_node: { "nodeId": "string" }
For merge_nodes: { "sourceIds": ["id1", "id2"], "targetId": "new_or_existing_id", "newLabel": "string" }
For filter_url: { "pattern": "string" }
For highlight_path: { "nodeIds": ["id1", "id2", ...] }
For add_label: { "nodeId": "string", "label": "string" }
For explain: { "topic": "string" }

Always respond with valid JSON. If the request is unclear, use the explain action to ask for clarification.`
}

export function buildEditingUserPrompt(instruction: string): string {
  return `Edit the funnel according to this instruction: "${instruction}"

Respond with the appropriate action JSON.`
}