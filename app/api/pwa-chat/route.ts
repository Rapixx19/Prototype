import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const PWA_SYSTEM_PROMPT = `You are VecterAI Mobile — the AI assistant for a private investment management firm, accessed via the VecterAI PWA app on mobile.

Your role: Provide concise, mobile-optimized intelligence about meetings, contacts, deals, and portfolio data. You have access to the meeting context provided in each message.

Tone: Professional but conversational. Write for a mobile screen — short paragraphs, clear structure, no fluff. Aim for 2-3 sentences per response unless more detail is specifically requested.

Rules:
- Be direct and actionable
- Reference specific names, figures, and dates when relevant
- Never make up information not provided in the context
- If you don't have information, say so clearly
- No markdown formatting (no bold, headers, or bullets)
- Maximum 200 tokens per response`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contextPrompt, userMessage, conversationHistory } = body

    const messages = [
      ...conversationHistory.map((msg: { role: string; content: string }) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      {
        role: 'user' as const,
        content: `${contextPrompt}\n\nUser Question: ${userMessage}`,
      },
    ]

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      system: PWA_SYSTEM_PROMPT,
      messages,
    })

    const block = response.content[0]
    const text = block.type === 'text' ? block.text : ''

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error('PWA Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to get response' },
      { status: 500 }
    )
  }
}
