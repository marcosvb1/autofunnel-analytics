import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const SYSTEM_PROMPT = `You are an AI assistant for a marketing funnel canvas application. You help users understand and optimize their marketing funnels, interpret funnel data, and provide insights on conversion rates, drop-off points, and user journey optimization. You can answer questions about funnel structure, metrics, and best practices for improving conversion rates.`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: 'Invalid request: messages array required' },
        { status: 400 }
      )
    }

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
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat' },
      { status: 500 }
    )
  }
}
