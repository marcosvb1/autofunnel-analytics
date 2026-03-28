'use client'

import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { cn } from '@/lib/utils/helpers'
import { formatVolume, formatSpend } from '@/lib/canvas/utils'
import type { FunnelNode } from '@/types/canvas'

function ConversionNode({ data, selected }: NodeProps<FunnelNode>) {
  return (
    <div
      className={cn(
        'bg-green-50 border-2 border-green-400 rounded-lg shadow-lg min-w-[200px]',
        selected && 'border-green-600 ring-2 ring-green-300'
      )}
    >
      <Handle type="target" position={Position.Left} className="w-3 h-3" />

      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span className="font-semibold text-green-800">{data.label}</span>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Conversions</span>
            <span className="font-bold text-green-700">{formatVolume(data.volume)}</span>
          </div>

          {data.spend > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Total Spend</span>
              <span className="font-medium">{formatSpend(data.spend)}</span>
            </div>
          )}
        </div>

        <p className="mt-2 pt-2 border-t border-green-200 text-xs text-gray-400 truncate">
          {data.url}
        </p>
      </div>

      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </div>
  )
}

export default memo(ConversionNode)