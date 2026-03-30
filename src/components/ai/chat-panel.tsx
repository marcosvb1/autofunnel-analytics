'use client'

import { useRef, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useAiChat } from '@/hooks/use-ai-chat'
import { ChatMessage } from '@/components/ai/chat-message'
import { ChatInput } from '@/components/ai/chat-input'
import type { FunnelNodeData, FunnelEdgeData } from '@/types/funnel'

interface ChatPanelProps {
  projectId: string
  mapId: string
  onFunnelUpdate: (nodes: FunnelNodeData[], edges: FunnelEdgeData[]) => void
}

const examplePrompts = [
  'Remove all low-volume nodes (under 100 visits)',
  'Highlight the main conversion path',
  'Merge similar landing pages',
  'Show only Meta Ads traffic',
]

export function ChatPanel({ projectId, mapId, onFunnelUpdate }: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { messages, isProcessing, sendMessage } = useAiChat({
    projectId,
    mapId,
    onFunnelUpdate,
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>AI Funnel Editor</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-3">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-gray-500 mb-4">
                Ask me to edit your funnel map
              </p>
              <div className="space-y-2">
                {examplePrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    disabled={isProcessing}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline disabled:opacity-50 disabled:no-underline"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                role={msg.role === 'system' ? 'assistant' : msg.role}
                content={msg.content}
                timestamp={msg.timestamp}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </CardContent>
    </Card>
  )
}