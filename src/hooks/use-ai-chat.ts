'use client'

import { useState, useCallback } from 'react'
import type { ChatMessage, FunnelNodeData, FunnelEdgeData } from '@/types/funnel'

interface UseAiChatOptions {
  projectId: string
  mapId: string
  onFunnelUpdate?: (nodes: FunnelNodeData[], edges: FunnelEdgeData[]) => void
}

export function useAiChat({ projectId, mapId, onFunnelUpdate }: UseAiChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-project-id': projectId,
        },
        body: JSON.stringify({ mapId, message: content.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date().toISOString(),
      }

      setMessages(prev => [...prev, assistantMessage])

      if (data.success && data.nodes && data.edges && onFunnelUpdate) {
        onFunnelUpdate(data.nodes, data.edges)
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: error instanceof Error ? error.message : 'An error occurred',
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [projectId, mapId, onFunnelUpdate])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  }
}