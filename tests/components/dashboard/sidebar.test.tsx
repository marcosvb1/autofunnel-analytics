import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Sidebar from '@/components/dashboard/sidebar'

describe('Sidebar', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders in expanded state by default', () => {
    render(<Sidebar />)
    expect(screen.getByText('Platform')).toBeDefined()
    expect(screen.getByText('Dashboard')).toBeDefined()
    expect(screen.getByText('Funnels')).toBeDefined()
  })

  it('collapses when toggle button is clicked', () => {
    render(<Sidebar />)
    const toggleButton = screen.getByRole('button', { name: /collapse/i })
    fireEvent.click(toggleButton)
    
    expect(screen.queryByText('Platform')).toBeNull()
    expect(screen.queryByText('Dashboard')).toBeNull()
  })

  it('persists collapsed state to localStorage', () => {
    render(<Sidebar />)
    const toggleButton = screen.getByRole('button', { name: /collapse/i })
    fireEvent.click(toggleButton)
    
    const saved = localStorage.getItem('autofunnel-sidebar-collapsed')
    expect(saved).toBe('true')
  })

  it('loads collapsed state from localStorage on mount', () => {
    localStorage.setItem('autofunnel-sidebar-collapsed', 'true')
    render(<Sidebar />)
    
    expect(screen.queryByText('Dashboard')).toBeNull()
  })
})
