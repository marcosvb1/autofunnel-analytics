import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AIChatPanel from '@/components/canvas/panels/AIChatPanel'
import type { ChatMessage } from '@/types/funnel'

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'user',
    content: 'What is my conversion rate?',
    timestamp: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    role: 'assistant',
    content: 'Your overall conversion rate is 3.2%, which is above the industry average of 2.5%.',
    timestamp: '2024-01-15T10:00:05Z',
  },
]

describe('AIChatPanel', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    messages: [] as ChatMessage[],
    isProcessing: false,
    onSendMessage: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not render when isOpen is false', () => {
    render(<AIChatPanel {...defaultProps} isOpen={false} />)
    expect(screen.queryByText('AI Assistant')).not.toBeInTheDocument()
  })

  it('renders header with title and close button', () => {
    render(<AIChatPanel {...defaultProps} />)
    
    expect(screen.getByText('AI Assistant')).toBeDefined()
    expect(screen.getByTitle('Close chat')).toBeDefined()
  })

  it('calls onClose when close button is clicked', () => {
    render(<AIChatPanel {...defaultProps} />)
    
    const closeButton = screen.getByTitle('Close chat')
    fireEvent.click(closeButton)
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('renders empty state when no messages', () => {
    render(<AIChatPanel {...defaultProps} />)
    
    expect(
      screen.getByText('Start a conversation with your AI assistant')
    ).toBeDefined()
    expect(
      screen.getByText('Ask about funnel insights, optimization tips, or data analysis')
    ).toBeDefined()
  })

  it('renders user messages right-aligned with blue background', () => {
    render(<AIChatPanel {...defaultProps} messages={mockMessages} />)
    
    const userMessage = screen.getByText('What is my conversion rate?')
    const userMessageContainer = userMessage.closest('div')
    const flexContainer = userMessage.closest('.flex')
    
    expect(userMessageContainer?.classList.contains('bg-blue-600')).toBe(true)
    expect(flexContainer?.classList.contains('justify-end')).toBe(true)
  })

  it('renders assistant messages left-aligned with gray background', () => {
    render(<AIChatPanel {...defaultProps} messages={mockMessages} />)
    
    const assistantMessage = screen.getByText(/Your overall conversion rate is 3.2%/)
    const assistantMessageContainer = assistantMessage.closest('div')
    const flexContainer = assistantMessage.closest('.flex')
    
    expect(assistantMessageContainer?.classList.contains('bg-gray-100')).toBe(true)
    expect(flexContainer?.classList.contains('justify-start')).toBe(true)
  })

  it('displays message timestamps', () => {
    render(<AIChatPanel {...defaultProps} messages={mockMessages} />)
    
    const timestamps = document.querySelectorAll('p.text-xs.mt-1')
    expect(timestamps.length).toBe(2)
    expect(timestamps[0].textContent).toMatch(/\d{1,2}:\d{2}/)
  })

  it('renders loading indicator when processing', () => {
    render(<AIChatPanel {...defaultProps} isProcessing={true} />)
    
    const loadingDots = document.querySelectorAll('.animate-bounce')
    expect(loadingDots.length).toBe(3)
  })

  it('renders input field and send button', () => {
    render(<AIChatPanel {...defaultProps} />)
    
    const input = screen.getByPlaceholderText('Ask about your funnel...')
    const sendButton = screen.getByRole('button', { name: /send/i })
    
    expect(input).toBeDefined()
    expect(sendButton).toBeDefined()
  })

  it('calls onSendMessage when form is submitted with text', async () => {
    render(<AIChatPanel {...defaultProps} />)
    
    const input = screen.getByPlaceholderText('Ask about your funnel...')
    const sendButton = screen.getByRole('button', { name: /send/i })
    
    fireEvent.change(input, { target: { value: 'How can I improve my ROI?' } })
    fireEvent.click(sendButton)
    
    await waitFor(() => {
      expect(defaultProps.onSendMessage).toHaveBeenCalledWith('How can I improve my ROI?')
    })
  })

  it('calls onSendMessage when Enter is pressed', async () => {
    render(<AIChatPanel {...defaultProps} />)
    
    const input = screen.getByPlaceholderText('Ask about your funnel...')
    const form = input.closest('form')
    
    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.submit(form!)
    
    await waitFor(() => {
      expect(defaultProps.onSendMessage).toHaveBeenCalledWith('Test message')
    })
  })

  it('does not send empty messages', () => {
    render(<AIChatPanel {...defaultProps} />)
    
    const input = screen.getByPlaceholderText('Ask about your funnel...')
    const sendButton = screen.getByRole('button', { name: /send/i })
    
    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.click(sendButton)
    
    expect(defaultProps.onSendMessage).not.toHaveBeenCalled()
  })

  it('clears input after sending message', async () => {
    render(<AIChatPanel {...defaultProps} />)
    
    const input = screen.getByPlaceholderText('Ask about your funnel...')
    const sendButton = screen.getByRole('button', { name: /send/i })
    
    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.click(sendButton)
    
    await waitFor(() => {
      expect((input as HTMLInputElement).value).toBe('')
    })
  })

  it('disables send button when processing', () => {
    render(<AIChatPanel {...defaultProps} isProcessing={true} />)
    
    const sendButton = screen.getByRole('button', { name: /send/i })
    expect(sendButton).toBeDisabled()
  })

  it('disables input when processing', () => {
    render(<AIChatPanel {...defaultProps} isProcessing={true} />)
    
    const input = screen.getByPlaceholderText('Ask about your funnel...')
    expect(input).toBeDisabled()
  })

  it('auto-scrolls to latest message when messages change', async () => {
    const { rerender } = render(<AIChatPanel {...defaultProps} messages={[]} />)
    
    const newMessages: ChatMessage[] = [
      ...mockMessages,
      {
        id: '3',
        role: 'user',
        content: 'New message',
        timestamp: '2024-01-15T10:01:00Z',
      },
    ]
    
    rerender(<AIChatPanel {...defaultProps} messages={newMessages} />)
    
    await waitFor(() => {
      expect(screen.getByText('New message')).toBeDefined()
    })
  })

  it('focuses input when panel opens', async () => {
    const { container } = render(<AIChatPanel {...defaultProps} />)
    
    await waitFor(() => {
      const input = container.querySelector('input')
      expect(document.activeElement).toBe(input)
    })
  })

  it('applies correct width of 320px', () => {
    render(<AIChatPanel {...defaultProps} />)
    
    const panel = document.querySelector('.fixed.right-0')
    expect(panel?.classList.contains('w-[320px]')).toBe(true)
  })
})
