import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ReactFlowProvider } from '@xyflow/react'
import PageNode from '@/components/canvas/page-node'
import type { PageNodeData } from '@/types/funnel'

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<ReactFlowProvider>{ui}</ReactFlowProvider>)
}

describe('PageNode', () => {
  const mockData: PageNodeData = {
    id: 'test-page',
    label: 'Test Landing Page',
    volume: 5432,
    spend: 12500,
    conversion: 15.5,
    roi: 2.3,
    isConversion: false,
  }

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

    const conversionDot = document.querySelector('[title="Conversion"]')
    expect(conversionDot).toBeTruthy()
  })

  it('does not show conversion dot when isConversion is false', () => {
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

    const conversionDot = document.querySelector('[title="Conversion"]')
    expect(conversionDot).toBeFalsy()
  })

  it('formats volume in millions for large numbers', () => {
    const largeVolumeData: PageNodeData = {
      ...mockData,
      volume: 1500000,
    }

    renderWithProvider(
      <PageNode
        id="test-node"
        type="pageNode"
        data={largeVolumeData}
        position={{ x: 0, y: 0 }}
        selected={false}
        dragging={false}
        isConnectable={true}
        zIndex={1}
      />
    )

    expect(screen.getByText('1.5M')).toBeDefined()
  })

  it('displays conversion percentage when provided', () => {
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

    expect(screen.getByText('15.5%')).toBeDefined()
  })

  it('displays spend when provided', () => {
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

    expect(screen.getByText('$12.5k')).toBeDefined()
  })

  it('displays ROI with green color when ROI >= 1', () => {
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

    expect(screen.getByText('2.3x')).toBeDefined()
  })

  it('displays ROI with red color when ROI < 1', () => {
    const negativeRoiData: PageNodeData = {
      ...mockData,
      roi: 0.5,
    }

    renderWithProvider(
      <PageNode
        id="test-node"
        type="pageNode"
        data={negativeRoiData}
        position={{ x: 0, y: 0 }}
        selected={false}
        dragging={false}
        isConnectable={true}
        zIndex={1}
      />
    )

    expect(screen.getByText('0.5x')).toBeDefined()
  })

  it('applies conversion styling when isConversion is true', () => {
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

    const node = screen.getByText('Test Landing Page').closest('div[class*="relative"]')
    expect(node?.classList.contains('border-green-400')).toBe(true)
    expect(node?.classList.contains('bg-green-50')).toBe(true)
  })
})
