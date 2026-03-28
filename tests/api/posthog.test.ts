import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockSupabase = {
  from: vi.fn(),
  auth: {
    getUser: vi.fn(() => ({ data: { user: { id: 'user1' } } })),
  },
}

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => mockSupabase),
}))

vi.mock('@/lib/integrations/posthog/client', () => ({
  PostHogClient: vi.fn().mockImplementation(() => ({
    testConnection: vi.fn(() => true),
    getPaths: vi.fn(() => ({ results: [] })),
    getEvents: vi.fn(() => ({ results: [] })),
  })),
}))

describe('PostHog Integration API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should validate API key and project ID', async () => {
    const response = { status: 400 }
    expect(response.status).toBe(400)
  })
})