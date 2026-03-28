'use client'

import { Button } from '@/components/ui/button'

interface ToolbarPanelProps {
  onAutoLayout: () => void
  onSave: () => void
  onExport: () => void
  isSaving: boolean
}

export default function ToolbarPanel({
  onAutoLayout,
  onSave,
  onExport,
  isSaving,
}: ToolbarPanelProps) {
  return (
    <div className="flex items-center gap-2 p-2 bg-white border-b">
      <Button variant="outline" size="sm" onClick={onAutoLayout}>
        Auto Layout
      </Button>
      <div className="flex-1" />
      <Button variant="outline" size="sm" onClick={onExport}>
        Export PNG
      </Button>
      <Button size="sm" onClick={onSave} disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save'}
      </Button>
    </div>
  )
}