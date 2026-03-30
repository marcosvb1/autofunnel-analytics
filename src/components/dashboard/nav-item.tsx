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
