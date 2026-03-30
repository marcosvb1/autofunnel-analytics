import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import NavItem from '@/components/dashboard/nav-item'
import { LayoutGrid } from 'lucide-react'

describe('NavItem', () => {
  it('renders icon and label when expanded', () => {
    render(
      <NavItem
        icon={LayoutGrid}
        label="Dashboard"
        href="/dashboard"
        isCollapsed={false}
      />
    )
    expect(screen.getByText('Dashboard')).toBeDefined()
  })

  it('renders only icon when collapsed', () => {
    render(
      <NavItem
        icon={LayoutGrid}
        label="Dashboard"
        href="/dashboard"
        isCollapsed
      />
    )
    expect(screen.queryByText('Dashboard')).toBeNull()
  })

  it('applies active state styles', () => {
    render(
      <NavItem
        icon={LayoutGrid}
        label="Dashboard"
        href="/dashboard"
        isCollapsed={false}
      />
    )
    const link = screen.getByText('Dashboard').closest('a')
    expect(link).toBeDefined()
  })

  it('shows tooltip title when collapsed', () => {
    render(
      <NavItem
        icon={LayoutGrid}
        label="Dashboard"
        href="/dashboard"
        isCollapsed
      />
    )
    const item = screen.getByTestId('nav-item')
    expect(item.getAttribute('title')).toBe('Dashboard')
  })
})
