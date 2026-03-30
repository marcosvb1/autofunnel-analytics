# Unbeatable Canvas v2.0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the current React Flow canvas into a Funnelytics competitor with AI-native features, layered analytics views, and Figma-grade polish.

**Architecture:** Four-phase rollout: (1) Design system + node/edge refactor, (2) AI chat + command palette + auto-detect, (3) PostHog/Meta analytics integration, (4) Motion polish + performance. Each phase produces working, testable software.

**Tech Stack:** React Flow v12, Zustand, Next.js 14, OpenAI/Anthropic SDK, Framer Motion, PostHog API, Meta Ads API

---

## File Structure

**New Files:**
- `src/lib/design/tokens.ts` — Design tokens (colors, shadows, motion)
- `src/lib/canvas/formatters.ts` — Metric formatters (volume, currency, percentage)
- `src/lib/canvas/colors.ts` — Semantic colors for edges/nodes
- `src/lib/ai/funnel-detector.ts` — AI funnel detection
- `src/lib/ai/natural-language.ts` — NL → canvas operations parser
- `src/lib/ai/bottleneck-analyzer.ts` — Bottleneck detection
- `src/lib/analytics/posthog-sync.ts` — PostHog data sync
- `src/lib/analytics/attribution.ts` — Campaign attribution logic
- `src/hooks/use-ai-chat.ts` — AI conversation state
- `src/hooks/use-canvas-data.ts` — PostHog data subscription
- `src/hooks/use-keyboard-shortcuts.ts` — Cmd+K, navigation
- `src/components/canvas/command-palette/CommandPalette.tsx` — Cmd+K interface
- `src/components/canvas/command-palette/CommandItem.tsx` — Command item
- `src/components/canvas/panels/AIChatPanel.tsx` — AI sidebar
- `src/components/canvas/panels/AttributionPanel.tsx` — Campaign breakdown
- `src/components/canvas/overlays/BottleneckOverlay.tsx` — Highlight overlays
- `src/components/canvas/overlays/NoteOverlay.tsx` — Sticky notes
- `src/app/api/ai/detect-funnel/route.ts` — Auto-detect endpoint
- `src/app/api/ai/chat/route.ts` — Chat completion endpoint
- `src/app/api/ai/analyze-bottlenecks/route.ts` — Bottleneck endpoint
- `src/app/api/analytics/posthog/route.ts` — PostHog proxy
- `src/app/api/analytics/meta/route.ts` — Meta Ads proxy
- `src/app/api/analytics/attribution/route.ts` — Attribution endpoint

**Modified Files:**
- `src/components/canvas/funnel-canvas.tsx` — Add view modes, overlays
- `src/components/canvas/canvas-controls.tsx` — Add view toggle, AI buttons
- `src/components/canvas/nodes/PageNode.tsx` — Progressive disclosure
- `src/components/canvas/edges/FunnelEdge.tsx` — Thickness/color/animation
- `src/lib/store/canvas-store.ts` — Add viewMode, expandedNodeId
- `src/types/funnel.ts` — Add new data fields

---

## Phase 1: Foundation (Week 1-2)

### Task 1: Design System Setup

**Files:**
- Create: `src/lib/design/tokens.ts`
- Modify: `src/app/globals.css`
- Test: `tests/lib/design/tokens.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/lib/design/tokens.test.ts
import { describe, it, expect } from 'vitest'
import { colors, shadows, motion } from '@/lib/design/tokens'

describe('Design Tokens', () => {
  it('should have correct primary colors', () => {
    expect(colors.primary.light).toBe('#2563EB')
    expect(colors.primary.hover).toBe('#1D4ED8')
  })

  it('should have semantic colors', () => {
    expect(colors.success).toBe('#10B981')
    expect(colors.warning).toBe('#F59E0B')
    expect(colors.danger).toBe('#EF4444')
  })

  it('should have shadow elevations', () => {
    expect(shadows.node).toBeDefined()
    expect(shadows.panel).toBeDefined()
    expect(shadows.modal).toBeDefined()
  })

  it('should have motion durations', () => {
    expect(motion.fast).toBe('150ms')
    expect(motion.base).toBe('200ms')
    expect(motion.slow).toBe('300ms')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test:run -- tests/lib/design/tokens.test.ts
```
Expected: FAIL with "Cannot find module '@/lib/design/tokens'"

- [ ] **Step 3: Create design tokens file**

