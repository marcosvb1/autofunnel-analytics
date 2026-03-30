# Dashboard UI Redesign - Design Specification

**Date:** 2026-03-29  
**Author:** AutoFunnel Team  
**Status:** Approved  

---

## 1. Overview

This document specifies the UI/UX redesign of the AutoFunnel dashboard to achieve a more professional, polished, and modern interface. The redesign focuses on the global navigation system (sidebar + navbar), micro-interactions, and overall visual coherence.

### 1.1 Goals

- Create a professional, sleek interface that inspires confidence
- Improve navigation efficiency with collapsible sidebar
- Establish consistent micro-interactions across the app
- Maintain minimalism while adding essential features (hybrid approach)

### 1.2 Non-Goals

- Mobile responsive navigation (phase 2)
- Dark mode support (phase 2)
- Major structural changes to existing pages

---

## 2. Design Philosophy

**"Minimalista, mas fluido, sleek animations"**

- **Minimalist:** Remove visual clutter, focus on content
- **Fluid:** Smooth transitions, consistent motion
- **Sleek:** Modern glassmorphism, refined shadows
- **Professional:** Enterprise-grade polish without bloat

---

## 3. Architecture

### 3.1 Component Hierarchy

```
src/components/
├── dashboard/
│   ├── sidebar.tsx (refactor)
│   └── nav-item.tsx (new)
├── nav/
│   ├── navbar.tsx (refactor)
│   └── user-menu.tsx (new)
└── ui/
    ├── avatar.tsx (new)
    └── dropdown-menu.tsx (new)
```

### 3.2 Layout Structure

```
┌─────────────────────────────────────────────┐
│ Navbar (56px, glassmorphism)                │
├──────────┬──────────────────────────────────┤
│ Sidebar  │ Main Content                     │
│ (240px)  │                                  │
│ → (64px) │ - Dashboard pages                │
│          │ - Project views                  │
│          │ - Funnel canvas                  │
└──────────┴──────────────────────────────────┘
```

---

## 4. Specifications

### 4.1 Sidebar Component

#### States

| State | Width | Content |
|-------|-------|---------|
| Expanded | 256px (`w-64`) | Icons + Labels |
| Collapsed | 64px (`w-16`) | Icons only |

#### Structure

```tsx
<aside className="
  fixed left-0 top-14 h-[calc(100vh-3.5rem)]
  bg-white/80 backdrop-blur-md border-r
  transition-all duration-300 ease-in-out
  ${isCollapsed ? 'w-16' : 'w-64'}
">
  {/* Brand Section */}
  <div className="h-14 flex items-center px-4 border-b">
    <Logo className="h-6 w-6" />
    {!isCollapsed && <span className="ml-3 font-semibold">AutoFunnel</span>}
  </div>
  
  {/* Navigation Sections */}
  <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
    {/* Platform Section */}
    <div className="mb-6">
      {!isCollapsed && (
        <span className="text-xs font-medium text-gray-500 px-3 mb-2 block">
          Platform
        </span>
      )}
      <NavItem icon={LayoutGrid} label="Dashboard" href="/dashboard" />
      <NavItem icon={Funnel} label="Funnels" href="/dashboard/projects" />
      <NavItem icon={BarChart3} label="Analytics" href="/analytics" />
    </div>
    
    {/* Integrations Section */}
    <div className="mb-6">
      {!isCollapsed && (
        <span className="text-xs font-medium text-gray-500 px-3 mb-2 block">
          Integrations
        </span>
      )}
      <NavItem icon={Plug} label="Connections" href="/integrations" />
    </div>
    
    {/* Settings Section */}
    <div>
      {!isCollapsed && (
        <span className="text-xs font-medium text-gray-500 px-3 mb-2 block">
          Settings
        </span>
      )}
      <NavItem icon={Settings} label="Settings" href="/settings" />
    </div>
  </nav>
  
  {/* Collapse Toggle */}
  <button
    onClick={toggleSidebar}
    className="absolute bottom-4 right-2 p-2 rounded-md hover:bg-gray-100"
  >
    {isCollapsed ? <ChevronsRight /> : <ChevronsLeft />}
  </button>
</aside>
```

#### NavItem Component

```tsx
interface NavItemProps {
  icon: LucideIcon
  label: string
  href: string
  isActive?: boolean
  isCollapsed?: boolean
}

const NavItem = ({ icon: Icon, label, href, isActive, isCollapsed }: NavItemProps) => (
  <Link
    href={href}
    className={`
      flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium
      transition-all duration-200 ease-out
      ${isActive 
        ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
        : 'text-gray-600 hover:bg-gray-100 hover:translate-x-1'
      }
      ${isCollapsed ? 'justify-center' : ''}
    `}
    title={isCollapsed ? label : undefined}
  >
    <Icon className="h-5 w-5 flex-shrink-0" />
    {!isCollapsed && (
      <span className="truncate">{label}</span>
    )}
  </Link>
)
```

#### Interaction States

| State | Style |
|-------|-------|
| Default | `text-gray-600` |
| Hover | `bg-gray-100 translate-x-1` |
| Active | `bg-blue-50 text-blue-600 border-r-2 border-blue-600` |
| Focus | `ring-2 ring-primary ring-offset-2` |

#### Persistence

- Store collapsed state in `localStorage`
- Key: `autofunnel-sidebar-collapsed`
- Default: `false` (expanded)

---

### 4.2 Navbar Component

#### Structure

