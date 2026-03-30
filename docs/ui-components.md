# UI Components Documentation

## Avatar

User avatar with fallback to initials. Uses Radix UI primitive for accessibility.

### Usage

```tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

<Avatar className="h-8 w-8">
  <AvatarFallback>VB</AvatarFallback>
</Avatar>
```

### Props

- `className` - Additional CSS classes
- `children` - AvatarImage (optional) and AvatarFallback (required)

---

## DropdownMenu

Accessible dropdown menu primitive using Radix UI.

### Usage

```tsx
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'

<DropdownMenu>
  <DropdownMenuTrigger>Open</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Menu</DropdownMenuLabel>
    <DropdownMenuItem>Item 1</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Item 2</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Components

- `DropdownMenu` - Root component
- `DropdownMenuTrigger` - Trigger button
- `DropdownMenuContent` - Dropdown content (portal)
- `DropdownMenuItem` - Menu item
- `DropdownMenuSeparator` - Separator line
- `DropdownMenuLabel` - Section label

---

## NavItem

Navigation item for sidebar with icon and label.

### Usage

```tsx
import NavItem from '@/components/dashboard/nav-item'
import { LayoutGrid } from 'lucide-react'

<NavItem
  icon={LayoutGrid}
  label="Dashboard"
  href="/dashboard"
  isCollapsed={false}
/>
```

### Props

- `icon` - Lucide React icon component
- `label` - Navigation item label
- `href` - Destination URL
- `isCollapsed` - Whether sidebar is collapsed (hides label, shows tooltip)

### Features

- Active state detection (blue background + border)
- Hover animation (translate-x-1)
- Tooltip when collapsed (native title attribute)

---

## UserMenu

User profile dropdown menu with avatar.

### Usage

```tsx
import UserMenu from '@/components/nav/user-menu'

<UserMenu />
```

### Features

- Avatar with user initials
- Dropdown with user email
- Settings link
- Sign out action

### Dependencies

- Requires authenticated user from `useAuth()` hook

---

## Button (Updated)

Enhanced with micro-interactions.

### New Features

- `hover:scale-[1.02]` - Subtle grow on hover
- `active:scale-[0.98]` - Shrink on press

---

## Card (Updated)

Enhanced with hover animations.

### New Features

- `hover:shadow-md` - Increased shadow on hover
- `hover:-translate-y-0.5` - Subtle lift on hover
- Interactive variant: `hover:shadow-lg hover:-translate-y-1`

---

## UI Store

Zustand store for global UI state.

### Usage

```tsx
import { useUIStore } from '@/lib/store/ui-store'

const isCollapsed = useUIStore((state) => state.isSidebarCollapsed)
const setSidebarCollapsed = useUIStore((state) => state.setSidebarCollapsed)
```

### State

- `isSidebarCollapsed` - Current sidebar state
- `setSidebarCollapsed(collapsed)` - Set sidebar state

### Persistence

State is persisted to localStorage under `autofunnel-ui-state`.