```typescript
// src/lib/design/tokens.ts
export const colors = {
  // Primary
  primary: {
    base: '#2563EB',
    hover: '#1D4ED8',
    light: '#3B82F6',
  },
  // Semantic
  success: '#10B981',
  successLight: '#34D399',
  warning: '#F59E0B',
  warningLight: '#FBBF24',
  danger: '#EF4444',
  dangerLight: '#F87171',
  // Backgrounds
  canvas: '#FFFFFF',
  canvasDark: '#0F172A',
  node: '#FFFFFF',
  nodeDark: '#1E293B',
  // Borders
  border: '#E5E7EB',
  borderDark: '#334155',
  // Text
  textPrimary: '#111827',
  textPrimaryDark: '#F9FAFB',
  textSecondary: '#6B7280',
  textSecondaryDark: '#9CA3AF',
}

export const shadows = {
  node: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
  panel: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)',
  modal: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
}

export const motion = {
  fast: '150ms',
  base: '200ms',
  slow: '300ms',
  easing: 'ease-out',
  spring: 'cubic-bezier(0.4, 0, 0.2, 1)',
}

export const typography = {
  fontFamily: 'Inter, system-ui, sans-serif',
  sizes: {
    xs: '11px',
    sm: '12px',
    base: '14px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
  },
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
  },
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm run test:run -- tests/lib/design/tokens.test.ts
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/design/tokens.ts tests/lib/design/tokens.test.ts
git commit -m "feat: add design system tokens"
```

---

### Task 2: Metric Formatters

**Files:**
- Create: `src/lib/canvas/formatters.ts`
- Test: `tests/lib/canvas/formatters.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/lib/canvas/formatters.test.ts
import { describe, it, expect } from 'vitest'
import { formatVolume, formatCurrency, formatPercentage, formatROI } from '@/lib/canvas/formatters'

describe('Metric Formatters', () => {
  describe('formatVolume', () => {
    it('should format numbers under 1000', () => {
      expect(formatVolume(500)).toBe('500')
    })

    it('should format thousands', () => {
      expect(formatVolume(12500)).toBe('12.5K')
    })

    it('should format millions', () => {
      expect(formatVolume(1250000)).toBe('1.3M')
    })
  })

  describe('formatCurrency', () => {
    it('should format currency', () => {
      expect(formatCurrency(2450)).toBe('$2,450')
    })

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('$0')
    })
  })

  describe('formatPercentage', () => {
    it('should format percentage', () => {
      expect(formatPercentage(0.032)).toBe('3.2%')
    })
  })

  describe('formatROI', () => {
    it('should format positive ROI', () => {
      expect(formatROI(2.64)).toBe('+264%')
    })

    it('should format negative ROI', () => {
      expect(formatROI(-0.5)).toBe('-50%')
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test:run -- tests/lib/canvas/formatters.test.ts
```
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Write minimal implementation**

```typescript
// src/lib/canvas/formatters.ts
export function formatVolume(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toString()
}

export function formatCurrency(num: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

export function formatPercentage(num: number): string {
  return `${(num * 100).toFixed(1)}%`
}

export function formatROI(num: number): string {
  return `${num >= 0 ? '+' : ''}${(num * 100).toFixed(0)}%`
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm run test:run -- tests/lib/canvas/formatters.test.ts
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/canvas/formatters.ts tests/lib/canvas/formatters.test.ts
git commit -m "feat: add metric formatters"
```

---

### Task 3: Edge Color/Width Utilities

**Files:**
- Create: `src/lib/canvas/colors.ts`
- Test: `tests/lib/canvas/colors.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/lib/canvas/colors.test.ts
import { describe, it, expect } from 'vitest'
import { getEdgeColor, getEdgeWidth } from '@/lib/canvas/colors'

describe('Edge Colors', () => {
  describe('getEdgeColor', () => {
    it('should return green for high conversion', () => {
      expect(getEdgeColor(0.05)).toBe('#10B981')
      expect(getEdgeColor(0.08)).toBe('#10B981')
    })

    it('should return light green for good conversion', () => {
      expect(getEdgeColor(0.03)).toBe('#34D399')
      expect(getEdgeColor(0.04)).toBe('#34D399')
    })

    it('should return amber for medium conversion', () => {
      expect(getEdgeColor(0.01)).toBe('#F59E0B')
      expect(getEdgeColor(0.02)).toBe('#F59E0B')
    })

    it('should return red for low conversion', () => {
      expect(getEdgeColor(0.005)).toBe('#EF4444')
      expect(getEdgeColor(0)).toBe('#EF4444')
    })
  })

  describe('getEdgeWidth', () => {
    it('should return minimum width for low volume', () => {
      expect(getEdgeWidth(10)).toBeGreaterThanOrEqual(1)
    })

    it('should return maximum width for high volume', () => {
      expect(getEdgeWidth(100000)).toBeLessThanOrEqual(8)
    })

    it('should scale logarithmically', () => {
      const width1 = getEdgeWidth(100)
      const width2 = getEdgeWidth(10000)
      expect(width2).toBeGreaterThan(width1)
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test:run -- tests/lib/canvas/colors.test.ts
```
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

```typescript
// src/lib/canvas/colors.ts
import { colors } from '@/lib/design/tokens'

export function getEdgeColor(conversionRate: number): string {
  if (conversionRate >= 0.05) return colors.success
  if (conversionRate >= 0.03) return colors.successLight
  if (conversionRate >= 0.01) return colors.warning
  return colors.danger
}

export function getEdgeWidth(volume: number): number {
  const logVolume = Math.log10(volume + 1)
  return Math.min(8, Math.max(1, logVolume))
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm run test:run -- tests/lib/canvas/colors.test.ts
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/canvas/colors.ts tests/lib/canvas/colors.test.ts
git commit -m "feat: add edge color and width utilities"
```

