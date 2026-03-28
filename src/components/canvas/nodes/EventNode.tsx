'use client'

import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { cn } from '@/lib/utils/helpers'
import { formatVolume } from '@/lib/canvas/utils'
import type { FunnelNode } from '@/types/canvas'

function EventNode({ data, selected }: NodeProps<FunnelNode>) {
  return (
    <div
      className={cn(
        'bg-purple-50 border-2 border-purple-300 rounded-lg shadow-md min-w-[180px]',
        selected && 'border-purple-500'
      )}
    >
      <Handle type="target" position={Position.Left} className="w-3 h-3" />

      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full" />
          <span className="font-medium text-sm truncate">{data.label}</span>
        </div>

        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Events</span>
          <span className="font-medium">{formatVolume(data.volume)}</span>
        </div>

        <p className="mt-2 text-xs text-gray-400 truncate">{data.url}</p>
      </div>

      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </div>
  )
}

export default memo(EventNode)