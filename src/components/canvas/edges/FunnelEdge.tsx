'use client'

import { memo } from 'react'
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
} from '@xyflow/react'
import { getEdgeColor, getEdgeWidth } from '@/lib/canvas/colors'
import { formatPercentage } from '@/lib/canvas/formatters'
import { useCanvasStore } from '@/lib/store/canvas-store'
import type { FunnelEdge } from '@/types/canvas'

function FunnelEdge(props: EdgeProps<FunnelEdge>) {
  const { viewMode } = useCanvasStore()
  const [edgePath] = getSmoothStepPath(props)
  
  const conversionRate = props.data?.conversion ?? 0
  const trafficVolume = props.data?.traffic ?? 0
  
  const strokeColor = getEdgeColor(conversionRate)
  const strokeWidth = viewMode === 'map' ? 2 : getEdgeWidth(trafficVolume)
  const isAnimated = viewMode === 'heat'

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={props.markerEnd}
        style={{ strokeWidth, stroke: strokeColor }}
      />
      
      {isAnimated && (
        <circle r="3" fill={strokeColor}>
          <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} />
        </circle>
      )}
      
      {viewMode !== 'map' && (
        <EdgeLabelRenderer>
          <div className="px-2 py-1 text-xs font-medium bg-white rounded shadow-md">
            {formatPercentage(conversionRate)}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}

export default memo(FunnelEdge)
