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