```tsx
<nav className="
  fixed top-0 left-0 right-0 h-14
  bg-white/80 backdrop-blur-md border-b
  z-50
">
  <div className="container mx-auto px-4 h-full flex items-center justify-between">
    {/* Left: Logo + Breadcrumb */}
    <div className="flex items-center gap-4">
      <Link href="/" className="font-semibold text-lg">
        AutoFunnel
      </Link>
      {pathname !== '/dashboard' && (
        <Breadcrumb />
      )}
    </div>
    
    {/* Right: User Menu */}
    <UserMenu />
  </div>
</nav>
```

#### User Menu Component

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <button className="flex items-center gap-2">
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-medium">
          {getInitials(user.email)}
        </AvatarFallback>
      </Avatar>
    </button>
  </DropdownMenuTrigger>
  
  <DropdownMenuContent align="end" className="w-56">
    <div className="px-3 py-2 border-b">
      <p className="text-sm font-medium">{user.email}</p>
    </div>
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
```

---

### 4.3 Micro-interactions

#### Button Variants (Update)

```tsx
const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] hover:scale-[1.02]',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white shadow-md hover:bg-primary-hover hover:shadow-lg',
        // ... existing variants
      },
      // ... existing sizes
    },
  }
)
```

#### Card Variants (Update)

```tsx
const cardVariants = cva(
  'rounded-lg border bg-bg-elevated text-text-primary transition-all duration-200 hover:shadow-md hover:-translate-y-0.5',
  {
    variants: {
      variant: {
        default: 'border-border-default shadow-sm',
        interactive: 'cursor-pointer border-border-default shadow-sm hover:shadow-md hover:-translate-y-1',
        // ... existing variants
      },
    },
  }
)
```

#### Animation Timing

| Action | Duration | Easing |
|--------|----------|--------|
| Hover state | 150ms | `ease-out` |
| Button press | 100ms | `ease-in-out` |
| Sidebar collapse | 300ms | `cubic-bezier(0.4, 0, 0.2, 1)` |
| Fade in | 200ms | `ease-out` |
| Slide in | 250ms | `cubic-bezier(0.4, 0, 0.2, 1)` |

---

### 4.4 New Components

#### Avatar Component

```tsx
// src/components/ui/avatar.tsx
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
      'flex h-full w-full items-center justify-center rounded-full bg-muted',
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
```

#### Dropdown Menu Component

```tsx
// src/components/ui/dropdown-menu.tsx
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
        'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 text-text-primary shadow-md',
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

// ... DropdownMenuSeparator, DropdownMenuLabel, etc.

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  // ... other exports
}
```

---

### 4.5 Navigation Items

| Section | Label | Icon | href |
|---------|-------|------|------|
| Platform | Dashboard | `LayoutGrid` | `/dashboard` |
| Platform | Funnels | `Funnel` | `/dashboard/projects` |
| Platform | Analytics | `BarChart3` | `/analytics` (future) |
| Integrations | Connections | `Plug` | `/integrations` (future) |
| Settings | Settings | `Settings` | `/settings` (future) |

---

## 5. Dependencies

### 5.1 New Packages

```json
{
  "@radix-ui/react-avatar": "^1.0.4",
  "@radix-ui/react-dropdown-menu": "^2.0.6"
}
```

### 5.2 Existing Packages

- `lucide-react` - Icon library (already installed)
- `class-variance-authority` - Component variants (already installed)
- `@xyflow/react` - Canvas (already installed)

---

## 6. Implementation Checklist

### Phase 1: Foundation

- [ ] Install Radix UI packages
- [ ] Create `Avatar` component
- [ ] Create `DropdownMenu` component
- [ ] Create `NavItem` component

### Phase 2: Sidebar Refactor

- [ ] Add collapse state with localStorage persistence
- [ ] Add navigation sections (Platform, Integrations, Settings)
- [ ] Add icons to all nav items
- [ ] Implement toggle button
- [ ] Add hover animations (translate-x-1)
- [ ] Add active state indicator (border-r-2)
- [ ] Add tooltips for collapsed state

### Phase 3: Navbar Refactor

- [ ] Reduce height to 56px
- [ ] Add glassmorphism styling
- [ ] Implement user avatar
- [ ] Add dropdown menu
- [ ] Add breadcrumb (optional)

### Phase 4: Polish

- [ ] Update button variants with active:scale-[0.98]
- [ ] Update card variants with hover animations
- [ ] Ensure consistent focus rings
- [ ] Add tooltips to icon buttons
- [ ] Test all interactions

---

## 7. Testing

### Manual Testing Checklist

- [ ] Sidebar collapses/expands smoothly
- [ ] Collapsed state persists after reload
- [ ] All nav items have correct hover states
- [ ] Active nav item is clearly indicated
- [ ] User dropdown opens/closes correctly
- [ ] Avatar fallback shows initials
- [ ] All buttons have active scale animation
- [ ] Focus rings visible on keyboard navigation
- [ ] Tooltips appear on icon buttons (collapsed sidebar)

### Accessibility

- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Focus states visible and clear
- [ ] ARIA labels on icon buttons
- [ ] Screen reader announces nav items correctly

---

## 8. Performance Considerations

- Use `React.memo` for NavItem components
- Debounce localStorage writes
- Avoid unnecessary re-renders in sidebar
- Test glassmorphism performance on lower-end devices

---

## 9. Future Enhancements (Out of Scope)

- Mobile responsive drawer (phase 2)
- Dark mode support (phase 2)
- Keyboard shortcuts (Cmd+K search)
- Notifications dropdown
- Recent projects quick access
- Workspace switcher

---

## 10. Design References

- [shadcn/ui](https://ui.shadcn.com) - Component patterns
- [Radix UI](https://radix-ui.com) - Primitives
- [Lucide Icons](https://lucide.dev) - Icon library
- [Tailwind CSS](https://tailwindcss.com) - Utility classes
