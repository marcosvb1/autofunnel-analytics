import { describe, it, expect, vi } from 'vitest'

describe('PostHog Sync', () => {
  it('should export syncPostHogPaths function', async () => {
    const { syncPostHogPaths } = await import('@/lib/integrations/posthog/sync')
    expect(syncPostHogPaths).toBeDefined()
    expect(typeof syncPostHogPaths).toBe('function')
  })
})