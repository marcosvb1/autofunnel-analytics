import { describe, it, expect, vi } from 'vitest'
import { LLMClient } from '@/lib/ai/client'

describe('LLMClient', () => {
  it('should create OpenAI client', () => {
    const client = new LLMClient({ 
      provider: 'openai', 
      apiKey: 'test-key',
      dangerouslyAllowBrowser: true,
    })
    expect(client).toBeDefined()
  })

  it('should create Anthropic client', () => {
    const client = new LLMClient({ 
      provider: 'anthropic', 
      apiKey: 'test-key',
      dangerouslyAllowBrowser: true,
    })
    expect(client).toBeDefined()
  })

  it('should throw error if API key is missing', () => {
    expect(() => new LLMClient({ provider: 'openai', apiKey: '' })).toThrow('API key is required')
  })
})