---

### Task 4: Update Canvas Store with View Modes

**Files:**
- Modify: `src/lib/store/canvas-store.ts`
- Test: `tests/lib/store/canvas-store.test.ts`

- [ ] **Step 1: Read current file**

```bash
cat src/lib/store/canvas-store.ts
```

- [ ] **Step 2: Write the failing test**

```typescript
// tests/lib/store/canvas-store.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useCanvasStore } from '@/lib/store/canvas-store'

describe('Canvas Store', () => {
  beforeEach(() => {
    useCanvasStore.setState({
      nodes: [],
      edges: [],
      selectedNodeIds: [],
      selectedEdgeIds: [],
      viewMode: 'metrics',
      expandedNodeId: null,
    })
  })

  it('should have viewMode state', () => {
    const state = useCanvasStore.getState()
    expect(state.viewMode).toBe('metrics')
  })

  it('should set viewMode', () => {
    useCanvasStore.getState().setViewMode('heat')
    expect(useCanvasStore.getState().viewMode).toBe('heat')
  })

  it('should set expanded node', () => {
    useCanvasStore.getState().setExpandedNode('node-123')
    expect(useCanvasStore.getState().expandedNodeId).toBe('node-123')
  })

  it('should clear expanded node', () => {
    useCanvasStore.getState().setExpandedNode('node-123')
    useCanvasStore.getState().setExpandedNode(null)
    expect(useCanvasStore.getState().expandedNodeId).toBeNull()
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

```bash
npm run test:run -- tests/lib/store/canvas-store.test.ts
```
Expected: FAIL (viewMode and expandedNodeId don't exist)

- [ ] **Step 4: Update canvas store**

```typescript
// src/lib/store/canvas-store.ts
'use client'

import { create } from 'zustand'
import { applyNodeChanges, applyEdgeChanges } from '@xyflow/react'
import type { NodeChange, EdgeChange } from '@xyflow/react'
import type { FunnelNode, FunnelEdge } from '@/types/funnel'

export type ViewMode = 'map' | 'metrics' | 'heat'

interface CanvasState {
  nodes: FunnelNode[]
  edges: FunnelEdge[]
  selectedNodeIds: string[]
  selectedEdgeIds: string[]
  viewMode: ViewMode
  expandedNodeId: string | null
}

interface CanvasActions {
  setNodes: (nodes: FunnelNode[]) => void
  setEdges: (edges: FunnelEdge[]) => void
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  addNode: (node: FunnelNode) => void
  removeNode: (nodeId: string) => void
  addEdge: (edge: FunnelEdge) => void
  removeEdge: (edgeId: string) => void
  selectNode: (nodeId: string) => void
  deselectAll: () => void
  setViewMode: (mode: ViewMode) => void
  setExpandedNode: (nodeId: string | null) => void
}

export const useCanvasStore = create<CanvasState & CanvasActions>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeIds: [],
  selectedEdgeIds: [],
  viewMode: 'metrics',
  expandedNodeId: null,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) as unknown as FunnelNode[] })
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) as unknown as FunnelEdge[] })
  },

  addNode: (node) => {
    set({ nodes: [...get().nodes, node] })
  },

  removeNode: (nodeId) => {
    set({
      nodes: get().nodes.filter((n) => n.id !== nodeId),
      edges: get().edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
    })
  },

  addEdge: (edge) => {
    set({ edges: [...get().edges, edge] })
  },

  removeEdge: (edgeId) => {
    set({ edges: get().edges.filter((e) => e.id !== edgeId) })
  },

  selectNode: (nodeId) => {
    set({ selectedNodeIds: [nodeId] })
  },

  deselectAll: () => {
    set({ selectedNodeIds: [], selectedEdgeIds: [] })
  },

  setViewMode: (mode) => {
    set({ viewMode: mode })
  },

  setExpandedNode: (nodeId) => {
    set({ expandedNodeId: nodeId })
  },
}))
```

- [ ] **Step 5: Run test to verify it passes**

```bash
npm run test:run -- tests/lib/store/canvas-store.test.ts
```
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/lib/store/canvas-store.ts tests/lib/store/canvas-store.test.ts
git commit -m "feat: add viewMode and expandedNodeId to canvas store"
```

---

### Task 5: Enhance PageNode with Progressive Disclosure

**Files:**
- Modify: `src/components/canvas/nodes/PageNode.tsx`
- Test: `tests/components/canvas/page-node.test.tsx`

- [ ] **Step 1: Read current file**

```bash
cat src/components/canvas/nodes/PageNode.tsx
```

- [ ] **Step 2: Write the failing test**

