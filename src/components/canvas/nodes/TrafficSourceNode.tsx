'use client'

import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { cn } from '@/lib/utils/helpers'
import { getNodeConfig } from '@/lib/canvas/node-config'
import { formatVolume, formatSpend } from '@/lib/canvas/utils'
import type { FunnelNode } from '@/types/canvas'
import type { NodeCategory } from '@/types/funnel'
import {
  Search,
  Mail,
  Mic,
  Users,
  Video,
  Image,
  Camera,
  MessageSquare,
  Handshake,
  ArrowRight,
  Target,
  Globe,
  Zap,
  Music,
} from 'lucide-react'

interface TrafficSourceNodeProps {
  id: string
  data: FunnelNode['data'] & {
    nodeCategory: NodeCategory
    campaign?: string
    spend?: number
  }
  selected: boolean
}

const ICON_MAP: Record<string, any> = {
  google_ads: Search,
  facebook_ads: Globe,
  instagram_ads: Camera,
  tiktok_ads: Video,
  linkedin_ads: Users,
  youtube_ads: Video,
  twitter_ads: MessageSquare,
  pinterest_ads: Image,
  snapchat_ads: Camera,
  reddit_ads: MessageSquare,
  affiliate: Handshake,
  organic_search: Search,
  direct: ArrowRight,
  email_marketing: Mail,
  podcast: Mic,
  webinar: Users,
}

function TrafficSourceNode({ id, data, selected }: TrafficSourceNodeProps) {
  const category = data.nodeCategory || 'google_ads'
  const config = getNodeConfig(category)
  const IconComponent = ICON_MAP[category] || Target

  return (
    <div
      className={cn(
        'rounded-lg cursor-pointer overflow-hidden transition-all duration-200 border-2 shadow-md min-w-[180px] max-w-[220px] p-3',
        selected && 'ring-2 ring-blue-400 ring-offset-2'
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
          {data.campaign && (
            <span
              className="text-xs px-1.5 py-0.5 rounded mt-0.5 inline-block truncate block"
              style={{
                backgroundColor: config.primaryColor + '30',
                color: config.primaryColor,
              }}
            >
              {data.campaign.length > 15 ? data.campaign.substring(0, 15) + '...' : data.campaign}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Visitors</span>
          <span className="font-medium" style={{ color: config.textColor }}>
            {formatVolume(data.volume)}
          </span>
        </div>

        {data.spend !== undefined && data.spend > 0 && (
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Spend</span>
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

export default memo(TrafficSourceNode)
