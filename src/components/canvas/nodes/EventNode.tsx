'use client'

import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { cn } from '@/lib/utils/helpers'
import { getNodeConfig } from '@/lib/canvas/node-config'
import { formatVolume } from '@/lib/canvas/utils'
import type { FunnelNode } from '@/types/canvas'
import type { NodeCategory } from '@/types/funnel'
import {
  Mail,
  MessageSquare,
  Phone,
  Calendar,
  Send,
  Eye,
  MousePointerClick,
  Download,
  ShoppingCart,
  CreditCard,
} from 'lucide-react'

interface EventNodeProps {
  id: string
  data: FunnelNode['data'] & {
    nodeCategory: NodeCategory
  }
  selected: boolean
}

const ICON_MAP: Record<string, any> = {
  email: Mail,
  sms: MessageSquare,
  phone_call: Phone,
  calendar_event: Calendar,
  form_submit: Send,
  video_view: Eye,
  link_click: MousePointerClick,
  file_download: Download,
  add_to_cart: ShoppingCart,
  initiate_checkout: CreditCard,
}

function EventNode({ id, data, selected }: EventNodeProps) {
  const config = getNodeConfig(data.nodeCategory)
  const IconComponent = ICON_MAP[data.nodeCategory] || Mail

  return (
    <div
      className={cn(
        'rounded-lg cursor-pointer overflow-hidden transition-all duration-200 border-2 shadow-md min-w-[180px] max-w-[220px] p-3',
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

      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: config.primaryColor + '20' }}
        >
          <IconComponent className="w-4 h-4" style={{ color: config.primaryColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <span className="font-medium text-sm truncate block">{data.label}</span>
        </div>
      </div>

      <div className="flex justify-between text-xs">
        <span className="text-gray-500">Events</span>
        <span className="font-medium" style={{ color: config.textColor }}>
          {formatVolume(data.volume)}
        </span>
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

export default memo(EventNode)