```typescript
// tests/components/canvas/page-node.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ReactFlowProvider } from '@xyflow/react'
import PageNode from '@/components/canvas/nodes/PageNode'
import { useCanvasStore } from '@/lib/store/canvas-store'

describe('PageNode', () => {
  const mockData = {
    id: 'node-1',
    label: 'Landing Page',
    volume: 12500,
    spend: 2450,
    conversion: 0.032,
    campaign: 'Summer Sale',
    url: '/landing/summer',
  }

  const renderWithProvider = (component: React.ReactNode) => {
    return render(<ReactFlowProvider>{component}</ReactFlowProvider>)
  }

  it('should show compact view by default', () => {
    renderWithProvider(<PageNode id="node-1" data={mockData} selected={false} />)
    expect(screen.getByText('Landing Page')).toBeInTheDocument()
    expect(screen.getByText('12.5K')).toBeInTheDocument()
    expect(screen.getByText('$2,450')).toBeInTheDocument()
  })

  it('should expand on click', () => {
    renderWithProvider(<PageNode id="node-1" data={mockData} selected={false} />)
    const node = screen.getByText('Landing Page').closest('.bg-white')
    fireEvent.click(node!)
    expect(screen.getByText('Volume:')).toBeInTheDocument()
    expect(screen.getByText('Conversion:')).toBeInTheDocument()
  })

  it('should show campaign badge when campaign exists', () => {
    renderWithProvider(<PageNode id="node-1" data={mockData} selected={false} />)
    expect(screen.getByText('Summer Sale')).toBeInTheDocument()
  })

  it('should not show spend when spend is undefined', () => {
    const dataWithoutSpend = { ...mockData, spend: undefined }
    renderWithProvider(<PageNode id="node-1" data={dataWithoutSpend} selected={false} />)
    expect(screen.queryByText('$2,450')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

```bash
npm run test:run -- tests/components/canvas/page-node.test.tsx
```
Expected: FAIL (expanded state not implemented)

- [ ] **Step 4: Update PageNode with progressive disclosure**

```typescript
// src/components/canvas/nodes/PageNode.tsx
'use client'

import { memo, useState, useCallback } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { cn } from '@/lib/utils/helpers'
import { formatVolume, formatCurrency, formatPercentage, formatROI } from '@/lib/canvas/formatters'
import type { FunnelNode } from '@/types/canvas'
import { useCanvasStore } from '@/lib/store/canvas-store'
import { colors, shadows, typography, motion } from '@/lib/design/tokens'

function PageNode({ id, data, selected }: NodeProps<FunnelNode>) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { expandedNodeId, setExpandedNode } = useCanvasStore()

  const handleClick = useCallback(() => {
    const newExpanded = !isExpanded
    setIsExpanded(newExpanded)
    setExpandedNode(newExpanded ? id : null)
  }, [isExpanded, id, setExpandedNode])

  const isCurrentlyExpanded = expandedNodeId === id

  return (
    <div
      className={cn(
        'bg-white rounded-lg min-w-[200px] transition-all duration-200 ease-out cursor-pointer',
        isCurrentlyExpanded ? 'w-[280px]' : 'w-[200px]',
        selected ? 'border-2 border-blue-500' : 'border-2 border-gray-200',
      )}
      style={{
        boxShadow: isCurrentlyExpanded ? shadows.panel : shadows.node,
        transition: `all ${motion.base} ${motion.easing}`,
      }}
      onClick={handleClick}
    >
      <Handle type="target" position={Position.Left} className="w-3 h-3" />

      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <span
            className="font-medium text-sm truncate"
            style={{ fontFamily: typography.fontFamily, fontSize: typography.sizes.sm }}
          >
            {data.label}
          </span>
          {data.campaign && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
              {data.campaign}
            </span>
          )}
        </div>

        {!isCurrentlyExpanded ? (
          // Compact view
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Volume</span>
              <span className="font-medium">{formatVolume(data.volume)}</span>
            </div>

            {data.spend !== undefined && data.spend > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Spend</span>
                <span className="font-medium">{formatCurrency(data.spend)}</span>
              </div>
            )}
          </div>
        ) : (
          // Expanded view
          <div className="space-y-2 mt-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Volume:</span>
              <span className="font-medium">{formatVolume(data.volume)}</span>
            </div>
            {data.spend !== undefined && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Spend:</span>
                <span className="font-medium">{formatCurrency(data.spend)}</span>
              </div>
            )}
            {data.conversion !== undefined && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Conv:</span>
                <span className="font-medium">{formatPercentage(data.conversion)}</span>
              </div>
            )}
            {data.revenue !== undefined && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Revenue:</span>
                <span className="font-medium">{formatCurrency(data.revenue)}</span>
              </div>
            )}
            {data.roi !== undefined && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">ROI:</span>
                <span className="font-medium" style={{ color: data.roi >= 0 ? colors.success : colors.danger }}>
                  {formatROI(data.roi)}
                </span>
              </div>
            )}

            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-400 truncate">{data.url}</p>
              {data.campaign && (
                <p className="text-xs text-gray-500 mt-1">🎯 {data.campaign}</p>
              )}
            </div>

            <div className="flex gap-2 mt-3">
              <button
                className="flex-1 px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  // View details action
                }}
              >
                View Details
              </button>
              <button
                className="flex-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  // Edit node action
                }}
              >
                Edit
              </button>
            </div>
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </div>
  )
}

