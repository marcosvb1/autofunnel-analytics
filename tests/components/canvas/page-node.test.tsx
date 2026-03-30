import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ReactFlowProvider } from '@xyflow/react'
import PageNode from '@/components/canvas/nodes/PageNode'
import type { PageNodeData } from '@/types/funnel'
import { useCanvasStore } from '@/lib/store/canvas-store'

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<ReactFlowProvider>{ui}</ReactFlowProvider>)
}

vi.mock('@/lib/store/canvas-store', () => ({
  useCanvasStore: vi.fn(),
}))

describe('PageNode', () => {
  const mockData: PageNodeData = {
    id: 'test-page',
    label: 'Test Landing Page',
    volume: 5432,
    spend: 12500,
    conversion: 15.5,
    roi: 2.3,
    revenue: 28750,
    isConversion: false,
    url: '/landing-page',
  }

  beforeEach(() => {
    vi.mocked(useCanvasStore).mockReturnValue({
      expandedNodeId: null,
      setExpandedNode: vi.fn(),
    } as any)
  })

  it('renders the label', () => {
    renderWithProvider(
      <PageNode
        id="test-node"
        type="pageNode"
        data={mockData}
        position={{ x: 0, y: 0 }}
        selected={false}
        dragging={false}
        isConnectable={true}
        zIndex={1}
      />
    )

    expect(screen.getByText('Test Landing Page')).toBeDefined()
  })

  it('displays volume with formatting', () => {
    renderWithProvider(
      <PageNode
        id="test-node"
        type="pageNode"
        data={mockData}
        position={{ x: 0, y: 0 }}
        selected={false}
        dragging={false}
        isConnectable={true}
        zIndex={1}
      />
    )

    expect(screen.getByText('5.4k')).toBeDefined()
  })

  it('applies selected styling when selected', () => {
    renderWithProvider(
      <PageNode
        id="test-node"
        type="pageNode"
        data={mockData}
        position={{ x: 0, y: 0 }}
        selected={true}
        dragging={false}
        isConnectable={true}
        zIndex={1}
      />
    )

    const node = screen.getByText('Test Landing Page').closest('div[class*="relative"]')
    expect(node?.classList.contains('ring-2')).toBe(true)
  })

  it('shows conversion dot when isConversion is true', () => {
    const conversionData: PageNodeData = {
      ...mockData,
      isConversion: true,
    }

    renderWithProvider(
      <PageNode
        id="test-node"
        type="pageNode"
        data={conversionData}
        position={{ x: 0, y: 0 }}
        selected={false}
        dragging={false}
        isConnectable={true}
        zIndex={1}
      />
    )

    expect(screen.getByText('Test Landing Page')).toBeDefined()
  })
})
