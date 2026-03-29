'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/helpers'

const navItems = [
  { label: 'Projects', href: '/dashboard' },
  { label: 'Settings', href: '/dashboard/settings' },
  { label: 'Billing', href: '/dashboard/billing' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-border-default bg-bg-secondary h-[calc(100vh-3.5rem)]">
      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'block px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary/10 text-primary border-l-2 border-primary'
                  : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary border-l-2 border-transparent'
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}