export default memo(PageNode)
```

- [ ] **Step 5: Run test to verify it passes**

```bash
npm run test:run -- tests/components/canvas/page-node.test.tsx
```
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/canvas/nodes/PageNode.tsx tests/components/canvas/page-node.test.tsx
git commit -m "feat: add progressive disclosure to PageNode"
```

---

### Task 6: Enhance FunnelEdge with Dynamic Styling

**Files:**
- Modify: `src/components/canvas/edges/FunnelEdge.tsx`
- Test: `tests/components/canvas/funnel-edge.test.tsx`

- [ ] **Step 1: Read current file**

```bash
cat src/components/canvas/edges/FunnelEdge.tsx
```

- [ ] **Step 2: Write the failing test**

```typescript
// tests/components/canvas/funnel-edge.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ReactFlowProvider } from '@xyflow/react'
import FunnelEdge from '@/components/canvas/edges/FunnelEdge'

describe('FunnelEdge', () => {
  const renderWithProvider = (component: React.ReactNode) => {
    return render(<ReactFlowProvider>{component}</ReactFlowProvider>)
  }

  it('should render with correct stroke width based on volume', () => {
    const edgeData = {
      id: 'edge-1',
      source: 'node-1',
      target: 'node-2',
      data: {
        conversion: 0.032,
        traffic: 10000,
      },
    }
    renderWithProvider(<FunnelEdge {...edgeData} selected={false} />)
    const path = screen.getByRole('graphics-symbol')
    expect(path).toHaveAttribute('stroke-width')
  })

  it('should have green color for high conversion', () => {
    const edgeData = {
      id: 'edge-1',
      source: 'node-1',
      target: 'node-2',
      data: {
        conversion: 0.06,
        traffic: 5000,
      },
    }
    renderWithProvider(<FunnelEdge {...edgeData} selected={false} />)
    const path = screen.getByRole('graphics-symbol')
    expect(path).toHaveAttribute('stroke', '#10B981')
  })

  it('should have red color for low conversion', () => {
    const edgeData = {
      id: 'edge-1',
      source: 'node-1',
      target: 'node-2',
      data: {
        conversion: 0.005,
        traffic: 5000,
      },
    }
    renderWithProvider(<FunnelEdge {...edgeData} selected={false} />)
    const path = screen.getByRole('graphics-symbol')
    expect(path).toHaveAttribute('stroke', '#EF4444')
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

```bash
npm run test:run -- tests/components/canvas/funnel-edge.test.tsx
```
Expected: FAIL

- [ ] **Step 4: Update FunnelEdge with dynamic styling**

```typescript
// src/components/canvas/edges/FunnelEdge.tsx
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
import { motion } from '@/lib/design/tokens'

function FunnelEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
  selected,
}: EdgeProps) {
  const { viewMode } = useCanvasStore()

  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const conversionRate = data?.conversion || 0
  const trafficVolume = data?.traffic || 0

  const strokeColor = getEdgeColor(conversionRate)
  const strokeWidth = viewMode === 'map' ? 2 : getEdgeWidth(trafficVolume)

  const isAnimated = viewMode === 'heat'

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth,
          stroke: strokeColor,
          transition: `all ${motion.base} ${motion.easing}`,
        }}
      />

      {isAnimated && (
        <circle r="3" fill={strokeColor}>
          <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} />
        </circle>
      )}

      {viewMode !== 'map' && (
        <EdgeLabelRenderer>
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              transform: `translate(-50%, -50%)`,
            }}
          >
            <div
              className="px-2 py-1 text-xs font-medium bg-white rounded shadow-md border border-gray-200"
              style={{
                color: strokeColor,
                fontSize: '11px',
              }}
            >
              {formatPercentage(conversionRate)}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}

export default memo(FunnelEdge)
```

- [ ] **Step 5: Run test to verify it passes**

```bash
npm run test:run -- tests/components/canvas/funnel-edge.test.tsx
```
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/canvas/edges/FunnelEdge.tsx tests/components/canvas/funnel-edge.test.tsx
git commit -m "feat: add dynamic stroke width and color to FunnelEdge"
```

---

### Task 7: Add View Mode Toggle to Toolbar

**Files:**
- Modify: `src/components/canvas/canvas-controls.tsx`
- Modify: `src/components/canvas/funnel-canvas.tsx`
- Test: `tests/components/canvas/canvas-controls.test.tsx`

- [ ] **Step 1: Read current files**

```bash
cat src/components/canvas/canvas-controls.tsx
cat src/components/canvas/funnel-canvas.tsx
```

- [ ] **Step 2: Write the failing test**

