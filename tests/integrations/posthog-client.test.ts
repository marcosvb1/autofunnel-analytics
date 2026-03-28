import { describe, it, expect, vi } from 'vitest'
import { PostHogClient } from '@/lib/integrations/posthog/client'

describe('PostHogClient', () => {
  it('should create client with API key and project ID', () => {
    const client = new PostHogClient('test-key', 'test-project-id')
    expect(client).toBeDefined()
  })

  it('should throw error if API key is missing', () => {
    expect(() => new PostHogClient('', 'test-project-id')).toThrow('API key is required')
  })

  it('should throw error if project ID is missing', () => {
    expect(() => new PostHogClient('test-key', '')).toThrow('Project ID is required')
  })
})