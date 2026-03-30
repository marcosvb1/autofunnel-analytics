import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

describe('Avatar', () => {
  it('renders fallback with initials', () => {
    render(
      <Avatar>
        <AvatarFallback>VB</AvatarFallback>
      </Avatar>
    )
    expect(screen.getByText('VB')).toBeDefined()
  })

  it('applies custom className', () => {
    const { container } = render(
      <Avatar className="h-12 w-12">
        <AvatarFallback>VB</AvatarFallback>
      </Avatar>
    )
    expect(container.firstChild).toHaveClass('h-12 w-12')
  })
})
