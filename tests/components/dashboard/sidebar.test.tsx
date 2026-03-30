import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Sidebar from '@/components/dashboard/sidebar'
import { useUIStore } from '@/lib/store/ui-store'

describe('Sidebar', () => {
  beforeEach(() => {
    useUIStore.setState({ isSidebarCollapsed: false })
  })

  it('renders in expanded state by default', () => {
    render(<Sidebar />)
    expect(screen.getByText('Platform')).toBeDefined()
    expect(screen.getByText('Dashboard')).toBeDefined()
    expect(screen.getByText('Funnels')).toBeDefined()
  })

  it('collapses when toggle button is clicked', () => {
    render(<Sidebar />)
    const toggleButton = screen.getByLabelText(/collapse/i)
    fireEvent.click(toggleButton)
    
    expect(screen.queryByText('Platform')).toBeNull()
    expect(screen.queryByText('Dashboard')).toBeNull()
  })

  it('persists collapsed state to store', () => {
    render(<Sidebar />)
    const toggleButton = screen.getByLabelText(/collapse/i)
    fireEvent.click(toggleButton)
    
    const state = useUIStore.getState()
    expect(state.isSidebarCollapsed).toBe(true)
  })

  it('loads collapsed state from store on mount', () => {
    useUIStore.setState({ isSidebarCollapsed: true })
    render(<Sidebar />)
    
    expect(screen.queryByText('Dashboard')).toBeNull()
  })
})
