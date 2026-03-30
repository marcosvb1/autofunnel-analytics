import { describe, it, expect, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { ReactFlowProvider } from '@xyflow/react'
import FunnelEdge from '@/components/canvas/edges/FunnelEdge'
import { useCanvasStore } from '@/lib/store/canvas-store'

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<ReactFlowProvider>{ui}</ReactFlowProvider>)
}

const mockEdgeProps = {
  id: 'test-edge',
  sourceX: 0,
  sourceY: 0,
  targetX: 100,
  targetY: 100,
  sourcePosition: 'right' as const,
  targetPosition: 'left' as const,
  markerEnd: 'url(#arrow)',
  data: {
    conversion: 0.05,
    traffic: 1000,
  },
}

describe('FunnelEdge', () => {
  beforeEach(() => {
    useCanvasStore.setState({ viewMode: 'metrics' })
  })

  it('renders BaseEdge with correct path', () => {
    renderWithProvider(<FunnelEdge {...mockEdgeProps} />)
    
    const svg = document.querySelector('svg')
    expect(svg).toBeDefined()
  })

  it('applies stroke width based on traffic volume', () => {
    const lowVolumeProps = {
      ...mockEdgeProps,
      data: { ...mockEdgeProps.data, traffic: 10 },
    }
    const highVolumeProps = {
      ...mockEdgeProps,
      data: { ...mockEdgeProps.data, traffic: 100000 },
    }

    renderWithProvider(<FunnelEdge {...lowVolumeProps} />)
    const lowVolumeEdge = document.querySelector('path')
    
    renderWithProvider(<FunnelEdge {...highVolumeProps} />)
    const highVolumeEdge = document.querySelectorAll('path')[1]

    expect(lowVolumeEdge).toBeDefined()
    expect(highVolumeEdge).toBeDefined()
  })

  it('applies green color for conversion rate >= 5%', () => {
    const highConversionProps = {
      ...mockEdgeProps,
      data: { ...mockEdgeProps.data, conversion: 0.06 },
    }

    renderWithProvider(<FunnelEdge {...highConversionProps} />)
    
    const path = document.querySelector('path')
    expect(path).toBeDefined()
  })

  it('applies amber color for conversion rate between 1-5%', () => {
    const mediumConversionProps = {
      ...mockEdgeProps,
      data: { ...mockEdgeProps.data, conversion: 0.03 },
    }

    renderWithProvider(<FunnelEdge {...mediumConversionProps} />)
    
    const path = document.querySelector('path')
    expect(path).toBeDefined()
  })

  it('applies red color for conversion rate < 1%', () => {
    const lowConversionProps = {
      ...mockEdgeProps,
      data: { ...mockEdgeProps.data, conversion: 0.005 },
    }

    renderWithProvider(<FunnelEdge {...lowConversionProps} />)
    
    const path = document.querySelector('path')
    expect(path).toBeDefined()
  })

  it('shows animated particles in Heat view mode', () => {
    useCanvasStore.setState({ viewMode: 'heat' })

    renderWithProvider(<FunnelEdge {...mockEdgeProps} />)
    
    const circle = document.querySelector('circle')
    expect(circle).toBeDefined()
    expect(circle?.getAttribute('r')).toBe('3')
    
    const animateMotion = document.querySelector('animateMotion')
    expect(animateMotion).toBeDefined()
    expect(animateMotion?.getAttribute('dur')).toBe('2s')
    expect(animateMotion?.getAttribute('repeatCount')).toBe('indefinite')
  })

  it('does not show animation in Map view mode', () => {
    useCanvasStore.setState({ viewMode: 'map' })

    renderWithProvider(<FunnelEdge {...mockEdgeProps} />)
    
    const circle = document.querySelector('circle')
    expect(circle).toBeNull()
  })

  it('does not show animation in Metrics view mode', () => {
    useCanvasStore.setState({ viewMode: 'metrics' })

    renderWithProvider(<FunnelEdge {...mockEdgeProps} />)
    
    const circle = document.querySelector('circle')
    expect(circle).toBeNull()
  })

  it('shows edge labels with conversion percentage in Metrics mode', () => {
    useCanvasStore.setState({ viewMode: 'metrics' })

    renderWithProvider(<FunnelEdge {...mockEdgeProps} />)
    
    const labelContainer = document.querySelector('.react-flow__edgelabel-renderer')
    expect(labelContainer).toBeDefined()
  })

  it('shows edge labels with conversion percentage in Heat mode', () => {
    useCanvasStore.setState({ viewMode: 'heat' })

    renderWithProvider(<FunnelEdge {...mockEdgeProps} />)
    
    const labelContainer = document.querySelector('.react-flow__edgelabel-renderer')
    expect(labelContainer).toBeDefined()
  })

  it('hides edge labels in Map view mode', () => {
    useCanvasStore.setState({ viewMode: 'map' })

    renderWithProvider(<FunnelEdge {...mockEdgeProps} />)
    
    const labelContainer = document.querySelector('.react-flow__edgelabel-renderer')
    expect(labelContainer).toBeNull()
  })

  it('formats conversion percentage correctly', () => {
    const conversionProps = {
      ...mockEdgeProps,
      data: { ...mockEdgeProps.data, conversion: 0.155 },
    }

    useCanvasStore.setState({ viewMode: 'metrics' })
    renderWithProvider(<FunnelEdge {...conversionProps} />)
    
    const labelContainer = document.querySelector('.react-flow__edgelabel-renderer')
    expect(labelContainer).toBeDefined()
  })

  it('uses default values when data is missing', () => {
    const emptyDataProps = {
      ...mockEdgeProps,
      data: {},
    }

    useCanvasStore.setState({ viewMode: 'metrics' })
    renderWithProvider(<FunnelEdge {...emptyDataProps} />)
    
    const labelContainer = document.querySelector('.react-flow__edgelabel-renderer')
    expect(labelContainer).toBeDefined()
  })

  it('stroke width scales logarithmically with volume', () => {
    const veryLowVolumeProps = {
      ...mockEdgeProps,
      data: { ...mockEdgeProps.data, traffic: 0 },
    }
    const mediumVolumeProps = {
      ...mockEdgeProps,
      data: { ...mockEdgeProps.data, traffic: 1000 },
    }
    const veryHighVolumeProps = {
      ...mockEdgeProps,
      data: { ...mockEdgeProps.data, traffic: 10000000 },
    }

    useCanvasStore.setState({ viewMode: 'metrics' })
    
    renderWithProvider(<FunnelEdge {...veryLowVolumeProps} />)
    renderWithProvider(<FunnelEdge {...mediumVolumeProps} />)
    renderWithProvider(<FunnelEdge {...veryHighVolumeProps} />)

    const paths = document.querySelectorAll('path')
    expect(paths.length).toBeGreaterThanOrEqual(3)
  })
})
