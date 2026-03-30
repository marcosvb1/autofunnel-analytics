'use client'

import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { cn } from '@/lib/utils/helpers'
import { getNodeConfig } from '@/lib/canvas/node-config'
import { formatVolume, formatSpend } from '@/lib/canvas/utils'
import type { FunnelNode } from '@/types/canvas'
import { Target, Search, Music, Camera, MessageCircle, Users, Globe, Zap, Mail, Mic, Video } from 'lucide-react'

const ICON_MAP: Record<string, React.ElementType> = {
  Search,
  Music,
  Camera,
  MessageCircle,
  Users,
  Globe,
  Zap,
  Mail,
  Mic,
  Video,
}

function TrafficSourceNode({ data, selected }: NodeProps<FunnelNode>) {
  const nodeCategory = data.nodeCategory || 'facebook_ads'
  const config = getNodeConfig(nodeCategory)
  const IconComponent = ICON_MAP[config.iconName] || Target

  return (
    <div
      className={cn(
        'rounded-lg cursor-pointer overflow-hidden transition-all duration-200 border-2 shadow-md min-w-[180px]',
        selected && 'ring-2 ring-blue-400 ring-offset-2'
      )}
      style={{
        backgroundColor: config.backgroundColor,
        borderColor: config.borderColor,
      }}
    >
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-gray-400" />

      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: config.primaryColor + '20' }}
          >
            <IconComponent size={16} style={{ color: config.primaryColor }} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-medium text-sm truncate block" style={{ color: config.textColor }}>
              {data.label}
            </span>
            {data.campaign && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 inline-block mt-0.5">
                {data.campaign.length > 15 ? data.campaign.substring(0, 15) + '...' : data.campaign}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-0.5">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Volume</span>
            <span className="font-medium text-gray-900">{formatVolume(data.volume)}</span>
          </div>
          {data.spend !== undefined && data.spend > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Spend</span>
              <span className="font-medium text-gray-900">{formatSpend(data.spend)}</span>
            </div>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-gray-400" />
    </div>
  )
}

export default memo(TrafficSourceNode)
