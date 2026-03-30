# AutoFunnel Canvas v2.0 - Unbeatable Design Specification

**Date**: March 29, 2026  
**Status**: Approved  
**Author**: AutoFunnel Team  

---

## 1. Executive Summary

AutoFunnel Canvas v2.0 transforms the current React Flow-based funnel visualization into a **Funnelytics competitor** that surpasses the incumbent in four key pillars:

1. **Visual Polish** — Figma + Linear-grade aesthetics with custom design system
2. **Data Density** — Layered views balancing information with clarity
3. **AI-Native** — Intelligent canvas that builds, optimizes, and suggests
4. **Performance** — 60fps interactions, 500+ node support, sub-second layout

**Positioning**: *"Funnelytics shows you your funnel. AutoFunnel builds it, optimizes it, and tells you what to fix."*

**Target Users**: DTC marketers, infoproduct sellers, growth analysts

**Release Timeline**: 8 weeks (big bang release)

---

## 2. Current State Analysis

### 2.1 Existing Architecture

**Tech Stack**:
- React Flow v12 (`@xyflow/react`)
- ELKjs for auto-layout
- Zustand for state management
- Next.js 14 App Router
- PostHog + Meta Ads integrations

**Current Components**:
- `funnel-canvas.tsx` — Main canvas container
- `PageNode.tsx`, `EventNode.tsx`, `ConversionNode.tsx` — Node types
- `FunnelEdge.tsx` — Edge rendering
- `CanvasControls.tsx` — Toolbar (Add Node, Auto Layout, Reset Zoom, Export)
- `canvas-store.ts` — Zustand state (nodes, edges, selection)

**Current Data Model** (`src/types/funnel.ts`):
- `FunnelNode` — Position, label, volume, spend, conversion, ROI, campaign
- `FunnelEdge` — Source, target, conversion rate, traffic volume
- `FunnelMetadata` — Total spend, revenue, ROI, main campaign

### 2.2 What's Working (Preserve This)

- **Philosophy**: Node-based funnel thinking with data-driven design
- **React Flow foundation**: Solid base for pan/zoom, node/edge rendering
- **Zustand state**: Clean architecture, easy to extend
- **ELK layout**: Algorithmic arrangement works well

### 2.3 What Needs Improvement

- **Visual design**: Generic appearance, not polished enough
- **Missing AI features**: No intelligent assistance
- **Limited analytics**: Static data, no real-time updates
- **No marketing context**: Doesn't feel purpose-built for funnels

---

## 3. Design Pillars

### 3.1 Visual Polish (Figma + Linear Aesthetic)

**Design System**:

| Token | Value |
|-------|-------|
| **Font Family** | Inter (Google Fonts) |
| **Font Sizes** | 11px, 12px, 14px, 16px, 20px, 24px |
| **Font Weights** | 400 (regular), 500 (medium), 600 (semibold) |
| **Line Heights** | 1.4 (body), 1.2 (headings) |
| **Tracking** | -0.01em (headings), 0 (body) |

**Color Palette**:

| Name | Light Mode | Dark Mode | Usage |
|------|------------|-----------|-------|
| Primary | #2563EB | #3B82F6 | Buttons, links, active states |
| Primary Hover | #1D4ED8 | #2563EB | Hover states |
| Success | #10B981 | #34D399 | Positive ROI, good conversion |
| Warning | #F59E0B | #FBBF24 | Neutral metrics, cautions |
| Danger | #EF4444 | #F87171 | Drop-off alerts, negative ROI |
| Canvas BG | #FFFFFF | #0F172A | Main canvas background |
| Node BG | #FFFFFF | #1E293B | Node card background |
| Border | #E5E7EB | #334155 | Borders, dividers |
| Text Primary | #111827 | #F9FAFB | Primary text |
| Text Secondary | #6B7280 | #9CA3AF | Labels, metadata |

**Shadow Elevations**:

```css
/* Node elevation (default) */
shadow-node: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)

/* Panel elevation (toolbars, sidebars) */
shadow-panel: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)

/* Modal elevation (dialogs, dropdowns) */
shadow-modal: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)
```

**Motion Design**:

