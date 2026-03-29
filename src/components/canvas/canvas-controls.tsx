import { Plus, LayoutGrid, Maximize, Download } from 'lucide-react'

interface CanvasControlsProps {
  onAddNode: () => void
  onAutoLayout: () => void
  onResetZoom: () => void
  onExport: () => void
}

export function CanvasControls({
  onAddNode,
  onAutoLayout,
  onResetZoom,
  onExport,
}: CanvasControlsProps) {
  return (
    <div className="absolute top-4 left-4 z-10 flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg shadow-md">
      <button
        onClick={onAddNode}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-text-primary hover:bg-bg-secondary rounded-md transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Node
      </button>

      <div className="w-px h-6 bg-border-default" />

      <button
        onClick={onAutoLayout}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-md transition-colors"
      >
        <LayoutGrid className="w-4 h-4" />
        Auto Layout
      </button>

      <button
        onClick={onResetZoom}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-text-primary hover:bg-bg-secondary rounded-md transition-colors"
      >
        <Maximize className="w-4 h-4" />
        Reset Zoom
      </button>

      <div className="w-px h-6 bg-border-default" />

      <button
        onClick={onExport}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-text-primary hover:bg-bg-secondary rounded-md transition-colors"
      >
        <Download className="w-4 h-4" />
        Export
      </button>
    </div>
  )
}
