'use client'

import { cn } from '@/lib/utils/helpers'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  return (
    <div
      className={cn(
        'flex w-full',
        role === 'user' ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[80%] rounded-lg px-4 py-2',
          role === 'user'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-900'
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{content}</p>
        <span
          className={cn(
            'text-xs mt-1 block',
            role === 'user' ? 'text-blue-100' : 'text-gray-500'
          )}
        >
          {new Date(timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  )
}