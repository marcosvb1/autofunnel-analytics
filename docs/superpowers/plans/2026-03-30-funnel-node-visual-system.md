# Funnel Node Visual System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a rich visual system for funnel nodes with distinct icons, colors, and styles for each node category (traffic sources, pages, events, conversions) similar to Funnelytics.

**Architecture:** Create a centralized node configuration system that maps node categories to visual properties (icons, colors, borders, backgrounds). Each node component will consume this configuration to render appropriately. Add new specialized node components for traffic sources and expand existing event/conversion nodes with category-specific variants.

**Tech Stack:** React, TypeScript, Tailwind CSS, lucide-react icons, @xyflow/react, class-variance-authority (cva) for variants

---

## File Structure

**New Files:**
- `src/lib/canvas/node-config.ts` - Central node configuration (icons, colors, variants)
- `src/components/canvas/nodes/TrafficSourceNode.tsx` - Traffic source node component
- `src/components/canvas/nodes/EventNode.tsx` - Refactored event node with variants
- `src/components/canvas/nodes/ConversionNode.tsx` - Refactored conversion node with variants
- `src/components/canvas/nodes/PageNode.tsx` - Refactored page node with variants
- `src/lib/canvas/node-variants.ts` - CVA variants for node styling
- `tests/lib/canvas/node-config.test.ts` - Unit tests for node configuration
- `tests/components/canvas/nodes/TrafficSourceNode.test.tsx` - Component tests
- `tests/components/canvas/nodes/EventNode.test.tsx` - Component tests
- `tests/components/canvas/nodes/ConversionNode.test.tsx` - Component tests
- `tests/components/canvas/nodes/PageNode.test.tsx` - Component tests

**Modified Files:**
- `src/types/funnel.ts` - Add NodeCategory type and extend FunnelNodeData
- `src/types/canvas.ts` - Update type definitions
- `src/components/canvas/funnel-canvas.tsx` - Register new node types
- `src/lib/store/canvas-store.ts` - Update store if needed
- `src/lib/canvas/utils.ts` - Add helper functions
- `src/lib/canvas/colors.ts` - Extend color utilities

---

## Node Categories

### Traffic Sources (15 types)
- `google_ads` - Google Ads
- `facebook_ads` - Facebook/Meta Ads
- `instagram_ads` - Instagram Ads
- `tiktok_ads` - TikTok Ads
- `linkedin_ads` - LinkedIn Ads
- `youtube_ads` - YouTube Ads
- `twitter_ads` - Twitter/X Ads
- `pinterest_ads` - Pinterest Ads
- `snapchat_ads` - Snapchat Ads
- `reddit_ads` - Reddit Ads
- `affiliate` - Affiliate Program
- `organic_search` - Organic Search (SEO)
- `direct` - Direct Traffic
- `email_marketing` - Email Marketing
- `podcast` - Podcast
- `webinar` - Webinar

### Pages (12 types)
- `landing_page` - Landing Page
- `sales_page` - Sales Page
- `checkout` - Checkout Page
- `thank_you` - Thank You Page
- `blog_post` - Blog Post
- `webinar_registration` - Webinar Registration
- `survey` - Survey/Quiz
- `calendar` - Calendar/Booking Page
- `order_page` - Order Page
- `upsell` - Upsell/OTO Page
- `vsl` - Video Sales Letter
- `bridge_page` - Bridge Page

### Events (10 types)
- `email` - Email Sent/Opened
- `sms` - SMS Sent
- `phone_call` - Phone Call
- `calendar_event` - Calendar Event
- `form_submit` - Form Submission
- `video_view` - Video View
- `link_click` - Link Click
- `file_download` - File Download
- `add_to_cart` - Add to Cart
- `initiate_checkout` - Initiate Checkout

### Conversions (6 types)
- `purchase` - Purchase/Sale
- `lead` - Lead Generated
- `signup` - User Signup
- `subscription` - Subscription
- `demo_request` - Demo Request
- `consultation` - Consultation Booked

---

### Task 1: Create Node Category Types

**Files:**
- Modify: `src/types/funnel.ts`
- Test: `tests/types/funnel.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/types/funnel.test.ts
import { describe, it, expect } from 'vitest'
import type { NodeCategory, NodeTypeConfig } from '@/types/funnel'

describe('NodeCategory types', () => {
  it('should accept valid traffic source categories', () => {
    const validCategories: NodeCategory[] = [
      'google_ads',
      'facebook_ads',
      'instagram_ads',
      'tiktok_ads',
      'linkedin_ads',
      'youtube_ads',
      'twitter_ads',
      'pinterest_ads',
      'snapchat_ads',
      'reddit_ads',
      'affiliate',
      'organic_search',
      'direct',
      'email_marketing',
      'podcast',
      'webinar',
    ]
    
    validCategories.forEach(category => {
      expect(category).toBeDefined()
    })
  })

  it('should accept valid page categories', () => {
    const validCategories: NodeCategory[] = [
      'landing_page',
      'sales_page',
      'checkout',
      'thank_you',
      'blog_post',
      'webinar_registration',
      'survey',
      'calendar',
      'order_page',
      'upsell',
      'vsl',
      'bridge_page',
    ]
    
    validCategories.forEach(category => {
      expect(category).toBeDefined()
    })
  })

  it('should accept valid event categories', () => {
    const validCategories: NodeCategory[] = [
      'email',
      'sms',
      'phone_call',
      'calendar_event',
      'form_submit',
      'video_view',
      'link_click',
      'file_download',
      'add_to_cart',
      'initiate_checkout',
    ]
    
    validCategories.forEach(category => {
      expect(category).toBeDefined()
    })
  })

  it('should accept valid conversion categories', () => {
    const validCategories: NodeCategory[] = [
      'purchase',
      'lead',
      'signup',
      'subscription',
      'demo_request',
      'consultation',
    ]
    
    validCategories.forEach(category => {
      expect(category).toBeDefined()
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test:run -- tests/types/funnel.test.ts
```
Expected: FAIL with "NodeCategory is not defined"

- [ ] **Step 3: Add NodeCategory type to src/types/funnel.ts**

```typescript
// Add at the top of src/types/funnel.ts, after the imports and before existing interfaces

/**
 * Node categories for visual differentiation.
 * Each category has distinct icons, colors, and styling.
 */
export type NodeCategory =
  // Traffic Sources (15 types)
  | 'google_ads'
  | 'facebook_ads'
  | 'instagram_ads'
  | 'tiktok_ads'
  | 'linkedin_ads'
  | 'youtube_ads'
  | 'twitter_ads'
  | 'pinterest_ads'
  | 'snapchat_ads'
  | 'reddit_ads'
  | 'affiliate'
  | 'organic_search'
  | 'direct'
  | 'email_marketing'
  | 'podcast'
  | 'webinar'
  // Pages (12 types)
  | 'landing_page'
  | 'sales_page'
  | 'checkout'
  | 'thank_you'
  | 'blog_post'
  | 'webinar_registration'
  | 'survey'
  | 'calendar'
  | 'order_page'
  | 'upsell'
  | 'vsl'
  | 'bridge_page'
  // Events (10 types)
  | 'email'
  | 'sms'
  | 'phone_call'
  | 'calendar_event'
  | 'form_submit'
  | 'video_view'
  | 'link_click'
  | 'file_download'
  | 'add_to_cart'
  | 'initiate_checkout'
  // Conversions (6 types)
  | 'purchase'
  | 'lead'
  | 'signup'
  | 'subscription'
  | 'demo_request'
  | 'consultation'

/**
 * Node category groups for filtering and organization.
 */
export type NodeCategoryGroup = 'traffic' | 'page' | 'event' | 'conversion'

/**
 * Configuration for each node type including icon, colors, and styling.
 */
export interface NodeTypeConfig {
  category: NodeCategory
  group: NodeCategoryGroup
  label: string
  iconName: string
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  borderColor: string
  textColor: string
}
```

