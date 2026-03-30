'use client'

import { useState, useCallback } from 'react'
import type { ChatMessage, FunnelNodeData, FunnelEdgeData } from '@/types/funnel'

interface UseAiChatOptions {
  projectId?: string
  mapId?: string
  onFunnelUpdate?: (nodes: FunnelNodeData[], edges: FunnelEdgeData[]) => void
}

export function useAiChat({ projectId, mapId, onFunnelUpdate }: UseAiChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(async (content: string, canvasState?: any) => {
    if (!content.trim()) return

    setError(null)

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    setIsProcessing(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(projectId && { 'x-project-id': projectId }),
        },
        body: JSON.stringify({
          messages: [{ role: 'user' as const, content: content.trim() }],
          canvasState,
          mapId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.message.content || data.message,
        timestamp: new Date().toISOString(),
      }

      setMessages(prev => [...prev, assistantMessage])

      if (data.success && data.nodes && data.edges && onFunnelUpdate) {
        onFunnelUpdate(data.nodes, data.edges)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, assistantMessage])
    } finally {
      setIsProcessing(false)
    }
  }, [projectId, mapId, onFunnelUpdate])

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return {
    messages,
    isProcessing,
    error,
    sendMessage,
    clearMessages,
  }
}