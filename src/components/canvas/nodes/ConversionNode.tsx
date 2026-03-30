'use client'

import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { cn } from '@/lib/utils/helpers'
import { getNodeConfig } from '@/lib/canvas/node-config'
import { formatVolume, formatSpend } from '@/lib/canvas/utils'
import type { FunnelNode } from '@/types/canvas'
import type { NodeCategory } from '@/types/funnel'
import {
  DollarSign,
  UserPlus,
  UserCheck,
  Repeat,
  Presentation,
  Users,
} from 'lucide-react'

interface ConversionNodeProps {
  id: string
  data: FunnelNode['data'] & {
    nodeCategory: NodeCategory
  }
  selected: boolean
}

const ICON_MAP: Record<string, any> = {
  purchase: DollarSign,
  lead: UserPlus,
  signup: UserCheck,
  subscription: Repeat,
  demo_request: Presentation,
  consultation: Users,
}

function ConversionNode({ id, data, selected }: ConversionNodeProps) {
  const category = data.nodeCategory || 'purchase'
  const config = getNodeConfig(category)
  const IconComponent = ICON_MAP[category] || DollarSign

  return (
    <div
      className={cn(
        'rounded-lg cursor-pointer overflow-hidden transition-all duration-200 border-2 shadow-md min-w-[200px] max-w-[240px] p-3',
        selected && 'ring-2 ring-offset-2'
      )}
      style={{
        backgroundColor: config.backgroundColor,
        borderColor: config.borderColor,
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3"
        style={{ backgroundColor: config.primaryColor }}
      />

      <div className="flex items-center gap-2 mb-3">
        <div
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse'
          )}
          style={{ backgroundColor: config.primaryColor + '30' }}
        >
          <IconComponent className="w-5 h-5" style={{ color: config.primaryColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-sm truncate block" style={{ color: config.textColor }}>
            {data.label}
          </span>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Conversions</span>
          <span className="font-bold" style={{ color: config.primaryColor }}>
            {formatVolume(data.volume)}
          </span>
        </div>

        {data.spend !== undefined && data.spend > 0 && (
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Total Spend</span>
            <span className="font-medium" style={{ color: config.textColor }}>
              {formatSpend(data.spend)}
            </span>
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3"
        style={{ backgroundColor: config.primaryColor }}
      />
    </div>
  )
}

export default memo(ConversionNode)
