import { describe, it, expect, vi } from 'vitest'
import { MetaAdsClient } from '@/lib/integrations/meta-ads/client'

describe('MetaAdsClient', () => {
  it('should create client with access token', () => {
    const client = new MetaAdsClient('test-access-token')
    expect(client).toBeDefined()
  })

  it('should throw error if access token is missing', () => {
    expect(() => new MetaAdsClient('')).toThrow('Access token is required')
  })
})