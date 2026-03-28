import { describe, it, expect, vi } from 'vitest'
import { createBrowserClient } from '@supabase/ssr'

vi.mock('@supabase/ssr', () => ({
  createBrowserClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(),
  })),
}))

describe('Supabase Browser Client', () => {
  it('should create client with env variables', () => {
    const client = createBrowserClient(
      'https://test.supabase.co',
      'test-anon-key'
    )
    expect(client).toBeDefined()
    expect(client.auth).toBeDefined()
  })
})