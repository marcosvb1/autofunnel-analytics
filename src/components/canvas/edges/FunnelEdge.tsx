'use client'

import { memo } from 'react'
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
} from '@xyflow/react'
import EdgeLabel from './EdgeLabel'
import type { FunnelEdge } from '@/types/canvas'

function FunnelEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps<FunnelEdge>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  })

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: data?.isMainPath ? '#3b82f6' : '#94a3b8',
          strokeWidth: data?.isMainPath ? 3 : 2,
        }}
        markerEnd={`url(#${data?.isMainPath ? 'arrow-main' : 'arrow'})`}
      />

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <EdgeLabel
            volume={data?.volume ?? 0}
            conversion={data?.conversion ?? 0}
            isMainPath={data?.isMainPath ?? false}
          />
        </div>
      </EdgeLabelRenderer>
    </>
  )
}

export default memo(FunnelEdge)