'use client'

import { memo, useCallback } from 'react'
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
        'bg-white rounded-lg transition-all duration-200 ease-out cursor-pointer overflow-hidden',
        isCurrentlyExpanded ? 'w-[280px]' : 'w-[200px]',
        selected ? 'border-2 border-blue-500' : 'border-2 border-gray-200',
      )}
      style={{
        minHeight: isCurrentlyExpanded ? '180px' : '100px',
        boxShadow: isCurrentlyExpanded
          ? '0 4px 12px rgba(0, 0, 0, 0.15)'
          : '0 2px 4px rgba(0, 0, 0, 0.1)',
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
                <span className="text-gray-500">Vol</span>
                <span className="font-medium">{formatVolume(data.volume)}</span>
              </div>

              {data.spend !== undefined && data.spend > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Spend</span>
                  <span className="font-medium">{formatSpend(data.spend)}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm truncate flex-1">{data.label}</span>
                {data.campaign && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded ml-1 flex-shrink-0">
                    {data.campaign}
                  </span>
                )}
              </div>
              {data.url && (
                <p className="text-xs text-gray-400 truncate mb-1">{data.url}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-1 text-xs flex-1">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Volume</span>
                <span className="font-medium">{formatVolume(data.volume)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Spend</span>
                <span className="font-medium">{formatSpend(data.spend || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Conv</span>
                <span className={cn(
                  'font-medium',
                  data.conversion !== undefined ? getConversionColor(data.conversion) : 'text-gray-400'
                )}>
                  {data.conversion !== undefined ? formatPercentage(data.conversion) : '-'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Rev</span>
                <span className="font-medium">
                  {data.revenue !== undefined ? formatCurrency(data.revenue) : '-'}
                </span>
              </div>
              <div className="flex justify-between items-center col-span-2">
                <span className="text-gray-500">ROI</span>
                <span className={cn(
                  'font-medium',
                  data.roi !== undefined && data.roi >= 1 ? 'text-green-600' : 'text-red-600'
                )}>
                  {data.roi !== undefined ? formatROI(data.roi) : '-'}
                </span>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t flex gap-1">
              <button
                className="flex-1 text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                onClick={(e) => handleActionClick(e, 'view-details')}
              >
                Details
              </button>
              <button
                className="flex-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                onClick={(e) => handleActionClick(e, 'edit')}
              >
                Edit
              </button>
            </div>
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-gray-400" />
    </div>
  )
}

export default memo(PageNode)