'use client'

import { useState } from 'react'
import { getNodeByGroup } from '@/lib/canvas/node-config'
import type { NodeCategoryGroup, NodeTypeConfig } from '@/types/funnel'

interface NodeSelectorPanelProps {
  onNodeSelect: (category: NodeTypeConfig) => void
}

export default function NodeSelectorPanel({ onNodeSelect }: NodeSelectorPanelProps) {
  const [activeGroup, setActiveGroup] = useState<NodeCategoryGroup>('traffic')

  const groups: NodeCategoryGroup[] = ['traffic', 'page', 'event', 'conversion']
  const groupLabels: Record<NodeCategoryGroup, string> = {
    traffic: '📢 Traffic',
    page: '📄 Pages',
    event: '⚡ Events',
    conversion: '💰 Conversions',
  }

  const nodes = getNodeByGroup(activeGroup)

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 w-64 max-h-[600px] overflow-hidden flex flex-col">
      <div className="p-3 border-b border-gray-200">
        <h3 className="font-semibold text-sm text-gray-700">Add Node</h3>
      </div>

      <div className="flex border-b border-gray-200">
        {groups.map((group) => (
          <button
            key={group}
            onClick={() => setActiveGroup(group)}
            className={`flex-1 px-2 py-2 text-xs font-medium transition-colors ${
              activeGroup === group
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {groupLabels[group]}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-1 gap-1">
          {nodes.map((node) => (
            <button
              key={node.category}
              onClick={() => onNodeSelect(node)}
              className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 transition-colors text-left"
              style={{
                backgroundColor: node.backgroundColor,
                border: `1px solid ${node.borderColor}`,
              }}
            >
              <div
                className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: node.primaryColor + '30' }}
              >
                <NodeIcon iconName={node.iconName} color={node.primaryColor} />
              </div>
              <span className="text-xs font-medium truncate" style={{ color: node.textColor }}>
                {node.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function NodeIcon({ iconName, color }: { iconName: string; color: string }) {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke={color} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" strokeWidth="2" />
      <path strokeWidth="2" d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  )
}
