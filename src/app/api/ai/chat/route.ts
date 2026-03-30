import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are an AI assistant for a marketing funnel canvas application.`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: 'Invalid request: messages array required' },
        { status: 400 }
      )
    }

    // Only call OpenAI if API key is available
    if (process.env.OPENAI_API_KEY) {
      const OpenAI = (await import('openai')).default
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...body.messages,
        ],
        temperature: 0.7,
        max_tokens: 500,
      })

      return NextResponse.json({
        message: {
          role: completion.choices[0].message.role,
          content: completion.choices[0].message.content,
        },
      })
    }

    return NextResponse.json({
      message: {
        role: 'assistant',
        content: 'AI is not configured. Please set OPENAI_API_KEY environment variable.',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat' },
      { status: 500 }
    )
  }
}
