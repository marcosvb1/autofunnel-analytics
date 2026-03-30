import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const mockCreate = vi.fn()

vi.mock('openai', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    })),
  }
})

describe('AI Chat API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.OPENAI_API_KEY = 'test-key'
  })

  afterEach(() => {
    delete process.env.OPENAI_API_KEY
  })

  it('should return 200 with valid request', async () => {
    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            role: 'assistant',
            content: 'Hello! How can I help you with your funnel?',
          },
        },
      ],
    })

    const { POST } = await import('@/app/api/ai/chat/route')
    const mockRequest = new Request('http://localhost:3000/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'user', content: 'How do I improve conversion rates?' },
        ],
      }),
    })

    const response = await POST(mockRequest)
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.message).toBeDefined()
    expect(data.message.role).toBe('assistant')
    expect(data.message.content).toBe('Hello! How can I help you with your funnel?')
  })

  it('should return 400 for invalid input - missing messages', async () => {
    const { POST } = await import('@/app/api/ai/chat/route')
    const mockRequest = new Request('http://localhost:3000/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })

    const response = await POST(mockRequest)
    expect(response.status).toBe(400)

    const data = await response.json()
    expect(data.error).toBe('Invalid request: messages array required')
  })

  it('should return 400 for invalid input - messages not an array', async () => {
    const { POST } = await import('@/app/api/ai/chat/route')
    const mockRequest = new Request('http://localhost:3000/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: 'not an array' }),
    })

    const response = await POST(mockRequest)
    expect(response.status).toBe(400)

    const data = await response.json()
    expect(data.error).toBe('Invalid request: messages array required')
  })

  it('should return 500 on OpenAI API error', async () => {
    mockCreate.mockRejectedValue(new Error('OpenAI API error'))

    const { POST } = await import('@/app/api/ai/chat/route')
    const mockRequest = new Request('http://localhost:3000/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'user', content: 'Test message' },
        ],
      }),
    })

    const response = await POST(mockRequest)
    expect(response.status).toBe(500)

    const data = await response.json()
    expect(data.error).toBe('Failed to process chat')
  })
})