```typescript
// tests/components/canvas/canvas-controls.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CanvasControls } from '@/components/canvas/canvas-controls'

describe('CanvasControls', () => {
  it('should have view mode toggle buttons', () => {
    const props = {
      onAddNode: vi.fn(),
      onAutoLayout: vi.fn(),
      onResetZoom: vi.fn(),
      onExport: vi.fn(),
    }
    render(<CanvasControls {...props} />)
    expect(screen.getByText('Map')).toBeInTheDocument()
    expect(screen.getByText('Metrics')).toBeInTheDocument()
    expect(screen.getByText('Heat')).toBeInTheDocument()
  })

  it('should call onViewModeChange when toggle clicked', () => {
    const onViewModeChange = vi.fn()
    const props = {
      onAddNode: vi.fn(),
      onAutoLayout: vi.fn(),
      onResetZoom: vi.fn(),
      onExport: vi.fn(),
      onViewModeChange,
    }
    render(<CanvasControls {...props} />)
    fireEvent.click(screen.getByText('Heat'))
    expect(onViewModeChange).toHaveBeenCalledWith('heat')
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

```bash
npm run test:run -- tests/components/canvas/canvas-controls.test.tsx
```
Expected: FAIL

- [ ] **Step 4: Update CanvasControls**

```typescript
// src/components/canvas/canvas-controls.tsx
import { Plus, LayoutGrid, Maximize, Download, Map, BarChart3, Flame } from 'lucide-react'
import type { ViewMode } from '@/lib/store/canvas-store'

interface CanvasControlsProps {
  onAddNode: () => void
  onAutoLayout: () => void
  onResetZoom: () => void
  onExport: () => void
  onViewModeChange?: (mode: ViewMode) => void
}

export function CanvasControls({
  onAddNode,
  onAutoLayout,
  onResetZoom,
  onExport,
  onViewModeChange,
}: CanvasControlsProps) {
  return (
    <div className="absolute top-4 left-4 z-10 flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg shadow-md">
      {/* View Mode Toggle */}
      <div className="flex items-center gap-1 mr-2 pr-2 border-r border-gray-200">
        <button
          onClick={() => onViewModeChange?.('map')}
          className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          title="Map View"
        >
          <Map className="w-4 h-4" />
          Map
        </button>
        <button
          onClick={() => onViewModeChange?.('metrics')}
          className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          title="Metrics View"
        >
          <BarChart3 className="w-4 h-4" />
          Metrics
        </button>
        <button
          onClick={() => onViewModeChange?.('heat')}
          className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          title="Heat View"
        >
          <Flame className="w-4 h-4" />
          Heat
        </button>
      </div>

      <button
        onClick={onAddNode}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-text-primary hover:bg-bg-secondary rounded-md transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Node
      </button>

      <div className="w-px h-6 bg-border-default" />

      <button
        onClick={onAutoLayout}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-md transition-colors"
      >
        <LayoutGrid className="w-4 h-4" />
        Auto Layout
      </button>

      <button
        onClick={onResetZoom}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-text-primary hover:bg-bg-secondary rounded-md transition-colors"
      >
        <Maximize className="w-4 h-4" />
        Reset Zoom
      </button>

      <div className="w-px h-6 bg-border-default" />

      <button
        onClick={onExport}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-text-primary hover:bg-bg-secondary rounded-md transition-colors"
      >
        <Download className="w-4 h-4" />
        Export
      </button>
    </div>
  )
}
```

- [ ] **Step 5: Update funnel-canvas.tsx to wire up view mode**

```typescript
// src/components/canvas/funnel-canvas.tsx
// Add this to the existing component:
const { viewMode, setViewMode } = useCanvasStore()

// Pass to CanvasControls:
<CanvasControls
  onAddNode={handleAddNode}
  onAutoLayout={onLayout}
  onResetZoom={handleResetZoom}
  onExport={handleExport}
  onViewModeChange={setViewMode}
/>
```

- [ ] **Step 6: Run test to verify it passes**

```bash
npm run test:run -- tests/components/canvas/canvas-controls.test.tsx
```
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/components/canvas/canvas-controls.tsx src/components/canvas/funnel-canvas.tsx tests/components/canvas/canvas-controls.test.tsx
git commit -m "feat: add view mode toggle to canvas controls"
```

---

## Phase 2: AI Core (Week 3-4)

### Task 8: Create AI Chat API Route

**Files:**
- Create: `src/app/api/ai/chat/route.ts`
- Test: `tests/app/api/ai/chat/route.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/app/api/ai/chat/route.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/ai/chat/route'

describe('Chat API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return chat response', async () => {
    const mockRequest = {
      json: vi.fn().mockResolvedValue({
        messages: [{ role: 'user', content: 'Add checkout page' }],
        canvasState: { nodes: [], edges: [] },
      }),
    }

    const response = await POST(mockRequest as any)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('message')
  })

  it('should return 400 for invalid input', async () => {
    const mockRequest = {
      json: vi.fn().mockResolvedValue({}),
    }

    const response = await POST(mockRequest as any)
    expect(response.status).toBe(400)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test:run -- tests/app/api/ai/chat/route.test.ts
```
Expected: FAIL

- [ ] **Step 3: Create API route**

```typescript
// src/app/api/ai/chat/route.ts
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const SYSTEM_PROMPT = `You are an AI assistant for a marketing funnel canvas. You can help users:
- Add, remove, or modify nodes (pages, events, conversions)
- Analyze funnel performance
- Identify bottlenecks and suggest improvements
- Answer questions about metrics

