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

  describe('progressive disclosure', () => {
    it('renders compact view with label, volume, and spend by default', () => {
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
      expect(screen.getByText('5.4K')).toBeDefined()
      expect(screen.getByText('$12.5K')).toBeDefined()
    })

    it('shows campaign badge when campaign exists in compact view', () => {
      const dataWithCampaign: PageNodeData = {
        ...mockData,
        campaign: 'Summer Sale 2024',
      }

      renderWithProvider(
        <PageNode
          id="test-node"
          type="pageNode"
          data={dataWithCampaign}
          position={{ x: 0, y: 0 }}
          selected={false}
          dragging={false}
          isConnectable={true}
          zIndex={1}
        />
      )

      expect(screen.getByText('Summer...')).toBeDefined()
    })

    it('does not show campaign badge when campaign is not provided', () => {
      const dataWithoutCampaign: PageNodeData = {
        ...mockData,
        campaign: undefined,
      }

      renderWithProvider(
        <PageNode
          id="test-node"
          type="pageNode"
          data={dataWithoutCampaign}
          position={{ x: 0, y: 0 }}
          selected={false}
          dragging={false}
          isConnectable={true}
          zIndex={1}
        />
      )

      const badge = screen.queryByText(/Sale/)
      expect(badge).toBeNull()
    })

    it('expands node when clicked', () => {
      const setExpandedNode = vi.fn()
      vi.mocked(useCanvasStore).mockReturnValue({
        expandedNodeId: null,
        setExpandedNode,
      } as any)

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

      const node = screen.getByText('Test Landing Page').closest('div[class*="bg-white"]')
      fireEvent.click(node!)

      expect(setExpandedNode).toHaveBeenCalledWith('test-node')
    })

    it('renders expanded view with all metrics when expanded', () => {
      vi.mocked(useCanvasStore).mockReturnValue({
        expandedNodeId: 'test-node',
        setExpandedNode: vi.fn(),
      } as any)

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
      expect(screen.getByText('5.4K')).toBeDefined()
      expect(screen.getByText('$12.5K')).toBeDefined()
      expect(screen.getByText('15.5%')).toBeDefined()
      expect(screen.getByText('$28.8K')).toBeDefined()
      expect(screen.getByText('2.3x')).toBeDefined()
      expect(screen.getByText('/landing-page')).toBeDefined()
    })

    it('shows action buttons in expanded view', () => {
      vi.mocked(useCanvasStore).mockReturnValue({
        expandedNodeId: 'test-node',
        setExpandedNode: vi.fn(),
      } as any)

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

      expect(screen.getByText('Details')).toBeDefined()
      expect(screen.getByText('Edit')).toBeDefined()
    })

    it('collapses node when clicked while expanded', () => {
      const setExpandedNode = vi.fn()
      vi.mocked(useCanvasStore).mockReturnValue({
        expandedNodeId: 'test-node',
        setExpandedNode,
      } as any)

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

      const node = screen.getByText('Test Landing Page').closest('div[class*="bg-white"]')
      fireEvent.click(node!)

      expect(setExpandedNode).toHaveBeenCalledWith(null)
    })

    it('shows ROI in green when ROI >= 1', () => {
      vi.mocked(useCanvasStore).mockReturnValue({
        expandedNodeId: 'test-node',
        setExpandedNode: vi.fn(),
      } as any)

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

      const roiElement = screen.getByText('2.3x')
      expect(roiElement.classList.contains('text-green-600')).toBe(true)
    })

    it('shows ROI in red when ROI < 1', () => {
      const lowRoiData: PageNodeData = {
        ...mockData,
        roi: 0.5,
      }

      vi.mocked(useCanvasStore).mockReturnValue({
        expandedNodeId: 'test-node',
        setExpandedNode: vi.fn(),
      } as any)

      renderWithProvider(
        <PageNode
          id="test-node"
          type="pageNode"
          data={lowRoiData}
          position={{ x: 0, y: 0 }}
          selected={false}
          dragging={false}
          isConnectable={true}
          zIndex={1}
        />
      )

      const roiElement = screen.getByText('0.5x')
      expect(roiElement.classList.contains('text-red-600')).toBe(true)
    })

    it('shows conversion in green when conversion >= 30', () => {
      const highConvData: PageNodeData = {
        ...mockData,
        conversion: 35.2,
      }

      vi.mocked(useCanvasStore).mockReturnValue({
        expandedNodeId: 'test-node',
        setExpandedNode: vi.fn(),
      } as any)

      renderWithProvider(
        <PageNode
          id="test-node"
          type="pageNode"
          data={highConvData}
          position={{ x: 0, y: 0 }}
          selected={false}
          dragging={false}
          isConnectable={true}
          zIndex={1}
        />
      )

      const conversionElement = screen.getByText('35.2%')
      expect(conversionElement.classList.contains('text-green-600')).toBe(true)
    })

    it('shows conversion in yellow when conversion >= 15 and < 30', () => {
      vi.mocked(useCanvasStore).mockReturnValue({
        expandedNodeId: 'test-node',
        setExpandedNode: vi.fn(),
      } as any)

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

      const conversionElement = screen.getByText('15.5%')
      expect(conversionElement.classList.contains('text-yellow-600')).toBe(true)
    })

    it('shows conversion in red when conversion < 15', () => {
      const lowConvData: PageNodeData = {
        ...mockData,
        conversion: 8.5,
      }

      vi.mocked(useCanvasStore).mockReturnValue({
        expandedNodeId: 'test-node',
        setExpandedNode: vi.fn(),
      } as any)

      renderWithProvider(
        <PageNode
          id="test-node"
          type="pageNode"
          data={lowConvData}
          position={{ x: 0, y: 0 }}
          selected={false}
          dragging={false}
          isConnectable={true}
          zIndex={1}
        />
      )

      const conversionElement = screen.getByText('8.5%')
      expect(conversionElement.classList.contains('text-red-600')).toBe(true)
    })
  })

  describe('progressive disclosure', () => {
    it('renders compact view with label, volume, and spend by default', () => {
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
      expect(screen.getByText('5.4K')).toBeDefined()
      expect(screen.getByText('$12.5K')).toBeDefined()
    })

    it('shows campaign badge when campaign exists in compact view', () => {
      const dataWithCampaign: PageNodeData = {
        ...mockData,
        campaign: 'Summer Sale 2024',
      }

      renderWithProvider(
        <PageNode
          id="test-node"
          type="pageNode"
          data={dataWithCampaign}
          position={{ x: 0, y: 0 }}
          selected={false}
          dragging={false}
          isConnectable={true}
          zIndex={1}
        />
      )

      expect(screen.getByText('Summer...')).toBeDefined()
    })

    it('does not show campaign badge when campaign is not provided', () => {
      const dataWithoutCampaign: PageNodeData = {
        ...mockData,
        campaign: undefined,
      }

      renderWithProvider(
        <PageNode
          id="test-node"
          type="pageNode"
          data={dataWithoutCampaign}
          position={{ x: 0, y: 0 }}
          selected={false}
          dragging={false}
          isConnectable={true}
          zIndex={1}
        />
      )

      const badge = screen.queryByText(/Sale/)
      expect(badge).toBeNull()
    })

    it('expands node when clicked', () => {
      const setExpandedNode = vi.fn()
      vi.mocked(useCanvasStore).mockReturnValue({
        expandedNodeId: null,
        setExpandedNode,
      } as any)

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

      const node = screen.getByText('Test Landing Page').closest('div[class*="bg-white"]')
      fireEvent.click(node!)

      expect(setExpandedNode).toHaveBeenCalledWith('test-node')
    })

    it('renders expanded view with all metrics when expanded', () => {
      vi.mocked(useCanvasStore).mockReturnValue({
        expandedNodeId: 'test-node',
        setExpandedNode: vi.fn(),
      } as any)

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
      expect(screen.getByText('5.4K')).toBeDefined()
      expect(screen.getByText('$12.5K')).toBeDefined()
      expect(screen.getByText('15.5%')).toBeDefined()
      expect(screen.getByText('$28.8K')).toBeDefined()
      expect(screen.getByText('2.3x')).toBeDefined()
      expect(screen.getByText('/landing-page')).toBeDefined()
    })

    it('shows action buttons in expanded view', () => {
      vi.mocked(useCanvasStore).mockReturnValue({
        expandedNodeId: 'test-node',
        setExpandedNode: vi.fn(),
      } as any)

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

      expect(screen.getByText('Details')).toBeDefined()
      expect(screen.getByText('Edit')).toBeDefined()
    })

    it('collapses node when clicked while expanded', () => {
      const setExpandedNode = vi.fn()
      vi.mocked(useCanvasStore).mockReturnValue({
        expandedNodeId: 'test-node',
        setExpandedNode,
      } as any)

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

      const node = screen.getByText('Test Landing Page').closest('div[class*="bg-white"]')
      fireEvent.click(node!)

      expect(setExpandedNode).toHaveBeenCalledWith(null)
    })

    it('shows ROI in green when ROI >= 1', () => {
      vi.mocked(useCanvasStore).mockReturnValue({
        expandedNodeId: 'test-node',
        setExpandedNode: vi.fn(),
      } as any)

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

      const roiElement = screen.getByText('2.3x')
      expect(roiElement.classList.contains('text-green-600')).toBe(true)
    })

    it('shows ROI in red when ROI < 1', () => {
      const lowRoiData: PageNodeData = {
        ...mockData,
        roi: 0.5,
      }

      vi.mocked(useCanvasStore).mockReturnValue({
        expandedNodeId: 'test-node',
        setExpandedNode: vi.fn(),
      } as any)

      renderWithProvider(
        <PageNode
          id="test-node"
          type="pageNode"
          data={lowRoiData}
          position={{ x: 0, y: 0 }}
          selected={false}
          dragging={false}
          isConnectable={true}
          zIndex={1}
        />
      )

      const roiElement = screen.getByText('0.5x')
      expect(roiElement.classList.contains('text-red-600')).toBe(true)
    })

    it('shows conversion in green when conversion >= 30', () => {
      const highConvData: PageNodeData = {
        ...mockData,
        conversion: 35.2,
      }

      vi.mocked(useCanvasStore).mockReturnValue({
        expandedNodeId: 'test-node',
        setExpandedNode: vi.fn(),
      } as any)

      renderWithProvider(
        <PageNode
          id="test-node"
          type="pageNode"
          data={highConvData}
          position={{ x: 0, y: 0 }}
          selected={false}
          dragging={false}
          isConnectable={true}
          zIndex={1}
        />
      )

      const conversionElement = screen.getByText('35.2%')
      expect(conversionElement.classList.contains('text-green-600')).toBe(true)
    })

    it('shows conversion in yellow when conversion >= 15 and < 30', () => {
      vi.mocked(useCanvasStore).mockReturnValue({
        expandedNodeId: 'test-node',
        setExpandedNode: vi.fn(),
      } as any)

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

      const conversionElement = screen.getByText('15.5%')
      expect(conversionElement.classList.contains('text-yellow-600')).toBe(true)
    })

    it('shows conversion in red when conversion < 15', () => {
      const lowConvData: PageNodeData = {
        ...mockData,
        conversion: 8.5,
      }

      vi.mocked(useCanvasStore).mockReturnValue({
        expandedNodeId: 'test-node',
        setExpandedNode: vi.fn(),
      } as any)

      renderWithProvider(
        <PageNode
          id="test-node"
          type="pageNode"
          data={lowConvData}
          position={{ x: 0, y: 0 }}
          selected={false}
          dragging={false}
          isConnectable={true}
          zIndex={1}
        />
      )

      const conversionElement = screen.getByText('8.5%')
      expect(conversionElement.classList.contains('text-red-600')).toBe(true)
    })
  })
})
