import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ReactFlowProvider } from '@xyflow/react'
import TrafficSourceNode from '@/components/canvas/nodes/TrafficSourceNode'
import type { FunnelNode } from '@/types/canvas'

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<ReactFlowProvider>{ui}</ReactFlowProvider>)
}

describe('TrafficSourceNode', () => {
  const mockNodeData: FunnelNode['data'] = {
    id: 'test-node',
    label: 'Facebook Ads Campaign',
    volume: 10000,
    spend: 5000,
    nodeCategory: 'facebook_ads',
    campaign: 'Summer Sale 2024',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render traffic source node with label', () => {
    renderWithProvider(
      <TrafficSourceNode
        id="test-node"
        type="pageNode"
        data={mockNodeData}
        position={{ x: 0, y: 0 }}
        selected={false}
        dragging={false}
        isConnectable={true}
        zIndex={1}
      />
    )
    expect(screen.getByText('Facebook Ads Campaign')).toBeDefined()
  })

  it('should display volume metric', () => {
    renderWithProvider(
      <TrafficSourceNode
        id="test-node"
        type="pageNode"
        data={mockNodeData}
        position={{ x: 0, y: 0 }}
        selected={false}
        dragging={false}
        isConnectable={true}
        zIndex={1}
      />
    )
    expect(screen.getByText('10.0K')).toBeDefined()
  })

  it('should display spend when provided', () => {
    renderWithProvider(
      <TrafficSourceNode
        id="test-node"
        type="pageNode"
        data={mockNodeData}
        position={{ x: 0, y: 0 }}
        selected={false}
        dragging={false}
        isConnectable={true}
        zIndex={1}
      />
    )
    expect(screen.getByText('$5.0K')).toBeDefined()
  })

  it('should show campaign badge when campaign is provided', () => {
    renderWithProvider(
      <TrafficSourceNode
        id="test-node"
        type="pageNode"
        data={mockNodeData}
        position={{ x: 0, y: 0 }}
        selected={false}
        dragging={false}
        isConnectable={true}
        zIndex={1}
      />
    )
    expect(screen.getByText(/Summer Sale 202/)).toBeDefined()
  })

  it('should apply selected styling when selected is true', () => {
    const { container } = renderWithProvider(
      <TrafficSourceNode
        id="test-node"
        type="pageNode"
        data={mockNodeData}
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

  it('should render with facebook_ads colors', () => {
    const { container } = renderWithProvider(
      <TrafficSourceNode
        id="test-node"
        type="pageNode"
        data={mockNodeData}
        position={{ x: 0, y: 0 }}
        selected={false}
        dragging={false}
        isConnectable={true}
        zIndex={1}
      />
    )
    const node = container.firstChild as HTMLElement
    expect(node.style.backgroundColor).toContain('rgb(231, 243, 255)')
  })
})
