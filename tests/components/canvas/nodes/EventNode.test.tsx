import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ReactFlowProvider } from '@xyflow/react'
import EventNode from '@/components/canvas/nodes/EventNode'
import type { FunnelNode } from '@/types/canvas'

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<ReactFlowProvider>{ui}</ReactFlowProvider>)
}

describe('EventNode', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render email event with mail icon', () => {
    const nodeData: FunnelNode['data'] = {
      id: 'email-event',
      label: 'Email Follow-up',
      volume: 5000,
      nodeCategory: 'email',
    }
    renderWithProvider(
      <EventNode
        id="email-event"
        type="pageNode"
        data={nodeData}
        position={{ x: 0, y: 0 }}
        selected={false}
        dragging={false}
        isConnectable={true}
        zIndex={1}
      />
    )
    expect(screen.getByText('Email Follow-up')).toBeDefined()
  })

  it('should render sms event', () => {
    const nodeData: FunnelNode['data'] = {
      id: 'sms-event',
      label: 'SMS Reminder',
      volume: 3000,
      nodeCategory: 'sms',
    }
    renderWithProvider(
      <EventNode
        id="sms-event"
        type="pageNode"
        data={nodeData}
        position={{ x: 0, y: 0 }}
        selected={false}
        dragging={false}
        isConnectable={true}
        zIndex={1}
      />
    )
    expect(screen.getByText('SMS Reminder')).toBeDefined()
  })

  it('should apply event-specific colors for email', () => {
    const nodeData: FunnelNode['data'] = {
      id: 'email-event',
      label: 'Email Campaign',
      volume: 5000,
      nodeCategory: 'email',
    }
    const { container } = renderWithProvider(
      <EventNode
        id="email-event"
        type="pageNode"
        data={nodeData}
        position={{ x: 0, y: 0 }}
        selected={false}
        dragging={false}
        isConnectable={true}
        zIndex={1}
      />
    )
    const node = container.firstChild as HTMLElement
    expect(node.style.backgroundColor).toContain('rgb(219, 234, 254)')
  })

  it('should display volume metric', () => {
    const nodeData: FunnelNode['data'] = {
      id: 'event',
      label: 'Event',
      volume: 7500,
      nodeCategory: 'email',
    }
    renderWithProvider(
      <EventNode
        id="event"
        type="pageNode"
        data={nodeData}
        position={{ x: 0, y: 0 }}
        selected={false}
        dragging={false}
        isConnectable={true}
        zIndex={1}
      />
    )
    expect(screen.getByText('7.5K')).toBeDefined()
  })

  it('should apply selected styling', () => {
    const nodeData: FunnelNode['data'] = {
      id: 'event',
      label: 'Event',
      volume: 1000,
      nodeCategory: 'email',
    }
    const { container } = renderWithProvider(
      <EventNode
        id="event"
        type="pageNode"
        data={nodeData}
        position={{ x: 0, y: 0 }}
        selected={true}
        dragging={false}
        isConnectable={true}
        zIndex={1}
      />
    )
    const node = container.firstChild as HTMLElement
    expect(node).toHaveClass('ring-2')
  })
})