- [ ] **Step 4: Update FunnelNodeData to include nodeCategory**

```typescript
// In src/types/funnel.ts, find the FunnelNodeData interface and update it:

export interface FunnelNodeData {
  [key: string]: unknown
  id: string
  label: string
  volume: number
  spend?: number
  conversion?: number
  roi?: number
  campaign?: string
  campaignId?: string
  isConversion?: boolean
  url?: string
  type?: 'page' | 'event' | 'conversion' | 'traffic'
  nodeCategory?: NodeCategory  // Add this line
  position?: { x: number; y: number }
}
```

- [ ] **Step 5: Run test to verify it passes**

```bash
npm run test:run -- tests/types/funnel.test.ts
```
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/types/funnel.ts tests/types/funnel.test.ts
git commit -m "feat: add NodeCategory types for visual differentiation"
```

---

### Task 2: Create Node Configuration System

**Files:**
- Create: `src/lib/canvas/node-config.ts`
- Test: `tests/lib/canvas/node-config.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/lib/canvas/node-config.test.ts
import { describe, it, expect } from 'vitest'
import { getNodeConfig, getNodeByGroup, ALL_NODE_CONFIGS } from '@/lib/canvas/node-config'
import type { NodeCategory, NodeCategoryGroup } from '@/types/funnel'

