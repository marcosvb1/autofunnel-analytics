import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CanvasControls } from '@/components/canvas/canvas-controls'
import type { ViewMode } from '@/types/canvas'

describe('CanvasControls', () => {
  const mockOnViewModeChange = vi.fn<(mode: ViewMode) => void>()

  const renderComponent = () => {
    return render(
      <CanvasControls
        onAddNode={vi.fn()}
        onAutoLayout={vi.fn()}
        onResetZoom={vi.fn()}
        onExport={vi.fn()}
        onViewModeChange={mockOnViewModeChange}
      />
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render all 3 view mode buttons', () => {
    renderComponent()

    expect(screen.getByText('Map')).toBeDefined()
    expect(screen.getByText('Metrics')).toBeDefined()
    expect(screen.getByText('Heat')).toBeDefined()
  })

  it('should render all 3 icons', () => {
    renderComponent()

    const mapIcon = document.querySelector('svg[title="Map"]') || document.querySelectorAll('svg')[0]
    const metricsIcon = document.querySelectorAll('svg')[1]
    const heatIcon = document.querySelectorAll('svg')[2]

    expect(mapIcon).toBeDefined()
    expect(metricsIcon).toBeDefined()
    expect(heatIcon).toBeDefined()
  })

  it('should call onViewModeChange with "map" when Map button is clicked', () => {
    renderComponent()

    const mapButton = screen.getByText('Map').closest('button')
    mapButton?.click()

    expect(mockOnViewModeChange).toHaveBeenCalledWith('map')
    expect(mockOnViewModeChange).toHaveBeenCalledTimes(1)
  })

  it('should call onViewModeChange with "metrics" when Metrics button is clicked', () => {
    renderComponent()

    const metricsButton = screen.getByText('Metrics').closest('button')
    metricsButton?.click()

    expect(mockOnViewModeChange).toHaveBeenCalledWith('metrics')
    expect(mockOnViewModeChange).toHaveBeenCalledTimes(1)
  })

  it('should call onViewModeChange with "heat" when Heat button is clicked', () => {
    renderComponent()

    const heatButton = screen.getByText('Heat').closest('button')
    heatButton?.click()

    expect(mockOnViewModeChange).toHaveBeenCalledWith('heat')
    expect(mockOnViewModeChange).toHaveBeenCalledTimes(1)
  })

  it('should have correct titles on buttons', () => {
    renderComponent()

    const buttons = screen.getAllByRole('button')
    const mapButton = buttons.find((btn) => btn.textContent?.includes('Map'))
    const metricsButton = buttons.find((btn) => btn.textContent?.includes('Metrics'))
    const heatButton = buttons.find((btn) => btn.textContent?.includes('Heat'))

    expect(mapButton?.getAttribute('title')).toBe('Map View')
    expect(metricsButton?.getAttribute('title')).toBe('Metrics View')
    expect(heatButton?.getAttribute('title')).toBe('Heat View')
  })
})
