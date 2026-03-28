import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getIntegration } from '@/lib/db/integrations'
import { PostHogClient } from '@/lib/integrations/posthog/client'
import { 
  checkMetaAdsSource, 
  fetchMetaAdsCampaignsViaPostHog 
} from '@/lib/integrations/posthog/meta-ads-source'
import { calculateAttribution } from '@/lib/integrations/posthog/attribution'

export async function GET(request: NextRequest) {
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

    const posthogIntegration = await getIntegration(projectId, 'posthog')
    if (!posthogIntegration) {
      return NextResponse.json({ 
        error: 'PostHog not connected',
        suggestion: 'Connect PostHog first, then add Meta Ads as source in PostHog dashboard',
        setupUrl: 'https://app.posthog.com/data-management/sources',
      }, { status: 400 })
    }

    const credentials = posthogIntegration.credentials as {
      api_key: string
      project_id: string
      host?: string
    }

    const client = new PostHogClient(credentials)
    
    const metaAdsSource = await checkMetaAdsSource(client)
    
    if (!metaAdsSource.connected) {
      return NextResponse.json({
        connected: false,
        mode: 'posthog',
        message: 'Meta Ads source not connected in PostHog',
        setupUrl: 'https://app.posthog.com/data-management/sources',
        instructions: [
          'Go to PostHog Dashboard → Data Management → Sources',
          'Click "Link" on Meta Ads',
          'Enter your Meta Ads Account ID',
          'Authorize with your Meta account',
          'Data will sync automatically',
        ],
      })
    }

    const campaigns = await fetchMetaAdsCampaignsViaPostHog(client)

    return NextResponse.json({
      connected: true,
      mode: 'posthog',
      tables: metaAdsSource.tables,
      campaigns,
    })
  } catch (error) {
    console.error('Failed to check Meta Ads source:', error)
    return NextResponse.json(
      { error: 'Failed to check Meta Ads source' },
      { status: 500 }
    )
  }
}

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
    const { conversion_event, date_range } = body

    if (conversion_event !== undefined && (typeof conversion_event !== 'string' || conversion_event === '')) {
      return NextResponse.json(
        { error: 'conversion_event must be a non-empty string' },
        { status: 400 }
      )
    }

    if (date_range !== undefined) {
      if (typeof date_range !== 'object' || date_range === null) {
        return NextResponse.json(
          { error: 'date_range must be an object with start and end properties' },
          { status: 400 }
        )
      }
      if (!date_range.start || !date_range.end) {
        return NextResponse.json(
          { error: 'date_range must include both start and end properties' },
          { status: 400 }
        )
      }
    }

    const posthogIntegration = await getIntegration(projectId, 'posthog')
    if (!posthogIntegration) {
      return NextResponse.json({ error: 'PostHog not connected' }, { status: 400 })
    }

    const credentials = posthogIntegration.credentials as {
      api_key: string
      project_id: string
      host?: string
    }

    const client = new PostHogClient(credentials)
    
    const attribution = await calculateAttribution(
      client, 
      conversion_event || 'purchase',
      date_range
    )

    return NextResponse.json({
      attribution,
      meta: {
        conversion_event: conversion_event || 'purchase',
        date_range: date_range || { start: 'now() - INTERVAL 30 DAY', end: 'now()' },
      },
    })
  } catch (error) {
    console.error('Failed to calculate attribution:', error)
    return NextResponse.json(
      { error: 'Failed to calculate attribution' },
      { status: 500 }
    )
  }
}