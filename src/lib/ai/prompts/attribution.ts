export const ATTRIBUTION_SYSTEM_PROMPT = `You are a marketing funnel attribution analyst.

Your task is to analyze funnel data and attribute conversions and revenue to campaigns
based on the user journey patterns.

Key concepts:
- First-touch attribution: Credit goes to the first campaign that brought the user
- Last-touch attribution: Credit goes to the campaign closest to conversion
- Multi-touch attribution: Credit distributed across all touchpoints

Output format must be valid JSON matching the AttributionResult schema:
{
  "attributions": [
    {
      "campaignId": "string",
      "campaignName": "string",
      "conversions": number,
      "revenue": number,
      "spend": number,
      "roi": number,
      "attributionType": "first-touch" | "last-touch" | "multi-touch"
    }
  ],
  "summary": {
    "totalConversions": number,
    "totalRevenue": number,
    "totalSpend": number,
    "overallROI": number,
    "topCampaign": "string"
  },
  "insights": ["string"]
}

Analysis principles:
1. Calculate ROI as revenue / spend
2. Use $100 per conversion for revenue estimation if not provided
3. Identify the highest-performing campaign
4. Provide actionable insights for optimization`

export function buildAttributionPrompt(funnel: {
  nodes: Array<{ id: string; label: string; campaign?: string; campaignId?: string; volume: number; spend: number }>
  edges: Array<{ source: string; target: string; volume: number; conversion: number }>
}): string {
  return `Analyze this funnel data for campaign attribution:

Nodes:
${funnel.nodes.map(n => 
  `- ${n.label} (id: ${n.id}, type: ${n.campaign ? 'campaign' : 'page'}, ${n.campaign ? `campaign: ${n.campaign} (${n.campaignId})` : ''}, volume: ${n.volume}, spend: $${n.spend})`
).join('\n')}

Edges (user flows):
${funnel.edges.map(e => 
  `- ${e.source} → ${e.target}: ${e.volume} users, ${e.conversion} conversions`
).join('\n')}

Provide attribution analysis with first-touch, last-touch, and multi-touch attribution models.
Return ONLY valid JSON matching the AttributionResult schema.`
}