| Animation | Duration | Easing | Use Case |
|-----------|----------|--------|----------|
| Fast | 150ms | ease-out | Hover states, icon transitions |
| Base | 200ms | ease-out | Button clicks, panel slides |
| Slow | 300ms | ease-in-out | Modals, major layout changes |
| Spring | — | spring(400, 100, 10) | Node add/remove, drag release |

**Micro-interactions**:
- Button hover: Subtle scale (1.02) + background transition
- Node hover: Border highlight (2px primary color) + shadow elevation
- Edge hover: Stroke width increase (2px → 4px) + glow effect
- Panel slide: Smooth translate + opacity fade

---

### 3.2 Data Density (Layered Views)

**Three View Modes** (toggle via toolbar):

#### View Mode 1: Map View
**Purpose**: Presentations, client sharing, high-level overview

**Node Display**:
- Label (page name)
- Icon (page type)
- Minimal chrome

**Edge Display**:
- Simple connection lines (1px, gray)
- No labels, no thickness variation

**Use Case**: "Show me the funnel structure without noise"

#### View Mode 2: Metrics View (Default)
**Purpose**: Daily analysis, optimization work

**Node Display**:
- Label + campaign badge
- Volume (visitors)
- Spend (if available)
- Conversion rate

**Edge Display**:
- Color-coded by conversion rate
- Labels showing conversion %
- Medium thickness (2px base)

**Use Case**: "Show me what's working and what's not"

#### View Mode 3: Heat View
**Purpose**: Deep analysis, bottleneck identification

**Node Display**:
- Full metric suite (volume, spend, conversion, revenue, ROI)
- Border pulse on low-performers (<2% conversion)
- Background tint by performance (green→yellow→red at 10% opacity)

