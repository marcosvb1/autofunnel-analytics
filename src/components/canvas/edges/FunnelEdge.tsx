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

      <defs>
        <marker
          id="arrow-main"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
        </marker>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
        </marker>
      </defs>
    </>
  )
}

export default memo(FunnelEdge)