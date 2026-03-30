# Dashboard UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the dashboard navigation system with a collapsible sidebar, modern navbar with user dropdown, and consistent micro-interactions across the app.

**Architecture:** Hybrid approach (Option 3) - minimalist design with essential features. Collapsible sidebar (240px → 64px) with glassmorphism, navbar with avatar dropdown, and refined micro-interactions using Radix UI primitives.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Radix UI (Avatar, Dropdown Menu), lucide-react icons, class-variance-authority.

---

## File Structure

### Files to Create
- `src/components/ui/avatar.tsx` - Avatar component with Radix primitive
- `src/components/ui/dropdown-menu.tsx` - Dropdown menu component with Radix primitive
- `src/components/dashboard/nav-item.tsx` - Reusable navigation item component
- `src/components/nav/user-menu.tsx` - User profile dropdown menu

### Files to Modify
- `src/components/dashboard/sidebar.tsx:1-37` - Complete refactor with collapse functionality
- `src/components/nav/navbar.tsx:1-41` - Refactor with avatar and dropdown
- `src/components/ui/button.tsx:1-52` - Update variants with micro-interactions
- `src/components/ui/card.tsx:1-90` - Update variants with hover animations
- `src/app/dashboard/layout.tsx:1-18` - Update layout structure for fixed positioning
- `package.json` - Add Radix UI dependencies

---

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install Radix UI packages**

Run:
```bash
npm install @radix-ui/react-avatar @radix-ui/react-dropdown-menu
```

Expected output:
```
added 15 packages, and audited 584 packages in 8s
```

- [ ] **Step 2: Verify installation**

Run:
```bash
npm list @radix-ui/react-avatar @radix-ui/react-dropdown-menu
```

Expected output:
```
autofunnel-analytics@0.1.0
├── @radix-ui/react-avatar@1.x.x
└── @radix-ui/react-dropdown-menu@2.x.x
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add radix-ui avatar and dropdown-menu dependencies"
```

---

### Task 2: Create Avatar Component

**Files:**
- Create: `src/components/ui/avatar.tsx`
- Test: `tests/components/ui/avatar.test.tsx`

- [ ] **Step 1: Write Avatar component tests**

Create `tests/components/ui/avatar.test.tsx`:

```tsx
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
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
npm run test:run -- tests/components/ui/avatar.test.tsx
```

Expected: FAIL with "Cannot find module '@/components/ui/avatar'"

- [ ] **Step 3: Create Avatar component**

Create `src/components/ui/avatar.tsx`:

```tsx
import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cn } from '@/lib/utils/helpers'

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full', className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm font-medium',
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
```

- [ ] **Step 4: Run test to verify it passes**

Run:
```bash
npm run test:run -- tests/components/ui/avatar.test.tsx
```

Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/avatar.tsx tests/components/ui/avatar.test.tsx
git commit -m "feat(ui): add Avatar component with Radix primitive"
```

---

### Task 3: Create Dropdown Menu Component

**Files:**
- Create: `src/components/ui/dropdown-menu.tsx`
- Test: `tests/components/ui/dropdown-menu.test.tsx`

- [ ] **Step 1: Write Dropdown Menu tests**

Create `tests/components/ui/dropdown-menu.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