Current canvas state will be provided in the conversation.
Respond concisely and offer to take actions on the canvas.`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: 'Invalid request: messages array required' },
        { status: 400 }
      )
    }

    const canvasContext = body.canvasState
      ? `Current canvas has ${body.canvasState.nodes?.length || 0} nodes and ${body.canvasState.edges?.length || 0} edges.`
      : ''

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...(canvasContext ? [{ role: 'system', content: canvasContext }] : []),
        ...body.messages,
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const message = completion.choices[0].message

    return NextResponse.json({
      message: {
        role: message.role,
        content: message.content,
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat' },
      { status: 500 }
    )
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm run test:run -- tests/app/api/ai/chat/route.test.ts
```
Expected: PASS (may need to mock OpenAI)

- [ ] **Step 5: Commit**

```bash
git add src/app/api/ai/chat/route.ts tests/app/api/ai/chat/route.test.ts
git commit -m "feat: create AI chat API endpoint"
```

---

### Task 9: Create AI Chat Panel Component

**Files:**
- Create: `src/components/canvas/panels/AIChatPanel.tsx`
- Create: `src/hooks/use-ai-chat.ts`
- Test: `tests/components/canvas/ai-chat-panel.test.tsx`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/components/canvas/ai-chat-panel.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AIChatPanel from '@/components/canvas/panels/AIChatPanel'