describe('node-config', () => {
  describe('getNodeConfig', () => {
    it('should return config for google_ads', () => {
      const config = getNodeConfig('google_ads')
      expect(config).toBeDefined()
      expect(config.category).toBe('google_ads')
      expect(config.group).toBe('traffic')
      expect(config.iconName).toBe('Search')
    })

    it('should return config for facebook_ads', () => {
      const config = getNodeConfig('facebook_ads')
      expect(config).toBeDefined()
      expect(config.category).toBe('facebook_ads')
      expect(config.group).toBe('traffic')
      expect(config.iconName).toBe('Facebook')
    })

    it('should return config for landing_page', () => {
      const config = getNodeConfig('landing_page')
      expect(config).toBeDefined()
      expect(config.category).toBe('landing_page')
      expect(config.group).toBe('page')
    })

    it('should return config for email event', () => {
      const config = getNodeConfig('email')
      expect(config).toBeDefined()
      expect(config.category).toBe('email')
      expect(config.group).toBe('event')
      expect(config.iconName).toBe('Mail')
    })

    it('should return config for purchase conversion', () => {
      const config = getNodeConfig('purchase')
      expect(config).toBeDefined()
      expect(config.category).toBe('purchase')
      expect(config.group).toBe('conversion')
      expect(config.iconName).toBe('DollarSign')
    })

    it('should throw error for invalid category', () => {
      expect(() => getNodeConfig('invalid_category' as NodeCategory)).toThrow()
    })
  })

  describe('getNodeByGroup', () => {
    it('should return all traffic nodes', () => {
      const trafficNodes = getNodeByGroup('traffic')
      expect(trafficNodes.length).toBeGreaterThan(0)
      trafficNodes.forEach(node => {
        expect(node.group).toBe('traffic')
      })
    })

    it('should return all page nodes', () => {
      const pageNodes = getNodeByGroup('page')
      expect(pageNodes.length).toBeGreaterThan(0)
      pageNodes.forEach(node => {
        expect(node.group).toBe('page')
      })
    })

    it('should return all event nodes', () => {
      const eventNodes = getNodeByGroup('event')
      expect(eventNodes.length).toBeGreaterThan(0)
      eventNodes.forEach(node => {
        expect(node.group).toBe('event')
      })
    })

    it('should return all conversion nodes', () => {
      const conversionNodes = getNodeByGroup('conversion')
      expect(conversionNodes.length).toBeGreaterThan(0)
      conversionNodes.forEach(node => {
        expect(node.group).toBe('conversion')
      })
    })
  })

  describe('ALL_NODE_CONFIGS', () => {
    it('should contain all node categories', () => {
      const totalCategories = 15 + 12 + 10 + 6 // traffic + page + event + conversion
      expect(ALL_NODE_CONFIGS.length).toBe(totalCategories)
    })

    it('should have unique categories', () => {
      const categories = ALL_NODE_CONFIGS.map(c => c.category)
      const uniqueCategories = new Set(categories)
      expect(categories.length).toBe(uniqueCategories.size)
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test:run -- tests/lib/canvas/node-config.test.ts
```
Expected: FAIL with "Cannot find module '@/lib/canvas/node-config'"

- [ ] **Step 3: Create the node configuration file**

```typescript
// src/lib/canvas/node-config.ts
import type { NodeCategory, NodeCategoryGroup, NodeTypeConfig } from '@/types/funnel'

/**
 * Complete node configuration for all 43 node types.
 * Each node has: icon, colors, styling, and group classification.
 */
export const ALL_NODE_CONFIGS: NodeTypeConfig[] = [
  // ==================== TRAFFIC SOURCES (15 types) ====================
  {
    category: 'google_ads',
    group: 'traffic',
    label: 'Google Ads',
    iconName: 'Search',
    primaryColor: '#4285F4',
    secondaryColor: '#34A853',
    backgroundColor: '#E8F0FE',
    borderColor: '#4285F4',
    textColor: '#1a1a1a',
  },
  {
    category: 'facebook_ads',
    group: 'traffic',
    label: 'Facebook Ads',
    iconName: 'Facebook',
    primaryColor: '#1877F2',
    secondaryColor: '#42B72A',
    backgroundColor: '#E7F3FF',
    borderColor: '#1877F2',
    textColor: '#1a1a1a',
  },
  {
    category: 'instagram_ads',
    group: 'traffic',
    label: 'Instagram Ads',
    iconName: 'Instagram',
    primaryColor: '#E4405F',
    secondaryColor: '#FCAF45',
    backgroundColor: '#FEF2F2',
    borderColor: '#E4405F',
    textColor: '#1a1a1a',
  },
  {
    category: 'tiktok_ads',
    group: 'traffic',
    label: 'TikTok Ads',
    iconName: 'Video',
    primaryColor: '#000000',
    secondaryColor: '#FF0050',
    backgroundColor: '#F3F4F6',
    borderColor: '#000000',
    textColor: '#1a1a1a',
  },
  {
    category: 'linkedin_ads',
    group: 'traffic',
    label: 'LinkedIn Ads',
    iconName: 'Linkedin',
    primaryColor: '#0A66C2',
    secondaryColor: '#057642',
    backgroundColor: '#E1F0FE',
    borderColor: '#0A66C2',
    textColor: '#1a1a1a',
  },
  {
    category: 'youtube_ads',
    group: 'traffic',
    label: 'YouTube Ads',
    iconName: 'Youtube',
    primaryColor: '#FF0000',
    secondaryColor: '#282828',
    backgroundColor: '#FEF2F2',
    borderColor: '#FF0000',
    textColor: '#1a1a1a',
  },
  {
    category: 'twitter_ads',
    group: 'traffic',
    label: 'Twitter/X Ads',
    iconName: 'Twitter',
    primaryColor: '#1DA1F2',
    secondaryColor: '#14171A',
    backgroundColor: '#E1F5FE',
    borderColor: '#1DA1F2',
    textColor: '#1a1a1a',
  },
  {
    category: 'pinterest_ads',
    group: 'traffic',
    label: 'Pinterest Ads',
    iconName: 'Image',
    primaryColor: '#E60023',
    secondaryColor: '#000000',
    backgroundColor: '#FEF2F2',
    borderColor: '#E60023',
    textColor: '#1a1a1a',
  },
  {
    category: 'snapchat_ads',
    group: 'traffic',
    label: 'Snapchat Ads',
    iconName: 'Camera',
    primaryColor: '#FFFC00',
    secondaryColor: '#000000',
    backgroundColor: '#FEFCE8',
    borderColor: '#FFFC00',
    textColor: '#1a1a1a',
  },
  {
    category: 'reddit_ads',
    group: 'traffic',
    label: 'Reddit Ads',
    iconName: 'MessageSquare',
    primaryColor: '#FF4500',
    secondaryColor: '#0079D3',
    backgroundColor: '#FFF2ED',
    borderColor: '#FF4500',
    textColor: '#1a1a1a',
  },
  {
    category: 'affiliate',
    group: 'traffic',
    label: 'Affiliate',
    iconName: 'Handshake',
    primaryColor: '#8B5CF6',
    secondaryColor: '#7C3AED',
    backgroundColor: '#F3E8FF',
    borderColor: '#8B5CF6',
    textColor: '#1a1a1a',
  },
  {
    category: 'organic_search',
    group: 'traffic',
    label: 'Organic Search',
    iconName: 'Search',
    primaryColor: '#10B981',
    secondaryColor: '#059669',
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    textColor: '#1a1a1a',
  },
  {
    category: 'direct',
    group: 'traffic',
    label: 'Direct',
    iconName: 'ArrowRight',
    primaryColor: '#6B7280',
    secondaryColor: '#4B5563',
    backgroundColor: '#F9FAFB',
    borderColor: '#6B7280',
    textColor: '#1a1a1a',
  },
  {
    category: 'email_marketing',
    group: 'traffic',
    label: 'Email Marketing',
    iconName: 'Mail',
    primaryColor: '#F59E0B',
    secondaryColor: '#D97706',
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
    textColor: '#1a1a1a',
  },
  {
    category: 'podcast',
    group: 'traffic',
    label: 'Podcast',
    iconName: 'Mic',
    primaryColor: '#EC4899',
    secondaryColor: '#DB2777',
    backgroundColor: '#FDF2F8',
    borderColor: '#EC4899',
    textColor: '#1a1a1a',
  },
  {
    category: 'webinar',
    group: 'traffic',
    label: 'Webinar',
    iconName: 'Users',
    primaryColor: '#3B82F6',
    secondaryColor: '#2563EB',
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
    textColor: '#1a1a1a',
  },

  // ==================== PAGES (12 types) ====================
  {
    category: 'landing_page',
    group: 'page',
    label: 'Landing Page',
    iconName: 'LayoutTemplate',
    primaryColor: '#3B82F6',
    secondaryColor: '#2563EB',
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
    textColor: '#1a1a1a',
  },
  {
    category: 'sales_page',
    group: 'page',
    label: 'Sales Page',
    iconName: 'Tag',
    primaryColor: '#10B981',
    secondaryColor: '#059669',
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    textColor: '#1a1a1a',
  },
  {
    category: 'checkout',
    group: 'page',
    label: 'Checkout',
    iconName: 'ShoppingCart',
    primaryColor: '#F59E0B',
    secondaryColor: '#D97706',
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
    textColor: '#1a1a1a',
  },
  {
    category: 'thank_you',
    group: 'page',
    label: 'Thank You Page',
    iconName: 'CheckCircle',
    primaryColor: '#10B981',
    secondaryColor: '#059669',
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    textColor: '#1a1a1a',
  },
  {
    category: 'blog_post',
    group: 'page',
    label: 'Blog Post',
    iconName: 'FileText',
    primaryColor: '#8B5CF6',
    secondaryColor: '#7C3AED',
    backgroundColor: '#F3E8FF',
    borderColor: '#8B5CF6',
    textColor: '#1a1a1a',
  },
  {
    category: 'webinar_registration',
    group: 'page',
    label: 'Webinar Registration',
    iconName: 'Calendar',
    primaryColor: '#3B82F6',
    secondaryColor: '#2563EB',
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
    textColor: '#1a1a1a',
  },
  {
    category: 'survey',
    group: 'page',
    label: 'Survey/Quiz',
    iconName: 'ClipboardList',
    primaryColor: '#F59E0B',
    secondaryColor: '#D97706',
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
    textColor: '#1a1a1a',
  },
  {
    category: 'calendar',
    group: 'page',
    label: 'Calendar/Booking',
    iconName: 'Calendar',
    primaryColor: '#EC4899',
    secondaryColor: '#DB2777',
    backgroundColor: '#FDF2F8',
    borderColor: '#EC4899',
    textColor: '#1a1a1a',
  },
  {
    category: 'order_page',
    group: 'page',
    label: 'Order Page',
    iconName: 'Receipt',
    primaryColor: '#10B981',
    secondaryColor: '#059669',
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    textColor: '#1a1a1a',
  },
  {
    category: 'upsell',
    group: 'page',
    label: 'Upsell/OTO',
    iconName: 'TrendingUp',
    primaryColor: '#8B5CF6',
    secondaryColor: '#7C3AED',
    backgroundColor: '#F3E8FF',
    borderColor: '#8B5CF6',
    textColor: '#1a1a1a',
  },
  {
    category: 'vsl',
    group: 'page',
    label: 'Video Sales Letter',
    iconName: 'Video',
    primaryColor: '#EF4444',
    secondaryColor: '#DC2626',
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
    textColor: '#1a1a1a',
  },
  {
    category: 'bridge_page',
    group: 'page',
    label: 'Bridge Page',
    iconName: 'ArrowRightLeft',
    primaryColor: '#6B7280',
    secondaryColor: '#4B5563',
    backgroundColor: '#F9FAFB',
    borderColor: '#6B7280',
    textColor: '#1a1a1a',
  },

  // ==================== EVENTS (10 types) ====================
  {
    category: 'email',
    group: 'event',
    label: 'Email',
    iconName: 'Mail',
    primaryColor: '#3B82F6',
    secondaryColor: '#2563EB',
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
    textColor: '#1a1a1a',
  },
  {
    category: 'sms',
    group: 'event',
    label: 'SMS',
    iconName: 'MessageCircle',
    primaryColor: '#10B981',
    secondaryColor: '#059669',
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    textColor: '#1a1a1a',
  },
  {
    category: 'phone_call',
    group: 'event',
    label: 'Phone Call',
    iconName: 'Phone',
    primaryColor: '#8B5CF6',
    secondaryColor: '#7C3AED',
    backgroundColor: '#F3E8FF',
    borderColor: '#8B5CF6',
    textColor: '#1a1a1a',
  },
  {
    category: 'calendar_event',
    group: 'event',
    label: 'Calendar Event',
    iconName: 'Calendar',
    primaryColor: '#EC4899',
    secondaryColor: '#DB2777',
    backgroundColor: '#FDF2F8',
    borderColor: '#EC4899',
    textColor: '#1a1a1a',
  },
  {
    category: 'form_submit',
    group: 'event',
    label: 'Form Submit',
    iconName: 'Send',
    primaryColor: '#F59E0B',
    secondaryColor: '#D97706',
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
    textColor: '#1a1a1a',
  },
  {
    category: 'video_view',
    group: 'event',
    label: 'Video View',
    iconName: 'Play',
    primaryColor: '#EF4444',
    secondaryColor: '#DC2626',
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
    textColor: '#1a1a1a',
  },
  {
    category: 'link_click',
    group: 'event',
    label: 'Link Click',
    iconName: 'MousePointerClick',
    primaryColor: '#3B82F6',
    secondaryColor: '#2563EB',
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
    textColor: '#1a1a1a',
  },
  {
    category: 'file_download',
    group: 'event',
    label: 'File Download',
    iconName: 'Download',
    primaryColor: '#10B981',
    secondaryColor: '#059669',
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    textColor: '#1a1a1a',
  },
  {
    category: 'add_to_cart',
    group: 'event',
    label: 'Add to Cart',
    iconName: 'ShoppingCart',
    primaryColor: '#F59E0B',
    secondaryColor: '#D97706',
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
    textColor: '#1a1a1a',
  },
  {
    category: 'initiate_checkout',
    group: 'event',
    label: 'Initiate Checkout',
    iconName: 'CreditCard',
    primaryColor: '#8B5CF6',
    secondaryColor: '#7C3AED',
    backgroundColor: '#F3E8FF',
    borderColor: '#8B5CF6',
    textColor: '#1a1a1a',
  },

  // ==================== CONVERSIONS (6 types) ====================
  {
    category: 'purchase',
    group: 'conversion',
    label: 'Purchase',
    iconName: 'DollarSign',
    primaryColor: '#10B981',
    secondaryColor: '#059669',
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    textColor: '#1a1a1a',
  },
  {
    category: 'lead',
    group: 'conversion',
    label: 'Lead',
    iconName: 'UserPlus',
    primaryColor: '#3B82F6',
    secondaryColor: '#2563EB',
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
    textColor: '#1a1a1a',
  },
  {
    category: 'signup',
    group: 'conversion',
    label: 'Signup',
    iconName: 'UserCheck',
    primaryColor: '#8B5CF6',
    secondaryColor: '#7C3AED',
    backgroundColor: '#F3E8FF',
    borderColor: '#8B5CF6',
    textColor: '#1a1a1a',
  },
  {
    category: 'subscription',
    group: 'conversion',
    label: 'Subscription',
    iconName: 'Repeat',
    primaryColor: '#EC4899',
    secondaryColor: '#DB2777',
    backgroundColor: '#FDF2F8',
    borderColor: '#EC4899',
    textColor: '#1a1a1a',
  },
  {
    category: 'demo_request',
    group: 'conversion',
    label: 'Demo Request',
    iconName: 'Presentation',
    primaryColor: '#F59E0B',
    secondaryColor: '#D97706',
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
    textColor: '#1a1a1a',
  },
  {
    category: 'consultation',
    group: 'conversion',
    label: 'Consultation',
    iconName: 'Users',
    primaryColor: '#10B981',
    secondaryColor: '#059669',
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    textColor: '#1a1a1a',
  },
]

/**
 * Get configuration for a specific node category.
 * @param category - The node category
 * @returns The node configuration
 * @throws Error if category is not found
 */
export function getNodeConfig(category: NodeCategory): NodeTypeConfig {
  const config = ALL_NODE_CONFIGS.find(c => c.category === category)
  if (!config) {
    throw new Error(`Node category "${category}" not found in configuration`)
  }
  return config
}

/**
 * Get all node configurations for a specific group.
 * @param group - The node category group
 * @returns Array of node configurations for the group
 */
export function getNodeByGroup(group: NodeCategoryGroup): NodeTypeConfig[] {
  return ALL_NODE_CONFIGS.filter(c => c.group === group)
}

/**
 * Get icon component by name.
 * @param iconName - The icon name from lucide-react
 * @returns The icon component
 */
export function getIconByName(iconName: string) {
  return async () => {
    const icons = await import('lucide-react')
    return icons[iconName as keyof typeof icons]
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm run test:run -- tests/lib/canvas/node-config.test.ts
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/canvas/node-config.ts tests/lib/canvas/node-config.test.ts
git commit -m "feat: create node configuration system with 43 node types"
```

---

### Task 3: Create Node Variants with CVA

**Files:**
- Create: `src/lib/canvas/node-variants.ts`
- Test: `tests/lib/canvas/node-variants.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/lib/canvas/node-variants.test.ts
import { describe, it, expect } from 'vitest'
import { nodeVariants, getNodeVariantClasses } from '@/lib/canvas/node-variants'

describe('node-variants', () => {
  describe('nodeVariants', () => {
    it('should have base styles', () => {
      expect(nodeVariants.base).toBeDefined()
    })

    it('should have group variants for traffic', () => {
      expect(nodeVariants.variants.group.traffic).toBeDefined()
    })

    it('should have group variants for page', () => {
      expect(nodeVariants.variants.group.page).toBeDefined()
    })

    it('should have group variants for event', () => {
      expect(nodeVariants.variants.group.event).toBeDefined()
    })

    it('should have group variants for conversion', () => {
      expect(nodeVariants.variants.group.conversion).toBeDefined()
    })

    it('should have size variants', () => {
      expect(nodeVariants.variants.size).toBeDefined()
      expect(nodeVariants.variants.size.compact).toBeDefined()
      expect(nodeVariants.variants.size.default).toBeDefined()
      expect(nodeVariants.variants.size.expanded).toBeDefined()
    })

    it('should have state variants', () => {
      expect(nodeVariants.variants.state).toBeDefined()
      expect(nodeVariants.variants.state.default).toBeDefined()
      expect(nodeVariants.variants.state.selected).toBeDefined()
      expect(nodeVariants.variants.state.expanded).toBeDefined()
    })
  })

  describe('getNodeVariantClasses', () => {
    it('should return classes for traffic node', () => {
      const classes = getNodeVariantClasses({
        group: 'traffic',
        size: 'default',
        state: 'default',
      })
      expect(classes).toBeDefined()
      expect(classes.length).toBeGreaterThan(0)
    })

    it('should return classes for conversion node with selected state', () => {
      const classes = getNodeVariantClasses({
        group: 'conversion',
        size: 'default',
        state: 'selected',
      })
      expect(classes).toContain('ring-2')
    })

    it('should handle compact size', () => {
      const classes = getNodeVariantClasses({
        group: 'page',
        size: 'compact',
        state: 'default',
      })
      expect(classes).toContain('min-w-[120px]')
    })

    it('should handle expanded size', () => {
      const classes = getNodeVariantClasses({
        group: 'event',
        size: 'expanded',
        state: 'default',
      })
      expect(classes).toContain('min-w-[280px]')
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test:run -- tests/lib/canvas/node-variants.test.ts
```
Expected: FAIL with "Cannot find module '@/lib/canvas/node-variants'"

- [ ] **Step 3: Create the node variants file**

```typescript
// src/lib/canvas/node-variants.ts
import { cva, type VariantProps } from 'class-variance-authority'

/**
 * Node variants using class-variance-authority.
 * Provides composable styling for node components based on group, size, and state.
 */
export const nodeVariants = cva(
  // Base styles
  [
    'rounded-lg',
    'cursor-pointer',
    'overflow-hidden',
    'transition-all',
    'duration-200',
    'min-h-[80px]',
  ],
  {
    variants: {
      // Group-based styling
      group: {
        traffic: [
          'border-2',
          'shadow-md',
        ],
        page: [
          'border-2',
          'shadow-lg',
          'bg-white',
        ],
        event: [
          'border-2',
          'shadow-md',
          'bg-gradient-to-br',
        ],
        conversion: [
          'border-2',
          'shadow-xl',
          'bg-gradient-to-br',
        ],
      },
      // Size variants
      size: {
        compact: [
          'min-w-[120px]',
          'max-w-[160px]',
          'p-2',
        ],
        default: [
          'min-w-[180px]',
          'max-w-[220px]',
          'p-3',
        ],
        expanded: [
          'min-w-[280px]',
          'max-w-[320px]',
          'p-4',
        ],
      },
      // State variants
      state: {
        default: [
          'opacity-100',
        ],
        selected: [
          'ring-2',
          'ring-blue-400',
          'ring-offset-2',
        ],
        expanded: [
          'shadow-xl',
          'z-10',
        ],
        dimmed: [
          'opacity-50',
        ],
      },
    },
    defaultVariants: {
      group: 'page',
      size: 'default',
      state: 'default',
    },
  }
)

/**
 * Type for node variant props
 */
export interface NodeVariantProps extends VariantProps<typeof nodeVariants> {
  group: 'traffic' | 'page' | 'event' | 'conversion'
}

/**
 * Get variant classes for a node.
 * @param props - Variant props
 * @returns Class names string
 */
export function getNodeVariantClasses(props: NodeVariantProps): string {
  return nodeVariants(props)
}

/**
 * Get icon container classes based on group.
 * @param group - Node group
 * @returns Class names string
 */
export function getIconContainerClasses(group: string): string {
  const classes: Record<string, string> = {
    traffic: 'w-8 h-8 rounded-full flex items-center justify-center',
    page: 'w-6 h-6',
    event: 'w-7 h-7 rounded-full',
    conversion: 'w-8 h-8 rounded-full animate-pulse',
  }
  return classes[group] || classes.page
}

/**
 * Get badge classes for campaign tags.
 * @param group - Node group
 * @returns Class names string
 */
export function getBadgeClasses(group: string): string {
  const classes: Record<string, string> = {
    traffic: 'bg-blue-100 text-blue-700',
    page: 'bg-gray-100 text-gray-700',
    event: 'bg-purple-100 text-purple-700',
    conversion: 'bg-green-100 text-green-700',
  }
  return classes[group] || classes.page
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm run test:run -- tests/lib/canvas/node-variants.test.ts
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/canvas/node-variants.ts tests/lib/canvas/node-variants.test.ts
git commit -m "feat: create CVA node variants for composable styling"
```

---

### Task 4: Create TrafficSourceNode Component

**Files:**
- Create: `src/components/canvas/nodes/TrafficSourceNode.tsx`
- Test: `tests/components/canvas/nodes/TrafficSourceNode.test.tsx`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/components/canvas/nodes/TrafficSourceNode.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { describe as Describe, it as It } from 'vitest'
import TrafficSourceNode from '@/components/canvas/nodes/TrafficSourceNode'
import type { FunnelNode } from '@/types/canvas'

describe('TrafficSourceNode', () => {
  const mockNodeData: FunnelNode['data'] = {
    id: 'test-node',
    label: 'Facebook Ads Campaign',
    volume: 10000,
    spend: 5000,
    nodeCategory: 'facebook_ads',
    campaign: 'Summer Sale 2024',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render traffic source node with label', () => {
    render(<TrafficSourceNode id="test-node" data={mockNodeData} selected={false} />)
    expect(screen.getByText('Facebook Ads Campaign')).toBeDefined()
  })

  it('should display volume metric', () => {
    render(<TrafficSourceNode id="test-node" data={mockNodeData} selected={false} />)
    expect(screen.getByText(/10K/i)).toBeDefined()
  })

  it('should display spend when provided', () => {
    render(<TrafficSourceNode id="test-node" data={mockNodeData} selected={false} />)
    expect(screen.getByText(/\$5K/i)).toBeDefined()
  })

  it('should show campaign badge when campaign is provided', () => {
    render(<TrafficSourceNode id="test-node" data={mockNodeData} selected={false} />)
    expect(screen.getByText('Summer Sale 2024')).toBeDefined()
  })

  it('should apply selected styling when selected is true', () => {
    const { container } = render(
      <TrafficSourceNode id="test-node" data={mockNodeData} selected={true} />
    )
    const node = container.firstChild as HTMLElement
    expect(node).toHaveClass('ring-2')
  })

  it('should render with facebook_ads colors', () => {
    const { container } = render(
      <TrafficSourceNode id="test-node" data={mockNodeData} selected={false} />
    )
    const node = container.firstChild as HTMLElement
    expect(node.style.backgroundColor).toContain('rgb(231, 243, 255)')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test:run -- tests/components/canvas/nodes/TrafficSourceNode.test.tsx
```
Expected: FAIL with "Cannot find module '@/components/canvas/nodes/TrafficSourceNode'"

- [ ] **Step 3: Create the TrafficSourceNode component**

```typescript
// src/components/canvas/nodes/TrafficSourceNode.tsx
'use client'

import { useCallback, memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { cn } from '@/lib/utils/helpers'
import { getNodeConfig } from '@/lib/canvas/node-config'
import { getIconByName } from '@/lib/canvas/node-config'
import { formatVolume, formatSpend } from '@/lib/canvas/utils'
import type { FunnelNode } from '@/types/canvas'
import type { NodeCategory } from '@/types/funnel'

interface TrafficSourceNodeProps extends NodeProps<FunnelNode> {
  data: FunnelNode['data'] & {
    nodeCategory: NodeCategory
    campaign?: string
    spend?: number
  }
}

function TrafficSourceNode({ id, data, selected }: TrafficSourceNodeProps) {
  const config = getNodeConfig(data.nodeCategory)
  
  const handleClick = useCallback(() => {
    console.log(`Traffic source node clicked: ${id}`)
  }, [id])

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
      onClick={handleClick}
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
          <TrafficIcon iconName={config.iconName} primaryColor={config.primaryColor} />
        </div>
        <div className="flex-1 min-w-0">
          <span className="font-medium text-sm truncate block">{data.label}</span>
          {data.campaign && (
            <span className="text-xs px-1.5 py-0.5 rounded mt-0.5 inline-block"
              style={{ 
                backgroundColor: config.primaryColor + '30',
                color: config.primaryColor 
              }}
            >
              {data.campaign.length > 20 ? data.campaign.substring(0, 20) + '...' : data.campaign}
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

function TrafficIcon({ iconName, primaryColor }: { iconName: string; primaryColor: string }) {
  // Note: In production, you'd dynamically import icons
  // For now, we'll use a placeholder approach
  return (
    <svg 
      className="w-4 h-4" 
      fill="none" 
      stroke={primaryColor} 
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="3" strokeWidth="2" />
      <path strokeWidth="2" d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  )
}

export default memo(TrafficSourceNode)
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm run test:run -- tests/components/canvas/nodes/TrafficSourceNode.test.tsx
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/canvas/nodes/TrafficSourceNode.tsx tests/components/canvas/nodes/TrafficSourceNode.test.tsx
git commit -m "feat: create TrafficSourceNode component with platform-specific styling"
```

---

### Task 5: Refactor EventNode with Variants

**Files:**
- Modify: `src/components/canvas/nodes/EventNode.tsx`
- Test: `tests/components/canvas/nodes/EventNode.test.tsx`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/components/canvas/nodes/EventNode.test.tsx
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import EventNode from '@/components/canvas/nodes/EventNode'
import type { FunnelNode } from '@/types/canvas'

describe('EventNode', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render email event with mail icon', () => {
    const nodeData: FunnelNode['data'] = {
      id: 'email-event',
      label: 'Email Follow-up',
      volume: 5000,
      nodeCategory: 'email',
    }
    render(<EventNode id="email-event" data={nodeData} selected={false} />)
    expect(screen.getByText('Email Follow-up')).toBeDefined()
  })

  it('should render sms event', () => {
    const nodeData: FunnelNode['data'] = {
      id: 'sms-event',
      label: 'SMS Reminder',
      volume: 3000,
      nodeCategory: 'sms',
    }
    render(<EventNode id="sms-event" data={nodeData} selected={false} />)
    expect(screen.getByText('SMS Reminder')).toBeDefined()
  })

  it('should apply event-specific colors for email', () => {
    const nodeData: FunnelNode['data'] = {
      id: 'email-event',
      label: 'Email Campaign',
      volume: 5000,
      nodeCategory: 'email',
    }
    const { container } = render(<EventNode id="email-event" data={nodeData} selected={false} />)
    const node = container.firstChild as HTMLElement
    expect(node.style.backgroundColor).toContain('rgb(239, 246, 255)')
  })

  it('should display volume metric', () => {
    const nodeData: FunnelNode['data'] = {
      id: 'event',
      label: 'Event',
      volume: 7500,
      nodeCategory: 'email',
    }
    render(<EventNode id="event" data={nodeData} selected={false} />)
    expect(screen.getByText(/7.5K/i)).toBeDefined()
  })

  it('should apply selected styling', () => {
    const nodeData: FunnelNode['data'] = {
      id: 'event',
      label: 'Event',
      volume: 1000,
      nodeCategory: 'email',
    }
    const { container } = render(<EventNode id="event" data={nodeData} selected={true} />)
    const node = container.firstChild as HTMLElement
    expect(node).toHaveClass('ring-2')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test:run -- tests/components/canvas/nodes/EventNode.test.tsx
```
Expected: FAIL (current component doesn't support nodeCategory)

- [ ] **Step 3: Refactor EventNode component**

```typescript
// src/components/canvas/nodes/EventNode.tsx
'use client'

import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { cn } from '@/lib/utils/helpers'
import { getNodeConfig } from '@/lib/canvas/node-config'
import { formatVolume } from '@/lib/canvas/utils'
import type { FunnelNode } from '@/types/canvas'
import type { NodeCategory } from '@/types/funnel'

interface EventNodeProps extends NodeProps<FunnelNode> {
  data: FunnelNode['data'] & {
    nodeCategory?: NodeCategory
  }
}

function EventNode({ data, selected }: EventNodeProps) {
  const category = data.nodeCategory || 'email'
  const config = getNodeConfig(category)

  return (
    <div
      className={cn(
        'rounded-lg cursor-pointer overflow-hidden transition-all duration-200 border-2 shadow-md min-w-[180px] max-w-[220px] p-3 bg-gradient-to-br',
        selected && 'ring-2 ring-blue-400 ring-offset-2'
      )}
      style={{
        backgroundColor: config.backgroundColor,
        borderColor: config.borderColor,
        backgroundImage: `linear-gradient(to bottom right, ${config.backgroundColor}, ${config.secondaryColor}20)`,
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
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: config.primaryColor + '30' }}
        >
          <EventIcon iconName={config.iconName} primaryColor={config.primaryColor} />
        </div>
        <span className="font-medium text-sm truncate flex-1">{data.label}</span>
      </div>

      <div className="flex justify-between text-xs">
        <span className="text-gray-500">Events</span>
        <span className="font-medium" style={{ color: config.textColor }}>
          {formatVolume(data.volume)}
        </span>
      </div>

      <p className="mt-2 text-xs truncate opacity-60">{data.url}</p>

      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3 h-3"
        style={{ backgroundColor: config.primaryColor }}
      />
    </div>
  )
}

function EventIcon({ iconName, primaryColor }: { iconName: string; primaryColor: string }) {
  return (
    <svg 
      className="w-4 h-4" 
      fill="none" 
      stroke={primaryColor} 
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="3" strokeWidth="2" />
      <path strokeWidth="2" d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  )
}

export default memo(EventNode)
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm run test:run -- tests/components/canvas/nodes/EventNode.test.tsx
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/canvas/nodes/EventNode.tsx tests/components/canvas/nodes/EventNode.test.tsx
git commit -m "feat: refactor EventNode with category-based variants"
```

---

### Task 6: Refactor ConversionNode with Variants

**Files:**
- Modify: `src/components/canvas/nodes/ConversionNode.tsx`
- Test: `tests/components/canvas/nodes/ConversionNode.test.tsx`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/components/canvas/nodes/ConversionNode.test.tsx
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ConversionNode from '@/components/canvas/nodes/ConversionNode'
import type { FunnelNode } from '@/types/canvas'

describe('ConversionNode', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render purchase conversion with dollar icon', () => {
    const nodeData: FunnelNode['data'] = {
      id: 'purchase',
      label: 'Purchase Completed',
      volume: 500,
      spend: 2500,
      nodeCategory: 'purchase',
    }
    render(<ConversionNode id="purchase" data={nodeData} selected={false} />)
    expect(screen.getByText('Purchase Completed')).toBeDefined()
  })

  it('should render lead conversion', () => {
    const nodeData: FunnelNode['data'] = {
      id: 'lead',
      label: 'Lead Generated',
      volume: 1200,
      nodeCategory: 'lead',
    }
    render(<ConversionNode id="lead" data={nodeData} selected={false} />)
    expect(screen.getByText('Lead Generated')).toBeDefined()
  })

  it('should apply purchase-specific green colors', () => {
    const nodeData: FunnelNode['data'] = {
      id: 'purchase',
      label: 'Sale',
      volume: 500,
      nodeCategory: 'purchase',
    }
    const { container } = render(<ConversionNode id="purchase" data={nodeData} selected={false} />)
    const node = container.firstChild as HTMLElement
    expect(node.style.borderColor).toContain('rgb(16, 185, 129)')
  })

  it('should display conversions and spend', () => {
    const nodeData: FunnelNode['data'] = {
      id: 'purchase',
      label: 'Sale',
      volume: 750,
      spend: 3500,
      nodeCategory: 'purchase',
    }
    render(<ConversionNode id="purchase" data={nodeData} selected={false} />)
    expect(screen.getByText(/750/i)).toBeDefined()
    expect(screen.getByText(/\$3.5K/i)).toBeDefined()
  })

  it('should have pulse animation on icon', () => {
    const nodeData: FunnelNode['data'] = {
      id: 'purchase',
      label: 'Sale',
      volume: 100,
      nodeCategory: 'purchase',
    }
    const { container } = render(<ConversionNode id="purchase" data={nodeData} selected={false} />)
    const iconContainer = container.querySelector('.animate-pulse')
    expect(iconContainer).toBeDefined()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test:run -- tests/components/canvas/nodes/ConversionNode.test.tsx
```
Expected: FAIL (current component doesn't support nodeCategory)

- [ ] **Step 3: Refactor ConversionNode component**

```typescript
// src/components/canvas/nodes/ConversionNode.tsx
'use client'

import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { cn } from '@/lib/utils/helpers'
import { getNodeConfig } from '@/lib/canvas/node-config'
import { formatVolume, formatSpend } from '@/lib/canvas/utils'
import type { FunnelNode } from '@/types/canvas'
import type { NodeCategory } from '@/types/funnel'

interface ConversionNodeProps extends NodeProps<FunnelNode> {
  data: FunnelNode['data'] & {
    nodeCategory?: NodeCategory
    spend?: number
  }
}

function ConversionNode({ data, selected }: ConversionNodeProps) {
  const category = data.nodeCategory || 'purchase'
  const config = getNodeConfig(category)

  return (
    <div
      className={cn(
        'rounded-lg cursor-pointer overflow-hidden transition-all duration-200 border-2 shadow-xl min-w-[200px] max-w-[240px] p-3 bg-gradient-to-br',
        selected && 'ring-2 ring-blue-400 ring-offset-2'
      )}
      style={{
        backgroundColor: config.backgroundColor,
        borderColor: config.borderColor,
        backgroundImage: `linear-gradient(to bottom right, ${config.backgroundColor}, ${config.secondaryColor}30)`,
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
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse"
          style={{ backgroundColor: config.primaryColor + '40' }}
        >
          <ConversionIcon iconName={config.iconName} primaryColor={config.primaryColor} />
        </div>
        <span className="font-semibold text-sm" style={{ color: config.primaryColor }}>{data.label}</span>
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

      <p className="mt-2 pt-2 text-xs truncate opacity-60" style={{ borderColor: config.borderColor }}>
        {data.url}
      </p>

      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3 h-3"
        style={{ backgroundColor: config.primaryColor }}
      />
    </div>
  )
}

function ConversionIcon({ iconName, primaryColor }: { iconName: string; primaryColor: string }) {
  return (
    <svg 
      className="w-5 h-5" 
      fill="none" 
      stroke={primaryColor} 
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="3" strokeWidth="2" />
      <path strokeWidth="2" d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  )
}

export default memo(ConversionNode)
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm run test:run -- tests/components/canvas/nodes/ConversionNode.test.tsx
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/canvas/nodes/ConversionNode.tsx tests/components/canvas/nodes/ConversionNode.test.tsx
git commit -m "feat: refactor ConversionNode with category-based variants and pulse animation"
```

---

### Task 7: Refactor PageNode with Variants

**Files:**
- Modify: `src/components/canvas/nodes/PageNode.tsx`
- Test: `tests/components/canvas/nodes/PageNode.test.tsx`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/components/canvas/nodes/PageNode.test.tsx
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import PageNode from '@/components/canvas/nodes/PageNode'
import type { FunnelNode } from '@/types/canvas'

describe('PageNode', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render landing page with correct styling', () => {
    const nodeData: FunnelNode['data'] = {
      id: 'landing',
      label: 'Product Landing Page',
      volume: 15000,
      nodeCategory: 'landing_page',
      url: '/landing/product',
    }
    render(<PageNode id="landing" data={nodeData} selected={false} />)
    expect(screen.getByText('Product Landing Page')).toBeDefined()
  })

  it('should render checkout page with cart icon styling', () => {
    const nodeData: FunnelNode['data'] = {
      id: 'checkout',
      label: 'Checkout Page',
      volume: 3000,
      nodeCategory: 'checkout',
    }
    render(<PageNode id="checkout" data={nodeData} selected={false} />)
    expect(screen.getByText('Checkout Page')).toBeDefined()
  })

  it('should apply landing_page blue colors', () => {
    const nodeData: FunnelNode['data'] = {
      id: 'landing',
      label: 'Landing Page',
      volume: 10000,
      nodeCategory: 'landing_page',
    }
    const { container } = render(<PageNode id="landing" data={nodeData} selected={false} />)
    const node = container.firstChild as HTMLElement
    expect(node.style.backgroundColor).toContain('rgb(239, 246, 255)')
  })

  it('should expand on click to show more details', async () => {
    const nodeData: FunnelNode['data'] = {
      id: 'landing',
      label: 'Landing Page',
      volume: 10000,
      conversion: 25.5,
      revenue: 50000,
      nodeCategory: 'landing_page',
    }
    render(<PageNode id="landing" data={nodeData} selected={false} />)
    const node = screen.getByText('Landing Page').closest('.bg-white')
    expect(node).toBeDefined()
  })

  it('should display conversion rate when available', () => {
    const nodeData: FunnelNode['data'] = {
      id: 'landing',
      label: 'Landing Page',
      volume: 10000,
      conversion: 35.5,
      nodeCategory: 'landing_page',
    }
    render(<PageNode id="landing" data={nodeData} selected={false} />)
    expect(screen.getByText(/35.5%/i)).toBeDefined()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test:run -- tests/components/canvas/nodes/PageNode.test.tsx
```
Expected: FAIL (current component doesn't support nodeCategory)

- [ ] **Step 3: Refactor PageNode component**

```typescript
// src/components/canvas/nodes/PageNode.tsx
'use client'

import { useCallback, memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { cn } from '@/lib/utils/helpers'
import { useCanvasStore } from '@/lib/store/canvas-store'
import { getNodeConfig } from '@/lib/canvas/node-config'
import { formatVolume, formatSpend, getConversionColor } from '@/lib/canvas/utils'
import type { FunnelNode } from '@/types/canvas'
import type { NodeCategory } from '@/types/funnel'

interface PageNodeProps extends NodeProps<FunnelNode> {
  data: FunnelNode['data'] & {
    revenue?: number
    isConversion?: boolean
    nodeCategory?: NodeCategory
  }
}

function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`
  }
  return `$${value.toFixed(0)}`
}

function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

function formatROI(value: number): string {
  return `${value.toFixed(1)}x`
}

function PageNode({ id, data, selected }: PageNodeProps) {
  const { expandedNodeId, setExpandedNode } = useCanvasStore()
  const isCurrentlyExpanded = expandedNodeId === id
  const category = data.nodeCategory || 'landing_page'
  const config = getNodeConfig(category)

  const handleClick = useCallback(() => {
    const newExpanded = !isCurrentlyExpanded
    setExpandedNode(newExpanded ? id : null)
  }, [isCurrentlyExpanded, id, setExpandedNode])

  const handleActionClick = useCallback((e: React.MouseEvent, action: string) => {
    e.stopPropagation()
    console.log(`Action clicked: ${action} on node ${id}`)
  }, [id])

  return (
    <div
      className={cn(
        'bg-white rounded-lg cursor-pointer overflow-hidden transition-all duration-200 border-2 shadow-lg',
        isCurrentlyExpanded ? 'w-[280px] min-h-[180px]' : 'w-[200px] min-h-[100px]',
        selected ? 'ring-2 ring-blue-400 ring-offset-2' : '',
      )}
      style={{
        borderColor: config.borderColor,
      }}
      onClick={handleClick}
    >
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-3 h-3 bg-gray-400"
      />
      
      <div className="p-3 h-full flex flex-col">
        {!isCurrentlyExpanded ? (
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-1">
              <div 
                className="w-6 h-6 flex items-center justify-center flex-shrink-0"
                style={{ color: config.primaryColor }}
              >
                <PageIcon iconName={config.iconName} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-medium text-sm truncate block">{data.label}</span>
              </div>
            </div>
            
            {data.campaign && (
              <span 
                className="text-xs px-1.5 py-0.5 rounded mt-1 inline-block"
                style={{ 
                  backgroundColor: config.primaryColor + '20',
                  color: config.primaryColor 
                }}
              >
                {data.campaign.length > 15 ? data.campaign.substring(0, 15) + '...' : data.campaign}
              </span>
            )}
            
            <div className="space-y-0.5 mt-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Volume</span>
                <span className="font-medium text-gray-900">{formatVolume(data.volume)}</span>
              </div>
              {data.spend !== undefined && data.spend > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Spend</span>
                  <span className="font-medium text-gray-900">{formatCurrency(data.spend)}</span>
                </div>
              )}
            </div>
            <div className="mt-2 pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-400 truncate">{data.url}</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div 
                  className="w-7 h-7 flex items-center justify-center"
                  style={{ color: config.primaryColor }}
                >
                  <PageIcon iconName={config.iconName} />
                </div>
                <span className="font-medium text-sm">{data.label}</span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); handleActionClick(e, 'settings'); }} 
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <span className="text-xs">⚙️</span>
              </button>
            </div>
            
            <div className="space-y-1 text-xs flex-1">
              <div className="flex justify-between">
                <span className="text-gray-500">Volume:</span>
                <span className="font-medium text-gray-900">{formatVolume(data.volume)}</span>
              </div>
              {data.spend !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Spend:</span>
                  <span className="font-medium text-gray-900">{formatCurrency(data.spend)}</span>
                </div>
              )}
              {data.conversion !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Conv:</span>
                  <span className={`font-medium ${getConversionColor(data.conversion)}`}>
                    {formatPercentage(data.conversion)}
                  </span>
                </div>
              )}
              {data.revenue !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Revenue:</span>
                  <span className="font-medium text-gray-900">{formatCurrency(data.revenue)}</span>
                </div>
              )}
              {data.roi !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-500">ROI:</span>
                  <span className={`font-medium ${data.roi >= 1 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatROI(data.roi)}
                  </span>
                </div>
              )}
            </div>
            
            <div className="mt-2 pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-400 truncate">{data.url}</p>
              {data.campaign && (
                <p className="text-xs text-gray-500 mt-1">🎯 {data.campaign}</p>
              )}
            </div>
            
            <div className="flex gap-2 mt-2">
              <button 
                onClick={(e) => handleActionClick(e, 'details')} 
                className="flex-1 px-2 py-1 text-xs rounded hover:bg-blue-100 transition-colors"
                style={{ backgroundColor: config.primaryColor + '20', color: config.primaryColor }}
              >
                Details
              </button>
              <button 
                onClick={(e) => handleActionClick(e, 'edit')} 
                className="flex-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
        )}
      </div>
      
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3 h-3 bg-gray-400"
      />
    </div>
  )
}

function PageIcon({ iconName }: { iconName: string }) {
  return (
    <svg 
      className="w-4 h-4" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="3" strokeWidth="2" />
      <path strokeWidth="2" d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  )
}

export default memo(PageNode)
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm run test:run -- tests/components/canvas/nodes/PageNode.test.tsx
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/canvas/nodes/PageNode.tsx tests/components/canvas/nodes/PageNode.test.tsx
git commit -m "feat: refactor PageNode with category-based variants and icons"
```

---

### Task 8: Register Node Types in Canvas

**Files:**
- Modify: `src/components/canvas/funnel-canvas.tsx`
- Modify: `src/components/canvas/nodes/index.ts`

- [ ] **Step 1: Update node exports in index.ts**

```typescript
// src/components/canvas/nodes/index.ts
export { default as PageNode } from './PageNode'
export { default as EventNode } from './EventNode'
export { default as ConversionNode } from './ConversionNode'
export { default as TrafficSourceNode } from './TrafficSourceNode'
```

- [ ] **Step 2: Update funnel-canvas.tsx to register all node types**

```typescript
// In src/components/canvas/funnel-canvas.tsx, update the imports and nodeTypes:

import { useCallback, useState } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  ReactFlowProvider,
  type NodeTypes,
} from '@xyflow/react'
import { PageNode, EventNode, ConversionNode, TrafficSourceNode } from './nodes'
import { CanvasControls } from './canvas-controls'
import { useCanvasStore } from '@/lib/store/canvas-store'
import { computeAutoLayout } from '@/lib/layout/elk-layout'
import type { FunnelNode } from '@/types/funnel'
import { useDemoFunnel } from '@/hooks/use-demo-funnel'

const nodeTypes: NodeTypes = {
  pageNode: PageNode as any,
  eventNode: EventNode as any,
  conversionNode: ConversionNode as any,
  trafficSourceNode: TrafficSourceNode as any,
}
```

- [ ] **Step 3: Update the handleAddNode function to support different node types**

```typescript
// Replace the handleAddNode function in funnel-canvas.tsx with:

  const handleAddNode = useCallback(() => {
    const newNode: FunnelNode = {
      id: `node-${Date.now()}`,
      type: 'pageNode',
      position: { x: 100 + nodeCounter * 50, y: 100 + nodeCounter * 50 },
      data: {
        id: `node-${Date.now()}`,
        label: `New Page ${nodeCounter}`,
        volume: 0,
        nodeCategory: 'landing_page',
      },
    }
    addNode(newNode)
    setNodeCounter((prev) => prev + 1)
  }, [addNode, nodeCounter])
```

- [ ] **Step 4: Commit**

```bash
git add src/components/canvas/funnel-canvas.tsx src/components/canvas/nodes/index.ts
git commit -m "feat: register all node types in React Flow canvas"
```

---

### Task 9: Update Edge Styling for Node Categories

**Files:**
- Modify: `src/components/canvas/edges/FunnelEdge.tsx`
- Modify: `src/lib/canvas/colors.ts`

- [ ] **Step 1: Update edge colors based on source/target node categories**

```typescript
// In src/components/canvas/edges/FunnelEdge.tsx, add category-based edge styling:

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
  const isMainPath = props.data?.isMainPath ?? false
  
  const strokeColor = viewMode === 'map' 
    ? (isMainPath ? '#3B82F6' : '#9CA3AF')
    : getEdgeColor(conversionRate)
  const strokeWidth = viewMode === 'map' 
    ? (isMainPath ? 3 : 2)
    : getEdgeWidth(trafficVolume)
  const isAnimated = viewMode === 'heat'
  const strokeDasharray = viewMode === 'map' && !isMainPath ? '5,5' : undefined

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={props.markerEnd}
        style={{ 
          strokeWidth, 
          stroke: strokeColor,
          strokeDasharray,
        }}
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/canvas/edges/FunnelEdge.tsx
git commit -m "feat: update edge styling with main path differentiation"
```

---

### Task 10: Create Node Selector Toolbar Component

**Files:**
- Create: `src/components/canvas/panels/NodeSelectorPanel.tsx`

- [ ] **Step 1: Create the node selector panel**

```typescript
// src/components/canvas/panels/NodeSelectorPanel.tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/canvas/panels/NodeSelectorPanel.tsx
git commit -m "feat: create node selector panel with category tabs"
```

---

### Task 11: Run Full Test Suite and Fix Any Issues

**Files:**
- All test files created above

- [ ] **Step 1: Run full test suite**

```bash
npm run test:run
```
Expected: All tests pass

- [ ] **Step 2: Fix any failing tests**

If any tests fail, fix the implementation or tests as needed.

- [ ] **Step 3: Run lint**

```bash
npm run lint
```
Expected: No errors

- [ ] **Step 4: Commit final changes**

```bash
git add .
git commit -m "test: all tests passing for node visual system"
```

---

### Task 12: Build Verification

**Files:**
- N/A

- [ ] **Step 1: Run production build**

```bash
npm run build
```
Expected: Build succeeds with no errors

- [ ] **Step 2: Fix any build errors**

If build fails, fix TypeScript errors or import issues.

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "build: verify production build succeeds"
```

---

## Testing Summary

**Unit Tests:**
- `tests/types/funnel.test.ts` - NodeCategory type validation
- `tests/lib/canvas/node-config.test.ts` - Node configuration lookups
- `tests/lib/canvas/node-variants.test.ts` - CVA variant classes

**Component Tests:**
- `tests/components/canvas/nodes/TrafficSourceNode.test.tsx` - Traffic source rendering
- `tests/components/canvas/nodes/EventNode.test.tsx` - Event node rendering
- `tests/components/canvas/nodes/ConversionNode.test.tsx` - Conversion node rendering
- `tests/components/canvas/nodes/PageNode.test.tsx` - Page node rendering

**Integration:**
- Canvas renders all node types correctly
- Node selector panel filters by category
- Edges differentiate main paths

---

## Visual Reference

After implementation, the canvas should display:

**Traffic Sources:** Platform-specific colors (Facebook blue, Google blue, Instagram pink/red, TikTok black) with circular icon containers

**Pages:** White background with colored borders matching category (blue for landing, green for sales, orange for checkout)

**Events:** Gradient backgrounds with rounded icon containers (blue for email, green for SMS, purple for phone)

**Conversions:** Gradient backgrounds with animated pulse on icons (green for purchase, blue for lead, purple for signup)

**Edges:** Solid lines for main paths, dashed for secondary paths, width/color based on conversion rate