describe('DropdownMenu', () => {
  it('opens on click and shows items', async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuItem>Item 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    const trigger = screen.getByText('Open')
    fireEvent.click(trigger)

    expect(await screen.findByText('Item 1')).toBeDefined()
    expect(screen.getByText('Item 2')).toBeDefined()
  })

  it('renders separator', async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Item 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    const trigger = screen.getByText('Open')
    fireEvent.click(trigger)

    const separator = await screen.findByRole('separator')
    expect(separator).toBeDefined()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
npm run test:run -- tests/components/ui/dropdown-menu.test.tsx
```

Expected: FAIL with "Cannot find module '@/components/ui/dropdown-menu'"

- [ ] **Step 3: Create Dropdown Menu component**

Create `src/components/ui/dropdown-menu.tsx`:

```tsx
import * as React from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { cn } from '@/lib/utils/helpers'

const DropdownMenu = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 text-text-primary shadow-md animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-gray-200', className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      'px-2 py-1.5 text-sm font-medium',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:
```bash
npm run test:run -- tests/components/ui/dropdown-menu.test.tsx
```

Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/dropdown-menu.tsx tests/components/ui/dropdown-menu.test.tsx
git commit -m "feat(ui): add DropdownMenu component with Radix primitive"
```

---

### Task 4: Create NavItem Component

**Files:**
- Create: `src/components/dashboard/nav-item.tsx`
- Test: `tests/components/dashboard/nav-item.test.tsx`

- [ ] **Step 1: Write NavItem tests**

Create `tests/components/dashboard/nav-item.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import NavItem from '@/components/dashboard/nav-item'
import { LayoutGrid } from 'lucide-react'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('NavItem', () => {
  it('renders icon and label when expanded', () => {
    render(
      <NavItem
        icon={LayoutGrid}
        label="Dashboard"
        href="/dashboard"
        isCollapsed={false}
        isActive={false}
      />,
      { wrapper }
    )
    expect(screen.getByText('Dashboard')).toBeDefined()
    expect(screen.getByTestId('nav-icon')).toBeDefined()
  })

  it('renders only icon when collapsed', () => {
    render(
      <NavItem
        icon={LayoutGrid}
        label="Dashboard"
        href="/dashboard"
        isCollapsed
        isActive={false}
      />,
      { wrapper }
    )
    expect(screen.queryByText('Dashboard')).toBeNull()
    expect(screen.getByTestId('nav-icon')).toBeDefined()
  })

  it('applies active state styles', () => {
    render(
      <NavItem
        icon={LayoutGrid}
        label="Dashboard"
        href="/dashboard"
        isCollapsed={false}
        isActive
      />,
      { wrapper }
    )
    const link = screen.getByText('Dashboard').closest('a')
    expect(link).toHaveClass('bg-blue-50', 'text-blue-600')
  })

  it('shows tooltip title when collapsed', () => {
    render(
      <NavItem
        icon={LayoutGrid}
        label="Dashboard"
        href="/dashboard"
        isCollapsed
        isActive={false}
      />,
      { wrapper }
    )
    const link = screen.getByTestId('nav-item')
    expect(link).toHaveAttribute('title', 'Dashboard')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
npm run test:run -- tests/components/dashboard/nav-item.test.tsx
```

Expected: FAIL with "Cannot find module '@/components/dashboard/nav-item'"

- [ ] **Step 3: Create NavItem component**

Create `src/components/dashboard/nav-item.tsx`:

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/helpers'
import type { LucideIcon } from 'lucide-react'

interface NavItemProps {
  icon: LucideIcon
  label: string
  href: string
  isCollapsed?: boolean
}

export default function NavItem({
  icon: Icon,
  label,
  href,
  isCollapsed = false,
}: NavItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      data-testid="nav-item"
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium',
        'transition-all duration-200 ease-out',
        isActive
          ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
          : 'text-gray-600 hover:bg-gray-100 hover:translate-x-1',
        isCollapsed && 'justify-center'
      )}
      title={isCollapsed ? label : undefined}
    >
      <Icon
        data-testid="nav-icon"
        className="h-5 w-5 flex-shrink-0"
        strokeWidth={1.5}
      />
      {!isCollapsed && (
        <span className="truncate">{label}</span>
      )}
    </Link>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:
```bash
npm run test:run -- tests/components/dashboard/nav-item.test.tsx
```

Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/dashboard/nav-item.tsx tests/components/dashboard/nav-item.test.tsx
git commit -m "feat(dashboard): add NavItem component for navigation"
```

---

### Task 5: Refactor Sidebar Component

**Files:**
- Modify: `src/components/dashboard/sidebar.tsx:1-37`
- Modify: `src/components/dashboard/sidebar.tsx` (complete rewrite)
- Test: `tests/components/dashboard/sidebar.test.tsx`

- [ ] **Step 1: Write Sidebar component tests**

Create `tests/components/dashboard/sidebar.test.tsx`:

```tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Sidebar from '@/components/dashboard/sidebar'
import { BrowserRouter } from 'react-router-dom'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('Sidebar', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders in expanded state by default', () => {
    render(<Sidebar />, { wrapper })
    expect(screen.getByText('Platform')).toBeDefined()
    expect(screen.getByText('Dashboard')).toBeDefined()
    expect(screen.getByText('Funnels')).toBeDefined()
  })

  it('collapses when toggle button is clicked', () => {
    render(<Sidebar />, { wrapper })
    const toggleButton = screen.getByRole('button', { name: /collapse/i })
    fireEvent.click(toggleButton)
    
    expect(screen.queryByText('Platform')).toBeNull()
    expect(screen.queryByText('Dashboard')).toBeNull()
  })

  it('persists collapsed state to localStorage', () => {
    render(<Sidebar />, { wrapper })
    const toggleButton = screen.getByRole('button', { name: /collapse/i })
    fireEvent.click(toggleButton)
    
    const saved = localStorage.getItem('autofunnel-sidebar-collapsed')
    expect(saved).toBe('true')
  })

  it('loads collapsed state from localStorage on mount', () => {
    localStorage.setItem('autofunnel-sidebar-collapsed', 'true')
    render(<Sidebar />, { wrapper })
    
    expect(screen.queryByText('Dashboard')).toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
npm run test:run -- tests/components/dashboard/sidebar.test.tsx
```

Expected: FAIL (current sidebar doesn't have collapse functionality)

- [ ] **Step 3: Refactor Sidebar component**

Replace `src/components/dashboard/sidebar.tsx`:

```tsx
'use client'

import { useState, useEffect } from 'react'
import NavItem from './nav-item'
import {
  LayoutGrid,
  Funnel,
  BarChart3,
  Plug,
  Settings,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

const SIDEBAR_COLLAPSED_KEY = 'autofunnel-sidebar-collapsed'

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY)
      return saved ? JSON.parse(saved) : false
    }
    return false
  })

  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, JSON.stringify(isCollapsed))
  }, [isCollapsed])

  const toggleSidebar = () => {
    setIsCollapsed((prev: boolean) => !prev)
  }

  return (
    <aside
      className={`
        fixed left-0 top-14 h-[calc(100vh-3.5rem)]
        bg-white/80 backdrop-blur-md border-r border-gray-200
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-16' : 'w-64'}
        z-40
      `}
    >
      {/* Brand Section */}
      <div className="h-14 flex items-center px-4 border-b border-gray-200">
        <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
          <span className="text-white text-xs font-bold">A</span>
        </div>
        {!isCollapsed && (
          <span className="ml-3 font-semibold text-gray-900">
            AutoFunnel
          </span>
        )}
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto mt-4">
        {/* Platform Section */}
        <div className="mb-6">
          {!isCollapsed && (
            <span className="text-xs font-medium text-gray-500 px-3 mb-2 block">
              Platform
            </span>
          )}
          <NavItem
            icon={LayoutGrid}
            label="Dashboard"
            href="/dashboard"
            isCollapsed={isCollapsed}
          />
          <NavItem
            icon={Funnel}
            label="Funnels"
            href="/dashboard/projects"
            isCollapsed={isCollapsed}
          />
          <NavItem
            icon={BarChart3}
            label="Analytics"
            href="/analytics"
            isCollapsed={isCollapsed}
          />
        </div>

        {/* Integrations Section */}
        <div className="mb-6">
          {!isCollapsed && (
            <span className="text-xs font-medium text-gray-500 px-3 mb-2 block">
              Integrations
            </span>
          )}
          <NavItem
            icon={Plug}
            label="Connections"
            href="/dashboard/projects"
            isCollapsed={isCollapsed}
          />
        </div>

        {/* Settings Section */}
        <div>
          {!isCollapsed && (
            <span className="text-xs font-medium text-gray-500 px-3 mb-2 block">
              Settings
            </span>
          )}
          <NavItem
            icon={Settings}
            label="Settings"
            href="/settings"
            isCollapsed={isCollapsed}
          />
        </div>
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={toggleSidebar}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute bottom-4 right-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
      >
        {isCollapsed ? (
          <ChevronsRight className="h-5 w-5 text-gray-600" />
        ) : (
          <ChevronsLeft className="h-5 w-5 text-gray-600" />
        )}
      </button>
    </aside>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:
```bash
npm run test:run -- tests/components/dashboard/sidebar.test.tsx
```

Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/dashboard/sidebar.tsx tests/components/dashboard/sidebar.test.tsx
git commit -m "feat(dashboard): refactor Sidebar with collapse functionality and navigation sections"
```

---

### Task 6: Create UserMenu Component

**Files:**
- Create: `src/components/nav/user-menu.tsx`
- Test: `tests/components/nav/user-menu.test.tsx`

- [ ] **Step 1: Write UserMenu tests**

Create `tests/components/nav/user-menu.test.tsx`:

```tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
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

    await waitFor(() => {
      expect(screen.getByText('Settings')).toBeDefined()
      expect(screen.getByText('Sign out')).toBeDefined()
    })
  })

  it('calls logout on sign out click', async () => {
    render(<UserMenu />)
    const avatar = screen.getByRole('button')
    fireEvent.click(avatar)

    const signOut = await screen.findByText('Sign out')
    fireEvent.click(signOut)

    expect(mockLogout).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
npm run test:run -- tests/components/nav/user-menu.test.tsx
```

Expected: FAIL with "Cannot find module '@/components/nav/user-menu'"

- [ ] **Step 3: Create UserMenu component**

Create `src/components/nav/user-menu.tsx`:

```tsx
'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Settings, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import Link from 'next/link'

function getInitials(email: string): string {
  const parts = email.split('@')[0].split('.')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return email.slice(0, 2).toUpperCase()
}

export default function UserMenu() {
  const { user, logout } = useAuth()

  if (!user) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 focus:outline-none">
          <Avatar className="h-8 w-8 ring-2 ring-gray-200 hover:ring-blue-400 transition-all">
            <AvatarFallback>
              {getInitials(user.email)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:
```bash
npm run test:run -- tests/components/nav/user-menu.test.tsx
```

Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/nav/user-menu.tsx tests/components/nav/user-menu.test.tsx
git commit -m "feat(nav): add UserMenu component with avatar dropdown"
```

---

### Task 7: Refactor Navbar Component

**Files:**
- Modify: `src/components/nav/navbar.tsx:1-41`
- Test: `tests/components/nav/navbar.test.tsx`

- [ ] **Step 1: Write Navbar tests**

Create `tests/components/nav/navbar.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Navbar from '@/components/nav/navbar'
import { BrowserRouter } from 'react-router-dom'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('Navbar', () => {
  it('renders logo and brand name', () => {
    render(<Navbar />, { wrapper })
    expect(screen.getByText('AutoFunnel')).toBeDefined()
  })

  it('renders user avatar when authenticated', () => {
    render(<Navbar />, { wrapper })
    // Avatar should have user initials
    expect(screen.getByRole('button')).toBeDefined()
  })

  it('has correct height and styling', () => {
    const { container } = render(<Navbar />, { wrapper })
    const nav = container.querySelector('nav')
    expect(nav).toHaveClass('h-14')
    expect(nav).toHaveClass('bg-white/80')
    expect(nav).toHaveClass('backdrop-blur-md')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
npm run test:run -- tests/components/nav/navbar.test.tsx
```

Expected: FAIL (current navbar doesn't have avatar)

- [ ] **Step 3: Refactor Navbar component**

Replace `src/components/nav/navbar.tsx`:

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import UserMenu from './user-menu'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  const { user } = useAuth()
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 h-14 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* Left: Logo + Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-lg text-gray-900 hover:text-blue-600 transition-colors"
        >
          <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
            <span className="text-white text-xs font-bold">A</span>
          </div>
          AutoFunnel
        </Link>

        {/* Right: User Menu or Auth Buttons */}
        {user ? (
          <UserMenu />
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:
```bash
npm run test:run -- tests/components/nav/navbar.test.tsx
```

Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/nav/navbar.tsx tests/components/nav/navbar.test.tsx
git commit -m "feat(nav): refactor Navbar with fixed positioning, glassmorphism, and user menu"
```

---

### Task 8: Update Dashboard Layout

**Files:**
- Modify: `src/app/dashboard/layout.tsx:1-18`

- [ ] **Step 1: Update layout for fixed sidebar and navbar**

Read current file:
```bash
cat src/app/dashboard/layout.tsx
```

Replace `src/app/dashboard/layout.tsx`:

```tsx
import Navbar from '@/components/nav/navbar'
import Sidebar from '@/components/dashboard/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <Sidebar />
      <main className="ml-64 pt-14 p-8 transition-all duration-300">
        {children}
      </main>
    </div>
  )
}
```

Note: The `ml-64` margin-left will need to be dynamic based on sidebar state. This will be addressed in Task 9.

- [ ] **Step 2: Commit**

```bash
git add src/app/dashboard/layout.tsx
git commit -m "feat(layout): update dashboard layout for fixed positioning"
```

---

### Task 9: Update Button and Card Variants

**Files:**
- Modify: `src/components/ui/button.tsx:1-52`
- Modify: `src/components/ui/card.tsx:1-90`

- [ ] **Step 1: Update button variants with micro-interactions**

Read current file:
```bash
cat src/components/ui/button.tsx
```

Update `src/components/ui/button.tsx` - modify the `buttonVariants` cva:

Change line 6 from:
```tsx
'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]',
```

To:
```tsx
'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] hover:scale-[1.02]',
```

- [ ] **Step 2: Update card variants with hover animations**

Read current file:
```bash
cat src/components/ui/card.tsx
```

Update `src/components/ui/card.tsx` - modify line 6:

Change:
```tsx
'rounded-lg border bg-bg-elevated text-text-primary transition-all duration-200',
```

To:
```tsx
'rounded-lg border bg-bg-elevated text-text-primary transition-all duration-200 hover:shadow-md hover:-translate-y-0.5',
```

Update the `interactive` variant (line 13):

Change:
```tsx
interactive: 'border-border-default shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer',
```

To:
```tsx
interactive: 'border-border-default shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer',
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/button.tsx src/components/ui/card.tsx
git commit -m "feat(ui): enhance button and card variants with micro-interactions"
```

---

### Task 10: Fix Layout Margin Based on Sidebar State

**Files:**
- Modify: `src/app/dashboard/layout.tsx`
- Create: `src/lib/store/ui-store.ts` (optional, for global UI state)

- [ ] **Step 1: Create UI store for sidebar state (optional)**

If you want the main content margin to respond to sidebar collapse:

Create `src/lib/store/ui-store.ts`:

```tsx
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  isSidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isSidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
    }),
    {
      name: 'autofunnel-ui-state',
      partialize: (state) => ({ isSidebarCollapsed: state.isSidebarCollapsed }),
    }
  )
)
```

- [ ] **Step 2: Update layout to use sidebar state**

Update `src/app/dashboard/layout.tsx`:

```tsx
'use client'

import Navbar from '@/components/nav/navbar'
import Sidebar from '@/components/dashboard/sidebar'
import { useUIStore } from '@/lib/store/ui-store'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed)

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <Sidebar />
      <main
        className={`
          pt-14 p-8 transition-all duration-300
          ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}
        `}
      >
        {children}
      </main>
    </div>
  )
}
```

Note: This requires Sidebar to sync its state with the store. Alternative approach: keep it simple with CSS-only approach.

- [ ] **Step 3: Commit**

```bash
git add src/app/dashboard/layout.tsx src/lib/store/ui-store.ts
git commit -m "feat(layout): make main content margin responsive to sidebar state"
```

---

### Task 11: Add Tooltips to Icon Buttons

**Files:**
- Create: `src/components/ui/tooltip.tsx` (optional, or use native title attribute)

- [ ] **Step 1: Add tooltips to collapsed sidebar nav items**

The NavItem component already has `title` attribute for native tooltips when collapsed. Verify this is working:

Read `src/components/dashboard/nav-item.tsx` and confirm line 36-37:
```tsx
title={isCollapsed ? label : undefined}
```

- [ ] **Step 2: Add tooltips to other icon buttons**

Search for icon-only buttons:
```bash
grep -r "size=\"icon\"" src/components/ --include="*.tsx"
```

Add `title` or `aria-label` to each icon button found.

Example for sidebar toggle button (already has aria-label in Task 5).

- [ ] **Step 3: Commit**

```bash
git add src/components/
git commit -m "feat(a11y): add tooltips and aria-labels to icon buttons"
```

---

### Task 12: Final Polish and Testing

**Files:**
- All modified components

- [ ] **Step 1: Run full test suite**

Run:
```bash
npm run test:run
```

Expected: All tests pass

- [ ] **Step 2: Run build to verify no TypeScript errors**

Run:
```bash
npm run build
```

Expected: Build succeeds with no errors

- [ ] **Step 3: Manual testing checklist**

Test the following in browser:
- [ ] Sidebar collapses/expands smoothly
- [ ] Collapsed state persists after page reload
- [ ] All nav items have correct hover states (translate-x-1)
- [ ] Active nav item shows blue background and border
- [ ] User dropdown opens/closes correctly
- [ ] Avatar shows correct initials
- [ ] All buttons have active scale animation
- [ ] Focus rings visible on keyboard navigation
- [ ] Tooltips appear on collapsed sidebar items
- [ ] Main content margin adjusts to sidebar state

- [ ] **Step 4: Commit final changes**

```bash
git add .
git commit -m "chore: final polish and testing for dashboard UI redesign"
```

---

### Task 13: Update Documentation

**Files:**
- Create: `docs/ui-components.md` (optional)

- [ ] **Step 1: Document new components**

Create `docs/ui-components.md`:

```markdown
# UI Components

## Avatar
User avatar with fallback to initials.

```tsx
<Avatar className="h-8 w-8">
  <AvatarFallback>VB</AvatarFallback>
</Avatar>
```

## DropdownMenu
Accessible dropdown menu primitive.

```tsx
<DropdownMenu>
  <DropdownMenuTrigger>Open</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Item 1</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## NavItem
Navigation item for sidebar.

```tsx
<NavItem
  icon={LayoutGrid}
  label="Dashboard"
  href="/dashboard"
  isCollapsed={false}
/>
```
```

- [ ] **Step 2: Commit**

```bash
git add docs/ui-components.md
git commit -m "docs: add UI components documentation"
```

---

## Testing Summary

### Unit Tests
- Avatar component (2 tests)
- DropdownMenu component (2 tests)
- NavItem component (4 tests)
- Sidebar component (4 tests)
- UserMenu component (3 tests)
- Navbar component (3 tests)

### Manual Testing
- Sidebar collapse/expand animation
- LocalStorage persistence
- Hover states on all interactive elements
- Active state indicators
- User dropdown functionality
- Responsive layout adjustments
- Keyboard navigation
- Focus states

---

## Dependencies

```json
{
  "@radix-ui/react-avatar": "^1.0.4",
  "@radix-ui/react-dropdown-menu": "^2.0.6",
  "lucide-react": "^0.x",
  "zustand": "^4.x"
}
```

---

## Success Criteria

- [ ] Sidebar collapses to 64px with icons only
- [ ] Sidebar expands to 256px with icons + labels
- [ ] State persists in localStorage
- [ ] Smooth 300ms transition animation
- [ ] Nav items have hover translate-x-1 effect
- [ ] Active nav item has blue background and border indicator
- [ ] Navbar has glassmorphism styling
- [ ] User avatar dropdown works correctly
- [ ] All buttons have active:scale-[0.98]
- [ ] All interactive elements have visible focus states
- [ ] Tooltips on collapsed sidebar items
- [ ] Main content margin adjusts to sidebar state
- [ ] All tests pass
- [ ] Build succeeds with no errors
