'use client'

import { useEffect } from 'react'
import NavItem from './nav-item'
import { useUIStore } from '@/lib/store/ui-store'
import {
  LayoutGrid,
  Funnel,
  BarChart3,
  Plug,
  Settings,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

export default function Sidebar() {
  const isCollapsed = useUIStore((state) => state.isSidebarCollapsed)
  const setSidebarCollapsed = useUIStore((state) => state.setSidebarCollapsed)

  const toggleSidebar = () => {
    setSidebarCollapsed(!isCollapsed)
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
