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
