'use client'

import { useCallback, memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { cn } from '@/lib/utils/helpers'
import { useCanvasStore } from '@/lib/store/canvas-store'
import { formatVolume, formatSpend, getConversionColor } from '@/lib/canvas/utils'
import type { FunnelNode } from '@/types/canvas'

interface NodePropsWithData extends NodeProps<FunnelNode> {
  data: FunnelNode['data'] & {
    revenue?: number
    isConversion?: boolean
  }
}

function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`
  }
  return `$${value.toFixed(0)}`
}

function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

function formatROI(value: number): string {
  return `${value.toFixed(1)}x`
}

function PageNode({ id, data, selected }: NodePropsWithData) {
  const { expandedNodeId, setExpandedNode } = useCanvasStore()
  const isCurrentlyExpanded = expandedNodeId === id

  const handleClick = useCallback(() => {
    const newExpanded = !isCurrentlyExpanded
    setExpandedNode(newExpanded ? id : null)
  }, [isCurrentlyExpanded, id, setExpandedNode])

  const handleActionClick = useCallback((e: React.MouseEvent, action: string) => {
    e.stopPropagation()
    console.log(`Action clicked: ${action} on node ${id}`)
  }, [id])

  return (
    <div
      className={cn(
        'bg-white rounded-lg cursor-pointer overflow-hidden',
        isCurrentlyExpanded ? 'w-[280px]' : 'w-[200px]',
        selected ? 'border-2 border-blue-500' : 'border-2 border-gray-200',
      )}
      style={{
        minHeight: isCurrentlyExpanded ? '180px' : '100px',
        boxShadow: isCurrentlyExpanded ? '0 4px 12px rgba(0, 0, 0, 0.15)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
      onClick={handleClick}
    >
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-gray-400" />
      <div className="p-3 h-full flex flex-col">
        {!isCurrentlyExpanded ? (
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-sm truncate flex-1">{data.label}</span>
              {data.campaign && (
                <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded ml-1 flex-shrink-0">
                  {data.campaign.length > 8 ? data.campaign.substring(0, 8) + '...' : data.campaign}
                </span>
              )}
            </div>
            <div className="space-y-0.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Volume</span>
                <span className="font-medium text-gray-900">{formatVolume(data.volume)}</span>
              </div>
              {data.spend !== undefined && data.spend > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Spend</span>
                  <span className="font-medium text-gray-900">{formatCurrency(data.spend)}</span>
                </div>
              )}
            </div>
            <div className="mt-2 pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-400 truncate">{data.url}</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sm">{data.label}</span>
              <button onClick={(e) => { e.stopPropagation(); handleActionClick(e, 'settings'); }} className="p-1 hover:bg-gray-100 rounded transition-colors">
                <span className="text-xs">⚙️</span>
              </button>
            </div>
            <div className="space-y-1 text-xs flex-1">
              <div className="flex justify-between">
                <span className="text-gray-500">Volume:</span>
                <span className="font-medium text-gray-900">{formatVolume(data.volume)}</span>
              </div>
              {data.spend !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Spend:</span>
                  <span className="font-medium text-gray-900">{formatCurrency(data.spend)}</span>
                </div>
              )}
              {data.conversion !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Conv:</span>
                  <span className={`font-medium ${getConversionColor(data.conversion)}`}>{formatPercentage(data.conversion)}</span>
                </div>
              )}
              {data.revenue !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Revenue:</span>
                  <span className="font-medium text-gray-900">{formatCurrency(data.revenue)}</span>
                </div>
              )}
              {data.roi !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-500">ROI:</span>
                  <span className={`font-medium ${data.roi >= 1 ? 'text-green-600' : 'text-red-600'}`}>{formatROI(data.roi)}</span>
                </div>
              )}
            </div>
            <div className="mt-2 pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-400 truncate">{data.url}</p>
              {data.campaign && <p className="text-xs text-gray-500 mt-1">🎯 {data.campaign}</p>}
            </div>
            <div className="flex gap-2 mt-2">
              <button onClick={(e) => handleActionClick(e, 'details')} className="flex-1 px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors">Details</button>
              <button onClick={(e) => handleActionClick(e, 'edit')} className="flex-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">Edit</button>
            </div>
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-gray-400" />
    </div>
  )
}

export default memo(PageNode)
