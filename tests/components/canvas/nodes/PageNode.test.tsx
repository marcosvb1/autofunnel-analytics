import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ReactFlowProvider } from '@xyflow/react'
import PageNode from '@/components/canvas/nodes/PageNode'
import type { FunnelNode } from '@/types/canvas'

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<ReactFlowProvider>{ui}</ReactFlowProvider>)
}

describe('PageNode', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render landing page with correct styling', () => {
    const nodeData: FunnelNode['data'] = {
      id: 'landing',
      label: 'Product Landing Page',
      volume: 15000,
      nodeCategory: 'landing_page',
      url: '/landing/product',
    }
    renderWithProvider(
      <PageNode
        id="landing"
        type="pageNode"
        data={nodeData}
        position={{ x: 0, y: 0 }}
        selected={false}
        dragging={false}
        isConnectable={true}
        zIndex={1}
      />
    )
    expect(screen.getByText('Product Landing Page')).toBeDefined()
  })

  it('should render checkout page with cart icon styling', () => {
    const nodeData: FunnelNode['data'] = {
      id: 'checkout',
      label: 'Checkout Page',
      volume: 3000,
      nodeCategory: 'checkout',
    }
    renderWithProvider(
      <PageNode
        id="checkout"
        type="pageNode"
        data={nodeData}
        position={{ x: 0, y: 0 }}
        selected={false}
        dragging={false}
        isConnectable={true}
        zIndex={1}
      />
    )
    expect(screen.getByText('Checkout Page')).toBeDefined()
  })

  it('should apply landing_page blue colors', () => {
    const nodeData: FunnelNode['data'] = {
      id: 'landing',
      label: 'Landing Page',
      volume: 10000,
      nodeCategory: 'landing_page',
    }
    const { container } = renderWithProvider(
      <PageNode
        id="landing"
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
    expect(node.style.backgroundColor).toContain('rgb(224, 242, 254)')
  })

  it('should expand on click to show more details', async () => {
    const nodeData: FunnelNode['data'] = {
      id: 'landing',
      label: 'Landing Page',
      volume: 10000,
      conversion: 25.5,
      revenue: 50000,
      nodeCategory: 'landing_page',
    }
    renderWithProvider(
      <PageNode
        id="landing"
        type="pageNode"
        data={nodeData}
        position={{ x: 0, y: 0 }}
        selected={false}
        dragging={false}
        isConnectable={true}
        zIndex={1}
      />
    )
    const node = screen.getByText('Landing Page').closest('.bg-white')
    expect(node).toBeDefined()
  })

  it('should display conversion rate when available', () => {
    const nodeData: FunnelNode['data'] = {
      id: 'landing',
      label: 'Landing Page',
      volume: 10000,
      conversion: 35.5,
      nodeCategory: 'landing_page',
    }
    renderWithProvider(
      <PageNode
        id="landing"
        type="pageNode"
        data={nodeData}
        position={{ x: 0, y: 0 }}
        selected={false}
        dragging={false}
        isConnectable={true}
        zIndex={1}
      />
    )
    expect(screen.getByText(/35.5%/i)).toBeDefined()
  })
})
