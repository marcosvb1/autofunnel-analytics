import { NextRequest, NextResponse } from 'next/server'
import { fetchFunnelPaths, fetchPageViews } from '@/lib/analytics/posthog-sync'

export async function GET(request: NextRequest) {
  const projectId = request.nextUrl.searchParams.get('projectId')

  if (!projectId) {
    return NextResponse.json({ error: 'projectId is required' }, { status: 400 })
  }

  try {
    const [paths, pageViews] = await Promise.all([
      fetchFunnelPaths(projectId, 30),
      fetchPageViews(projectId),
    ])

    return NextResponse.json({
      paths,
      pageViews,
      lastSyncedAt: new Date().toISOString(),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to sync PostHog data'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
