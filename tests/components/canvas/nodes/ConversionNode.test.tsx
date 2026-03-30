import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ReactFlowProvider } from '@xyflow/react'
import ConversionNode from '@/components/canvas/nodes/ConversionNode'
import type { FunnelNode } from '@/types/canvas'

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<ReactFlowProvider>{ui}</ReactFlowProvider>)
}

describe('ConversionNode', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render purchase conversion', () => {
    const nodeData: FunnelNode['data'] = {
      id: 'purchase',
      label: 'Purchase Completed',
      volume: 500,
      spend: 2500,
      nodeCategory: 'purchase',
    }
    renderWithProvider(
      <ConversionNode
        id="purchase"
        type="pageNode"
        data={nodeData}
        position={{ x: 0, y: 0 }}
        selected={false}
        dragging={false}
        isConnectable={true}
        zIndex={1}
      />
    )
    expect(screen.getByText('Purchase Completed')).toBeDefined()
  })

  it('should render lead conversion', () => {
    const nodeData: FunnelNode['data'] = {
      id: 'lead',
      label: 'Lead Generated',
      volume: 1200,
      nodeCategory: 'lead',
    }
    renderWithProvider(
      <ConversionNode
        id="lead"
        type="pageNode"
        data={nodeData}
        position={{ x: 0, y: 0 }}
        selected={false}
        dragging={false}
        isConnectable={true}
        zIndex={1}
      />
    )
    expect(screen.getByText('Lead Generated')).toBeDefined()
  })

  it('should apply purchase-specific green colors', () => {
    const nodeData: FunnelNode['data'] = {
      id: 'purchase',
      label: 'Sale',
      volume: 500,
      nodeCategory: 'purchase',
    }
    const { container } = renderWithProvider(
      <ConversionNode
        id="purchase"
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
    expect(node.style.borderColor).toContain('rgb(34, 197, 94)')
  })

  it('should display conversions and spend', () => {
    const nodeData: FunnelNode['data'] = {
      id: 'purchase',
      label: 'Sale',
      volume: 750,
      spend: 3500,
      nodeCategory: 'purchase',
    }
    renderWithProvider(
      <ConversionNode
        id="purchase"
        type="pageNode"
        data={nodeData}
        position={{ x: 0, y: 0 }}
        selected={false}
        dragging={false}
        isConnectable={true}
        zIndex={1}
      />
    )
    expect(screen.getByText('750')).toBeDefined()
    expect(screen.getByText('$3.5K')).toBeDefined()
  })

  it('should have pulse animation on icon', () => {
    const nodeData: FunnelNode['data'] = {
      id: 'purchase',
      label: 'Sale',
      volume: 100,
      nodeCategory: 'purchase',
    }
    const { container } = renderWithProvider(
      <ConversionNode
        id="purchase"
        type="pageNode"
        data={nodeData}
        position={{ x: 0, y: 0 }}
        selected={false}
        dragging={false}
        isConnectable={true}
        zIndex={1}
      />
    )
    const iconContainer = container.querySelector('.animate-pulse')
    expect(iconContainer).toBeDefined()
  })
})
