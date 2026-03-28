'use client'

import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { cn } from '@/lib/utils/helpers'
import { formatVolume, formatSpend, getConversionColor } from '@/lib/canvas/utils'
import type { FunnelNode } from '@/types/canvas'

function PageNode({ data, selected }: NodeProps<FunnelNode>) {
  return (
    <div
      className={cn(
        'bg-white border-2 rounded-lg shadow-md min-w-[200px]',
        selected ? 'border-blue-500' : 'border-gray-200'
      )}
    >
      <Handle type="target" position={Position.Left} className="w-3 h-3" />

      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-sm truncate">{data.label}</span>
          {data.campaign && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
              {data.campaign}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Volume</span>
            <span className="font-medium">{formatVolume(data.volume)}</span>
          </div>

          {data.spend > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Spend</span>
              <span className="font-medium">{formatSpend(data.spend)}</span>
            </div>
          )}
        </div>

        <div className="mt-2 pt-2 border-t">
          <p className="text-xs text-gray-400 truncate">{data.url}</p>
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </div>
  )
}

export default memo(PageNode)