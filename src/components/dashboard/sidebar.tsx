'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Projects', href: '/dashboard' },
  { label: 'Settings', href: '/dashboard/settings' },
  { label: 'Billing', href: '/dashboard/billing' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-gray-50 h-[calc(100vh-3.5rem)]">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-4 py-2 rounded-md text-sm ${
              pathname === item.href
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}