describe('AIChatPanel', () => {
  it('should render chat interface', () => {
    render(<AIChatPanel isOpen={true} onClose={vi.fn()} />)
    expect(screen.getByText('AI Assistant')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/type a command/i)).toBeInTheDocument()
  })

  it('should send message on submit', async () => {
    render(<AIChatPanel isOpen={true} onClose={vi.fn()} />)
    const input = screen.getByPlaceholderText(/type a command/i)
    const sendButton = screen.getByRole('button', { name: /send/i })

    fireEvent.change(input, { target: { value: 'Add checkout page' } })
    fireEvent.click(sendButton)

    await waitFor(() => {
      expect(screen.getByText('Add checkout page')).toBeInTheDocument()
    })
  })

  it('should call onClose when close button clicked', () => {
    const onClose = vi.fn()
    render(<AIChatPanel isOpen={true} onClose={onClose} />)
    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test:run -- tests/components/canvas/ai-chat-panel.test.tsx
```
Expected: FAIL

- [ ] **Step 3: Create use-ai-chat hook**

```typescript
// src/hooks/use-ai-chat.ts
'use client'

import { useState, useCallback } from 'react'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
}

export function useAiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(async (content: string, canvasState?: any) => {
    setIsProcessing(true)
    setError(null)

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content }],
          canvasState,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: data.message.content || '',
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      return assistantMessage
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return {
    messages,
    isProcessing,
    error,
    sendMessage,
    clearMessages,
  }
}
```

- [ ] **Step 4: Create AIChatPanel component**

```typescript
// src/components/canvas/panels/AIChatPanel.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Send, Bot } from 'lucide-react'
import { useAiChat } from '@/hooks/use-ai-chat'
import { useCanvasStore } from '@/lib/store/canvas-store'
import { motion } from '@/lib/design/tokens'

interface AIChatPanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function AIChatPanel({ isOpen, onClose }: AIChatPanelProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { messages, isProcessing, sendMessage } = useAiChat()
  const { nodes, edges } = useCanvasStore()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isProcessing) return

    try {
      await sendMessage(input.trim(), { nodes, edges })
      setInput('')
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed right-0 top-0 h-full w-[320px] bg-white shadow-xl border-l border-gray-200 z-50 flex flex-col"
      style={{
        transition: `transform ${motion.slow} ${motion.easing}`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-600" />
          <h2 className="text-sm font-semibold text-gray-900">AI Assistant</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 text-sm mt-8">
            <p>Ask me to help with your funnel!</p>
            <p className="mt-2 text-xs">Try: "Add checkout page" or "Find bottlenecks"</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-500">
              Thinking...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a command..."
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={isProcessing || !input.trim()}
            className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  )
}
```

- [ ] **Step 5: Run test to verify it passes**

```bash
npm run test:run -- tests/components/canvas/ai-chat-panel.test.tsx
```
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/canvas/panels/AIChatPanel.tsx src/hooks/use-ai-chat.ts tests/components/canvas/ai-chat-panel.test.tsx
git commit -m "feat: add AI chat panel component"
```

---

## Phase 3: Analytics Integration (Week 5-6)

### Task 10: Create PostHog Sync Utility

**Files:**
- Create: `src/lib/analytics/posthog-sync.ts`
- Create: `src/app/api/analytics/posthog/route.ts`
- Test: `tests/lib/analytics/posthog-sync.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/lib/analytics/posthog-sync.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchFunnelPaths, fetchPageViews } from '@/lib/analytics/posthog-sync'

describe('PostHog Sync', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch funnel paths', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        results: [{ nodes: ['Home', 'Product', 'Checkout'], occurrences: 1234 }],
      }),
    })

    const paths = await fetchFunnelPaths('project-123', 30)
    expect(paths).toHaveLength(1)
    expect(paths[0].nodes).toEqual(['Home', 'Product', 'Checkout'])
  })

  it('should fetch page views', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        results: [{ count: 5000, event: '$pageview' }],
      }),
    })

    const views = await fetchPageViews('project-123')
    expect(views).toBeDefined()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test:run -- tests/lib/analytics/posthog-sync.test.ts
```
Expected: FAIL

- [ ] **Step 3: Create PostHog sync utility**

```typescript
// src/lib/analytics/posthog-sync.ts
const POSTHOG_API_BASE = 'https://us.i.posthog.com/api'
const POSTHOG_PROJECT_ID = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_ID
const POSTHOG_API_KEY = process.env.POSTHOG_API_KEY

export interface FunnelPath {
  nodes: string[]
  occurrences: number
}

export interface PageViewData {
  url: string
  count: number
}

export async function fetchFunnelPaths(
  projectId: string,
  days: number = 30
): Promise<FunnelPath[]> {
  const response = await fetch(
    `${POSTHOG_API_BASE}/projects/${POSTHOG_PROJECT_ID}/insights/funnel/`,
    {
      headers: {
        'Authorization': `Bearer ${POSTHOG_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch funnel paths')
  }

  const data = await response.json()
  return data.results?.map((result: any) => ({
    nodes: result.nodes || [],
    occurrences: result.occurrences || 0,
  })) || []
}

export async function fetchPageViews(projectId: string): Promise<PageViewData[]> {
  const response = await fetch(
    `${POSTHOG_API_BASE}/projects/${POSTHOG_PROJECT_ID}/events/`,
    {
      headers: {
        'Authorization': `Bearer ${POSTHOG_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch page views')
  }

  const data = await response.json()
  return data.results?.map((event: any) => ({
    url: event.properties.$current_url,
    count: event.count,
  })) || []
}
```

- [ ] **Step 4: Create API route**

```typescript
// src/app/api/analytics/posthog/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { fetchFunnelPaths, fetchPageViews } from '@/lib/analytics/posthog-sync'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const projectId = searchParams.get('projectId')
    const days = parseInt(searchParams.get('days') || '30')

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID required' },
        { status: 400 }
      )
    }

    const [paths, pageViews] = await Promise.all([
      fetchFunnelPaths(projectId, days),
      fetchPageViews(projectId),
    ])

    return NextResponse.json({
      paths,
      pageViews,
      lastSyncedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('PostHog API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch PostHog data' },
      { status: 500 }
    )
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

```bash
npm run test:run -- tests/lib/analytics/posthog-sync.test.ts
```
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/lib/analytics/posthog-sync.ts src/app/api/analytics/posthog/route.ts tests/lib/analytics/posthog-sync.test.ts
git commit -m "feat: add PostHog sync utility and API"
```

---

## Phase 4: Polish (Week 7-8)

### Task 11: Add Framer Motion Animations

**Files:**
- Install: `npm install framer-motion`
- Modify: `src/components/canvas/nodes/PageNode.tsx`
- Test: Manual testing

- [ ] **Step 1: Install Framer Motion**

```bash
npm install framer-motion
```

- [ ] **Step 2: Update PageNode with spring animations**

```typescript
// Add to imports
import { motion } from 'framer-motion'

// Replace the div wrapper with motion.div
<motion.div
  className={cn(...)}
  initial={{ scale: 0.95, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  exit={{ scale: 0.95, opacity: 0 }}
  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
  onClick={handleClick}
>
  {/* ... rest of content */}
</motion.div>
```

- [ ] **Step 3: Test animations manually**

```bash
npm run dev
```
Navigate to canvas, add/remove nodes, verify smooth animations.

- [ ] **Step 4: Commit**

```bash
git add src/components/canvas/nodes/PageNode.tsx
git commit -m "feat: add spring animations to nodes"
```

---

### Task 12: Performance Optimization

**Files:**
- Modify: `src/components/canvas/funnel-canvas.tsx`
- Modify: `src/components/canvas/nodes/PageNode.tsx`

- [ ] **Step 1: Add React.memo to all node components**

```typescript
// Already done in PageNode.tsx, verify other nodes
export default memo(PageNode)
export default memo(EventNode)
export default memo(ConversionNode)
```

- [ ] **Step 2: Add virtualization check**

Verify React Flow virtualization is enabled (default in v12).

- [ ] **Step 3: Test performance with 100+ nodes**

```bash
npm run dev
```
Add 100+ nodes, verify 60fps pan/zoom.

- [ ] **Step 4: Commit**

```bash
git add src/components/canvas/
git commit -m "perf: optimize canvas for large funnels"
```

---

## Testing Checklist

- [ ] All unit tests pass: `npm run test:run`
- [ ] Component tests pass: `npm run test:run -- tests/components/`
- [ ] Manual canvas testing with 100+ nodes
- [ ] AI chat integration test
- [ ] PostHog data sync test
- [ ] View mode toggle test
- [ ] Performance benchmark (60fps at 100 nodes)

---

## Documentation Checklist

- [ ] Update README with new features
- [ ] Add canvas usage guide
- [ ] Document AI commands
- [ ] Add API documentation

---

**End of Plan**
