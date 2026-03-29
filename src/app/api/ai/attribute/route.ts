import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getIntegration } from '@/lib/db/integrations'
import { MetaAdsClient } from '@/lib/integrations/meta-ads/client'
import { processAttribution, AttributionResult } from '@/lib/ai/processing/attribution'
import { withCache } from '@/lib/utils/cache'
import type { FunnelMap } from '@/types/funnel'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const projectId = request.headers.get('x-project-id')
    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 })
    }

    const body = await request.json()
    const { mapId } = body

    if (!mapId || typeof mapId !== 'string') {
      return NextResponse.json({ error: 'Map ID required' }, { status: 400 })
    }

    const { data: funnelRow, error: fetchError } = await supabase
      .from('funnel_maps')
      .select('*')
      .eq('id', mapId)
      .eq('project_id', projectId)
      .single()

    if (fetchError || !funnelRow) {
      return NextResponse.json(
        { error: 'Funnel map not found' },
        { status: 404 }
      )
    }

    const funnel: FunnelMap = {
      id: funnelRow.id,
      projectId: funnelRow.project_id,
      name: funnelRow.name,
      nodes: funnelRow.nodes as unknown as FunnelMap['nodes'],
      edges: funnelRow.edges as unknown as FunnelMap['edges'],
      metadata: funnelRow.metadata as unknown as FunnelMap['metadata'],
    }

    let campaigns: FunnelMap['metadata'] = funnel.metadata

    const metaIntegration = await getIntegration(projectId, 'meta_ads')
    if (metaIntegration) {
      const credentials = metaIntegration.credentials as {
        access_token: string
        ad_account_id?: string
      }

      if (credentials.ad_account_id) {
        try {
          const metaClient = new MetaAdsClient(
            credentials.access_token,
            credentials.ad_account_id
          )

          const metaCampaigns = await metaClient.getCampaigns({ limit: 50 })

          const enrichedNodes = funnel.nodes.map((node) => {
            if (node.campaignId) {
              const metaCampaign = metaCampaigns.find(
                (c) => c.id === node.campaignId
              )
              if (metaCampaign) {
                return {
                  ...node,
                  campaign: metaCampaign.name,
                }
              }
            }
            return node
          })

          funnel.nodes = enrichedNodes

          const campaignsWithSpend = await Promise.all(
            metaCampaigns.slice(0, 20).map(async (c) => {
              try {
                const insights = await withCache(
                  `meta:insights:${c.id}`,
                  () => metaClient.getCampaignInsights(c.id),
                  5 * 60 * 1000 // 5 minutes
                )
                const spend = insights ? parseFloat(insights.spend) : 0
                return {
                  id: c.id,
                  name: c.name,
                  spend,
                }
              } catch {
                return {
                  id: c.id,
                  name: c.name,
                  spend: 0,
                }
              }
            })
          )

          funnel.metadata.totalSpend = campaignsWithSpend.reduce(
            (sum, c) => sum + c.spend,
            0
          )

          funnel.nodes = funnel.nodes.map((node) => {
            if (node.campaignId) {
              const campaign = campaignsWithSpend.find(
                (c) => c.id === node.campaignId
              )
              if (campaign && campaign.spend > 0) {
                return { ...node, spend: campaign.spend }
              }
            }
            return node
          })
        } catch (metaError) {
          console.error('Failed to fetch Meta campaigns:', metaError)
        }
      }
    }

    const attributionResult: AttributionResult = await processAttribution(funnel)

    const updatedMetadata = {
      ...funnel.metadata,
      attribution: {
        attributions: attributionResult.attributions,
        summary: attributionResult.summary,
        insights: attributionResult.insights,
      },
    }

    const { data: updatedFunnel, error: updateError } = await supabase
      .from('funnel_maps')
      .update({
        nodes: funnel.nodes as unknown as Record<string, unknown>[],
        edges: funnel.edges as unknown as Record<string, unknown>[],
        metadata: updatedMetadata as unknown as Record<string, unknown>,
        updated_at: new Date().toISOString(),
      })
      .eq('id', mapId)
      .select()
      .single()

    if (updateError) {
      console.error('Failed to update funnel:', updateError)
      return NextResponse.json(
        { error: 'Failed to save attribution results' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      funnel: {
        ...updatedFunnel,
        nodes: updatedFunnel.nodes as unknown as FunnelMap['nodes'],
        edges: updatedFunnel.edges as unknown as FunnelMap['edges'],
        metadata: updatedFunnel.metadata as unknown as FunnelMap['metadata'],
      },
      attribution: attributionResult,
    })
  } catch (error) {
    console.error('Attribution error:', error)
    return NextResponse.json(
      { error: 'Failed to process attribution' },
      { status: 500 }
    )
  }
}