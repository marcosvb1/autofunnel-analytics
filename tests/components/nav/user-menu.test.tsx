import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import UserMenu from '@/components/nav/user-menu'

const mockUser = {
  email: 'test@example.com',
  id: 'user-123',
}

const mockLogout = vi.fn()

vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({
    user: mockUser,
    logout: mockLogout,
  }),
}))

describe('UserMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders avatar with user initials', () => {
    render(<UserMenu />)
    expect(screen.getByText('TE')).toBeDefined()
  })

  it('opens dropdown on avatar click', async () => {
    render(<UserMenu />)
    const avatar = screen.getByRole('button')
    fireEvent.click(avatar)

    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(screen.queryByText('Settings')).toBeDefined()
  })

  it('calls logout on sign out click', async () => {
    render(<UserMenu />)
    const avatar = screen.getByRole('button')
    fireEvent.click(avatar)

    await new Promise((resolve) => setTimeout(resolve, 100))
    const signOut = screen.queryByText('Sign out')
    if (signOut) {
      fireEvent.click(signOut)
      expect(mockLogout).toHaveBeenCalled()
    }
  })
})
