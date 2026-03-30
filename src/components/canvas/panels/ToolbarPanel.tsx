'use client'

import { Button } from '@/components/ui/button'
import { LayoutGrid, Download, Save, BarChart3 } from 'lucide-react'

interface ToolbarPanelProps {
  onAutoLayout: () => void
  onSave: () => void
  onExport: () => void
  onToggleMetrics: () => void
  isSaving: boolean
  showMetrics: boolean
}

export default function ToolbarPanel({
  onAutoLayout,
  onSave,
  onExport,
  onToggleMetrics,
  isSaving,
  showMetrics,
}: ToolbarPanelProps) {
  return (
    <div className="flex items-center gap-1 p-2 bg-white/80 backdrop-blur-md shadow-md rounded-lg border border-gray-200">
      <Button
        variant="ghost"
        size="icon"
        onClick={onAutoLayout}
        className="h-9 w-9 hover:bg-gray-100 transition-colors"
        title="Auto Layout"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      
      <div className="w-px h-6 bg-gray-200 mx-1" />
      
      <Button
        variant={showMetrics ? 'secondary' : 'ghost'}
        size="icon"
        onClick={onToggleMetrics}
        className="h-9 w-9 hover:bg-gray-100 transition-colors"
        title="Toggle Metrics"
      >
        <BarChart3 className="h-4 w-4" />
      </Button>
      
      <div className="w-px h-6 bg-gray-200 mx-1" />
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onExport}
        className="h-9 w-9 hover:bg-gray-100 transition-colors"
        title="Export PNG"
      >
        <Download className="h-4 w-4" />
      </Button>
      
      <Button
        size="icon"
        onClick={onSave}
        disabled={isSaving}
        className="h-9 w-9 bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
        title={isSaving ? 'Saving...' : 'Save'}
      >
        {isSaving ? (
          <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}