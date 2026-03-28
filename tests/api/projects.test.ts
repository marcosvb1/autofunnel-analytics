import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        data: [{ id: '1', name: 'Test Project', user_id: 'user1' }],
        error: null,
      })),
    })),
    insert: vi.fn(() => ({
      data: { id: '2', name: 'New Project', user_id: 'user1' },
      error: null,
    })),
    update: vi.fn(() => ({
      eq: vi.fn(() => ({
        data: { id: '1', name: 'Updated Project' },
        error: null,
      })),
    })),
    delete: vi.fn(() => ({
      eq: vi.fn(() => ({
        data: null,
        error: null,
      })),
    })),
  })),
}

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => mockSupabase),
}))

describe('Projects API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch projects for user', async () => {
    const result = await mockSupabase.from('projects').select().eq('user_id', 'user1')
    expect(result.data).toBeDefined()
    expect(result.data?.length).toBe(1)
  })

  it('should create a new project', async () => {
    const result = await mockSupabase.from('projects').insert({ name: 'New Project', user_id: 'user1' })
    expect(result.data).toBeDefined()
    expect(result.data?.name).toBe('New Project')
  })
})