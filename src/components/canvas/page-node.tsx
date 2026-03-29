import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { PageNodeData } from '@/types/funnel'

// Format large numbers (5000 -> 5.0k, 1000000 -> 1.0M)
const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num.toString()
}

const PageNode = memo(({ data, selected }: NodeProps<PageNodeData>) => {
  const { label, volume, conversion, roi, spend, isConversion } = data

  return (
    <div className={`
      relative min-w-[160px] max-w-[240px]
      bg-white rounded-lg shadow-md
      border border-gray-200
      transition-all duration-200 ease-in-out
      hover:shadow-lg hover:border-primary
      ${selected ? 'ring-2 ring-primary shadow-lg' : ''}
      ${isConversion ? 'border-green-400 bg-green-50' : ''}
    `}>
      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 -mt-1.5"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 -mb-1.5"
      />

      {/* Node content */}
      <div className="p-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm text-text-primary truncate pr-2">
            {label}
          </h3>
          {isConversion && (
            <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full" title="Conversion" />
          )}
        </div>

        {/* Metrics */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-tertiary">Volume</span>
            <span className="font-medium text-text-primary">{formatNumber(volume)}</span>
          </div>

          {conversion !== undefined && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-tertiary">Conv.</span>
              <span className="font-medium text-primary">{conversion}%</span>
            </div>
          )}

          {spend !== undefined && spend > 0 && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-tertiary">Spend</span>
              <span className="font-medium text-text-primary">${formatNumber(spend)}</span>
            </div>
          )}

          {roi !== undefined && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-tertiary">ROI</span>
              <span className={`font-medium ${roi >= 1 ? 'text-green-600' : 'text-red-600'}`}>
                {roi.toFixed(1)}x
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

PageNode.displayName = 'PageNode'

export default PageNode