**Edge Display**:
- Thickness = traffic volume (log scale: 1px-8px)
- Color gradient = conversion rate (red #EF4444 → green #10B981)
- Animated particles showing flow direction

**Use Case**: "Show me exactly where I'm losing customers"

---

### 3.3 Node Design (Progressive Disclosure)

#### Default State (Compact: 200x100px)

```
┌─────────────────────────┐
│ 📄 Landing Page         │
│                         │
│ 👥 12.5K   │ 💰 $2.4K  │
│                         │
│ ─────────────────────── │
│ 🎯 Campaign: Summer     │
└─────────────────────────┘
```

**Elements**:
- Icon + Label (top, truncated at 20 chars)
- Primary metric row (volume + spend)
- Divider line
- Campaign badge (if applicable)

**Styling**:
- Background: White (#FFFFFF)
- Border: 2px gray (#E5E7EB), 2px primary (#2563EB) when selected
- Shadow: `shadow-node`
- Padding: 12px

#### Expanded State (on click: 280x180px)

```
┌──────────────────────────────────┐
│ 📄 Landing Page            [⚙️] │
│                                  │
│ 👥 Volume:     12,543           │
│ 💰 Spend:      $2,450           │
│ 📈 Conv:       3.2%             │
│ 💵 Revenue:    $8,920           │
│ 📊 ROI:        264%             │
│                                  │
│ 🎯 Campaign: Summer Sale        │
│ 🔗 /landing/summer-promo        │
│                                  │
│ [View Details]  [Edit Node]     │
└──────────────────────────────────┘
```

**Elements**:
- Settings icon (top-right, opens context menu)
- Full metric grid (5 rows)
- Campaign + URL info
- Action buttons

**Animation**:
- Expand duration: 200ms ease-out
- Smooth height transition
- Fade-in for additional content

---

### 3.4 Edge Design (Intelligent Connections)

**Base Styling**:
- Type: Smoothstep (rounded corners)
- Animated: True (subtle flow animation)
- Default stroke: 2px

**Dynamic Properties**:

| Metric | Visual Encoding |
|--------|-----------------|
| Traffic Volume | Stroke width (1px-8px, log scale) |
| Conversion Rate | Stroke color (red→yellow→green) |
| Drop-off Severity | Dashed pattern (high drop-off) |

**Color Thresholds**:

| Conversion Rate | Color |
|-----------------|-------|
| >5% | #10B981 (Green) |
| 3-5% | #34D399 (Light Green) |
| 1-3% | #F59E0B (Amber) |
| <1% | #EF4444 (Red) |

**Hover State**:
- Stroke width increases by 2px
- Glow effect (4px shadow, primary color at 30% opacity)
- Label appears (if hidden by default)

**Edge Labels**:
- Conversion rate (%)
- Traffic volume (optional toggle)
- Position: Center of edge, white background with shadow

---

### 3.5 AI-Native Features

#### Feature 1: Auto-Detect Funnel

**Trigger**: Project load or manual "Detect Funnel" button

**Process**:
1. Fetch top 50 paths from PostHog (last 30 days)
2. Send to AI with prompt: "Identify the most common user journey patterns"
3. AI returns 3 funnel variations with confidence scores
4. User selects one or requests regeneration

**AI Prompt Template**:
```
You are a funnel detection expert. Analyze these user paths and identify
the most common journey patterns. Return 3 funnel variations.

Input format:
- paths: Array of {nodes: string[], occurrences: number}
- campaigns: Array of {id, name, spend, landingUrl}
- conversionUrls: string[]

Output format:
- variations: Array of {
    name: string,
    confidence: number (0-1),
    nodes: Array of {label, url, type, estimatedVolume},
    edges: Array of {source, target, estimatedConversion}
  }
```

**UI Flow**:
```
┌─────────────────────────────────┐
│ 🔍 Funnel Detection Complete   │
├─────────────────────────────────┤
│                                 │
│ I found 3 common patterns:     │
│                                 │
│ 1. Landing → Product → Checkout│
│    Confidence: 87%             │
│    Volume: 12,543 users        │
│                                 │
│ 2. Landing → Blog → Product →  │
│    Checkout                    │
│    Confidence: 64%             │
│    Volume: 4,821 users         │
│                                 │
│ 3. Facebook Ad → Landing →     │
│    Checkout                    │
│    Confidence: 52%             │
│    Volume: 2,103 users         │
│                                 │
│ [Use #1] [Use #2] [Use #3]     │
│ [Regenerate] [Cancel]          │
└─────────────────────────────────┘
```

---

#### Feature 2: AI Chat Sidebar

**UI Layout**:
```
┌─────────────────────────────┐
│ 🤖 AI Assistant         [✕] │
├─────────────────────────────┤
│                             │
│ [Conversation history]      │
│                             │
│ ─────────────────────────── │
│ > Type a command...     [→] │
└─────────────────────────────┘
```

**Width**: 320px (collapsible)
**Position**: Right sidebar (docked)

**Supported Commands**:

| Command | Action |
|---------|--------|
| "Add [page type] after [node]" | Creates new node + edge |
| "Remove [node name]" | Deletes node + connected edges |
| "Show me drop-off points" | Highlights edges <2% conversion |
| "What's the ROI of [campaign]?" | Shows campaign metrics |
| "Optimize this path" | Analyzes and suggests improvements |
| "Compare [campaign A] vs [campaign B]" | Side-by-side comparison |
| "Find bottlenecks" | Highlights nodes with high drop-off |

**Response Types**:
- **Action confirmation**: "Done! Added Checkout node after Cart"
- **Data query**: Table or chart inline
- **Suggestion**: Highlighted nodes + explanation
- **Clarification**: "Which campaign did you mean?" with options

**Technical Implementation**:
- OpenAI GPT-4o or Anthropic Claude 3.5 (user-configurable)
- System prompt includes current canvas state
- Function calling for canvas operations
- Streaming responses for long answers

---

#### Feature 3: Command Palette (Cmd+K)

**UI Layout**:
```
┌─────────────────────────────────────┐
│ 🔍 [Type a command or search...]    │
├─────────────────────────────────────┤
│ ACTIONS                             │
│ > Add Page Node                     │
│   Add Event Node                    │
│   Auto Layout                       │
│   Show Drop-off                     │
├─────────────────────────────────────┤
│ NODES                               │
│   Landing Page                      │
│   Product Page                      │
│   Checkout                          │
├─────────────────────────────────────┤
│ AI COMMANDS                         │
│   Optimize Current Path             │
│   Find Bottlenecks                  │
│   Generate Report                   │
└─────────────────────────────────────┘
```

**Width**: 480px
**Position**: Centered modal overlay
**Max Height**: 400px (scrollable)

**Keyboard Navigation**:
- Cmd+K: Open
- ↑/↓: Navigate options
- Enter: Execute
- Escape: Close

**Categories**:
- **Actions**: Canvas operations (add node, layout, export)
- **Nodes**: Quick node creation
- **Views**: Toggle view modes
- **AI Commands**: AI-powered actions
- **Navigation**: Jump to specific node

---

#### Feature 4: Smart Annotations

**Auto-Generated Insights**:

| Trigger | Annotation |
|---------|------------|
| Node conversion <2% | Red border pulse + "Low conversion" badge |
| Edge drop-off >80% | Dashed edge + "High drop-off" label |
| No tracking detected | "⚠️ No Meta pixel on this page" |
| ROI <100% | "⚠️ Negative ROI: $X spent, $Y revenue" |
| Sudden traffic spike | "📈 Traffic +45% vs last period" |

**User-Added Notes**:
- Right-click any node/edge → "Add Note"
- Sticky note style (yellow background)
- Editable, deletable
- Toggle visibility

---

#### Feature 5: Bottleneck Detection

**AI Analysis** (on-demand or periodic):

**Prompt Template**:
```
Analyze this funnel for bottlenecks and optimization opportunities.

Input:
- nodes: Array of {label, volume, conversion, spend, revenue}
- edges: Array of {source, target, conversionRate, volume}

Output:
- bottlenecks: Array of {
    type: "node" | "edge",
    id: string,
    severity: "high" | "medium" | "low",
    issue: string,
    suggestion: string,
    estimatedImpact: string
  }
```

**UI Presentation**:
```
┌─────────────────────────────────┐
│ 📊 Bottleneck Analysis          │
├─────────────────────────────────┤
│                                 │
│ 🔴 HIGH SEVERITY (2)            │
│                                 │
│ 1. Product Page → Cart         │
│    Issue: 78% drop-off          │
│    Suggestion: Add trust badges │
│    Impact: +15% conversion est. │
│                                 │
│ 2. Checkout Page               │
│    Issue: 45% cart abandonment  │
│    Suggestion: Simplify form    │
│    Impact: +22% conversion est. │
│                                 │
│ 🟡 MEDIUM SEVERITY (1)          │
│                                 │
│ 1. Landing Page                │
│    Issue: Below avg. CTR (1.2%) │
│    Suggestion: Test new headline│
│    Impact: +8% conversion est.  │
│                                 │
│ [Apply All Suggestions] [Close] │
└─────────────────────────────────┘
```

---

### 3.6 Analytics Integration

#### PostHog Sync

**Data Sources**:
- **Events**: Page views, clicks, custom events
- **Paths**: User journey sequences
- **Persons**: Cohort segmentation
- **Insights**: Pre-computed metrics

**Sync Strategy**:
- **Initial load**: Fetch last 30 days on project open
- **Incremental updates**: WebSocket subscription for real-time
- **Cache**: SWR with 5-minute stale time

**API Endpoints**:
```
GET /api/integrations/posthog/paths?projectId=X&days=30
GET /api/integrations/posthog/events?projectId=X&event=$pageview
GET /api/integrations/posthog/insights?projectId=X
```

#### Meta Ads Attribution

**Data Sources**:
- **Campaigns**: Name, spend, impressions, clicks
- **Ad Sets**: Targeting, budget allocation
- **Ads**: Creative, copy, performance
- **Conversions**: Pixel events, attributed revenue

**Attribution Models**:
- **First-click**: Credit to first touchpoint
- **Last-click**: Credit to final touchpoint
- **Linear**: Equal credit across all touchpoints
- **Time-decay**: More credit to recent touchpoints

**UI: Campaign Attribution Panel**:
```
┌─────────────────────────────────┐
│ 🎯 Campaign Attribution          │
├─────────────────────────────────┤
│ Edge: Landing → Product         │
│                                 │
│ Traffic: 12,543 users           │
│                                 │
│ Campaigns Driving This Path:    │
│ ─────────────────────────────── │
│ 1. Summer Sale (Facebook)       │
│    💰 Spend: $1,250             │
│    👥 Clicks: 4,821             │
│    📊 % of Path: 38%            │
│                                 │
│ 2. Google Search - Brand        │
│    💰 Spend: $890               │
│    👥 Clicks: 3,912             │
│    📊 % of Path: 31%            │
│                                 │
│ 3. Email - Newsletter           │
│    💰 Spend: $0                 │
│    👥 Clicks: 3,810             │
│    📊 % of Path: 31%            │
│                                 │
│ Attribution Model: [Last-click▼]│
└─────────────────────────────────┘
```

#### Computed Metrics

**Formulas**:
```
Conversion Rate = (Conversions / Visitors) × 100
ROI = ((Revenue - Spend) / Spend) × 100
CAC = Total Spend / Total Conversions
LTV = Average Order Value × Repeat Purchase Rate × Avg Lifespan
Drop-off Rate = 100 - Conversion Rate
```

**Aggregations**:
- Total funnel volume (sum of entry nodes)
- Overall conversion rate (end nodes / entry nodes)
- Total spend (sum of all campaign spend)
- Total revenue (sum of conversion node revenue)
- Average ROI (weighted by volume)

---

## 4. Technical Architecture

### 4.1 Component Hierarchy

```
src/components/canvas/
├── funnel-canvas.tsx          # Main container
├── canvas-controls.tsx        # Toolbar (existing, enhanced)
├── command-palette/
│   ├── CommandPalette.tsx     # NEW: Cmd+K interface
│   └── CommandItem.tsx        # Individual command
├── nodes/
│   ├── PageNode.tsx           # Enhanced with progressive disclosure
│   ├── EventNode.tsx          # Event-specific styling
│   ├── ConversionNode.tsx     # Conversion highlighting
│   └── NodeHandle.tsx         # Shared handle component
├── edges/
│   ├── FunnelEdge.tsx         # Enhanced with thickness/color
│   └── EdgeLabel.tsx          # Metric labels
├── panels/
│   ├── ToolbarPanel.tsx       # View toggles, settings
│   ├── MetricsPanel.tsx       # Aggregate stats
│   ├── AIChatPanel.tsx        # NEW: AI sidebar
│   └── AttributionPanel.tsx   # NEW: Campaign breakdown
└── overlays/
    ├── BottleneckOverlay.tsx  # NEW: Highlight overlays
    └── NoteOverlay.tsx        # NEW: Sticky notes
```

### 4.2 New Libraries

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.0.0",
    "framer-motion": "^11.0.0",
    "@uiw/react-md-editor": "^4.0.0"
  }
}
```

**Rationale**:
- **React Query**: Better data fetching than SWR for complex queries
- **Framer Motion**: Spring animations, gesture support
- **MD Editor**: AI chat markdown rendering (optional, can use simple markdown)

### 4.3 State Management

**Zustand Stores**:

```typescript
// Canvas State (existing, enhanced)
interface CanvasState {
  nodes: FunnelNode[]
  edges: FunnelEdge[]
  selectedNodeIds: string[]
  selectedEdgeIds: string[]
  viewMode: 'map' | 'metrics' | 'heat'
  expandedNodeId: string | null
}

// AI State (NEW)
interface AIState {
  isChatOpen: boolean
  messages: ChatMessage[]
  isProcessing: boolean
  detectedFunnels: DetectedFunnel[]
  bottlenecks: Bottleneck[]
}

// Analytics State (NEW)
interface AnalyticsState {
  posthogData: PostHogData | null
  metaData: MetaData | null
  lastSyncAt: Date | null
  isLoading: boolean
  error: string | null
}
```

### 4.4 API Routes

**New Endpoints**:

```
POST /api/ai/detect-funnel      # Auto-detect from PostHog data
POST /api/ai/chat               # Chat completion
POST /api/ai/analyze-bottlenecks # Bottleneck detection
GET  /api/analytics/posthog     # PostHog data proxy
GET  /api/analytics/meta        # Meta Ads data proxy
GET  /api/analytics/attribution # Attribution calculation
```

### 4.5 Performance Optimizations

**Rendering**:
- Virtualized node rendering (React Flow built-in)
- Memoized node components (`React.memo`)
- Selective re-renders (only changed nodes)
- Debounced layout updates (100ms)

**Data**:
- Web Workers for AI + layout computation
- Incremental data loading (pagination for large datasets)
- Cache with SWR/React Query
- WebSocket for real-time updates

**Targets**:
| Metric | Target |
|--------|--------|
| Initial load | <2s |
| Auto-layout (100 nodes) | <500ms |
| Pan/zoom FPS | 60fps |
| AI response time | <3s |
| Max supported nodes | 500 |

---

## 5. Implementation Plan

### Phase 1: Foundation (Week 1-2)

**Goals**: Design system, node/edge refactor, view toggles

**Tasks**:
- [ ] Add Inter font, define design tokens
- [ ] Implement color palette, shadows, motion
- [ ] Refactor PageNode with progressive disclosure
- [ ] Enhance FunnelEdge with thickness/color
- [ ] Add view mode toggle (Map/Metrics/Heat)
- [ ] Update Zustand store with viewMode state

**Deliverables**:
- Custom design system in `src/lib/design/tokens.ts`
- Enhanced node components
- Working view toggle

---

### Phase 2: AI Core (Week 3-4)

**Goals**: Chat, commands, auto-detect

**Tasks**:
- [ ] Build AIChatPanel component
- [ ] Implement OpenAI/Anthropic integration
- [ ] Create natural language parser
- [ ] Build CommandPalette with Cmd+K
- [ ] Implement funnel detection AI
- [ ] Add bottleneck analyzer

**Deliverables**:
- Working AI chat sidebar
- Command palette
- Auto-detect funnel flow
- Bottleneck detection

---

### Phase 3: Analytics (Week 5-6)

**Goals**: Real-time data, attribution

**Tasks**:
- [ ] PostHog API integration
- [ ] Meta Ads API integration
- [ ] Real-time sync with WebSocket
- [ ] Attribution calculation logic
- [ ] Attribution panel UI
- [ ] Computed metrics (ROI, CAC, LTV)

**Deliverables**:
- Live data on canvas
- Campaign attribution panel
- Accurate metric calculations

---

### Phase 4: Polish (Week 7-8)

**Goals**: Motion, performance, testing

**Tasks**:
- [ ] Framer Motion integration
- [ ] Spring animations for node add/remove
- [ ] Performance optimization (virtualization, memoization)
- [ ] Smart annotations
- [ ] End-to-end testing
- [ ] Bug fixes

**Deliverables**:
- Polished, production-ready canvas
- Performance benchmarks met
- Test coverage >80%

---

## 6. Success Criteria

### Functional Requirements

| Requirement | Acceptance Criteria |
|-------------|---------------------|
| Auto-detect funnel | Suggests 3 variations with >80% accuracy |
| AI chat | Responds to 10+ command types |
| View modes | All 3 modes render correctly |
| Real-time data | Updates within 5s of PostHog event |
| Performance | 60fps at 100 nodes |
| Scale | Supports 500 nodes without crash |

### Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Initial load time | <2s |
| Auto-layout (100 nodes) | <500ms |
| AI response time | <3s average |
| Bundle size increase | <100KB |
| Test coverage | >80% |

### User Experience Goals

- [ ] "This feels as polished as Figma"
- [ ] "The AI actually understands what I want"
- [ ] "I can see exactly where I'm losing customers"
- [ ] "It's fast even with my huge funnel"

---

## 7. Open Questions

| Question | Decision Needed |
|----------|-----------------|
| AI Provider default | OpenAI vs Anthropic? |
| PostHog-only or multi-source? | GA4, Segment support? |
| Pricing tiers | Gate features or all-in? |
| Dark mode | v2.0 or v2.1? |

---

## 8. Appendix

### A. Competitive Analysis

**Funnelytics Strengths**:
- First-mover in visual funnel mapping
- Simple, approachable UI
- Good educational content

**Funnelytics Weaknesses**:
- No AI assistance
- Limited real-time data
- Generic visual design
- No campaign attribution

**Our Differentiation**:
- AI-native (auto-detect, chat, suggestions)
- Deep PostHog + Meta integration
- Premium design (Figma + Linear polish)
- Advanced attribution modeling

### B. Metric Formatters

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

### C. Edge Color Scale

```typescript
// src/lib/canvas/colors.ts

export function getEdgeColor(conversionRate: number): string {
  if (conversionRate >= 0.05) return '#10B981'      // Green
  if (conversionRate >= 0.03) return '#34D399'      // Light Green
  if (conversionRate >= 0.01) return '#F59E0B'      // Amber
  return '#EF4444'                                   // Red
}

export function getEdgeWidth(volume: number): number {
  // Log scale for better visual distribution
  const logVolume = Math.log10(volume + 1)
  return Math.min(8, Math.max(1, logVolume))
}
```

---

**End of Specification**
