import type { Json } from '@/types/database'
import type { FunnelNodeData, FunnelEdgeData } from '@/types/funnel'

export const mockProjects = [
  {
    id: 'proj-001',
    name: 'E-commerce Funnel',
    description: 'Main shopping funnel with Meta Ads attribution',
    user_id: 'mock-user-001',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-03-28T12:00:00Z',
    settings: {},
    integrations: [
      {
        id: 'int-001',
        project_id: 'proj-001',
        type: 'posthog' as const,
        credentials: { api_key: 'mock-key', project_id: '12345' },
        status: 'connected' as const,
        last_sync_at: '2024-03-28T11:00:00Z',
        created_at: '2024-01-15T10:00:00Z',
      },
      {
        id: 'int-002',
        project_id: 'proj-001',
        type: 'meta_ads' as const,
        credentials: { access_token: 'mock-token', ad_account_id: 'act_123456' },
        status: 'connected' as const,
        last_sync_at: '2024-03-28T10:30:00Z',
        created_at: '2024-02-01T14:00:00Z',
      },
    ],
    funnel_maps: [
      {
        id: 'fm-001',
        project_id: 'proj-001',
        name: 'Primary Checkout Flow',
        nodes: [] as Json[],
        edges: [] as Json[],
        metadata: {} as Json,
        is_auto_generated: true,
        created_at: '2024-02-15T09:00:00Z',
        updated_at: '2024-03-28T12:00:00Z',
      },
    ],
  },
  {
    id: 'proj-002',
    name: 'SaaS Trial Signup',
    description: 'Free trial to paid conversion funnel',
    user_id: 'mock-user-001',
    created_at: '2024-02-10T08:00:00Z',
    updated_at: '2024-03-20T16:00:00Z',
    settings: {},
    integrations: [
      {
        id: 'int-003',
        project_id: 'proj-002',
        type: 'posthog' as const,
        credentials: { api_key: 'mock-key-2', project_id: '67890' },
        status: 'connected' as const,
        last_sync_at: '2024-03-20T15:00:00Z',
        created_at: '2024-02-10T08:00:00Z',
      },
    ],
    funnel_maps: [],
  },
]

export const mockFunnelMap = {
  id: 'fm-001',
  project_id: 'proj-001',
  name: 'Primary Checkout Flow',
  nodes: [
    { id: 'n1', label: 'Homepage', url: '/', type: 'page' as const, volume: 15000, spend: 2500, position: { x: 0, y: 0 } },
    { id: 'n2', label: 'Product Listing', url: '/products', type: 'page' as const, volume: 8000, spend: 1200, campaign: 'Spring Sale 2024', campaignId: 'camp-001', position: { x: 250, y: -50 } },
    { id: 'n3', label: 'Product Detail', url: '/products/:id', type: 'page' as const, volume: 4500, spend: 800, position: { x: 500, y: -50 } },
    { id: 'n4', label: 'Add to Cart', url: '/cart', type: 'event' as const, volume: 2800, spend: 0, position: { x: 750, y: -100 } },
    { id: 'n5', label: 'Begin Checkout', url: '/checkout', type: 'page' as const, volume: 1800, spend: 0, position: { x: 1000, y: -100 } },
    { id: 'n6', label: 'Payment Info', url: '/checkout/payment', type: 'page' as const, volume: 1200, spend: 0, position: { x: 1250, y: -100 } },
    { id: 'n7', label: 'Purchase Complete', url: '/checkout/confirmation', type: 'conversion' as const, volume: 850, spend: 0, position: { x: 1500, y: -100 } },
    { id: 'n8', label: 'Browse Categories', url: '/categories', type: 'page' as const, volume: 3000, spend: 500, position: { x: 500, y: 100 } },
  ] as FunnelNodeData[],
  edges: [
    { id: 'e1', source: 'n1', target: 'n2', volume: 8000, traffic: 8000, conversion: 53.3, spend: 1200, isMainPath: true },
    { id: 'e2', source: 'n1', target: 'n8', volume: 3000, traffic: 3000, conversion: 20, spend: 500, isMainPath: false },
    { id: 'e3', source: 'n2', target: 'n3', volume: 4500, traffic: 4500, conversion: 56.25, spend: 800, isMainPath: true },
    { id: 'e4', source: 'n8', target: 'n3', volume: 1200, traffic: 1200, conversion: 40, spend: 0, isMainPath: false },
    { id: 'e5', source: 'n3', target: 'n4', volume: 2800, traffic: 2800, conversion: 62.2, spend: 0, isMainPath: true },
    { id: 'e6', source: 'n4', target: 'n5', volume: 1800, traffic: 1800, conversion: 64.3, spend: 0, isMainPath: true },
    { id: 'e7', source: 'n5', target: 'n6', volume: 1200, traffic: 1200, conversion: 66.7, spend: 0, isMainPath: true },
    { id: 'e8', source: 'n6', target: 'n7', volume: 850, traffic: 850, conversion: 70.8, spend: 0, isMainPath: true },
  ] as FunnelEdgeData[],
  metadata: {
    totalVolume: 15000,
    totalSpend: 4500,
    totalConversions: 850,
    overallConversion: 5.67,
    roi: 2.3,
    detectedAt: '2024-03-28T12:00:00Z',
    provider: 'openai' as const,
    model: 'gpt-4o-mini',
  },
  is_auto_generated: true,
  created_at: '2024-02-15T09:00:00Z',
  updated_at: '2024-03-28T12:00:00Z',
}

export const mockMetaAdsAccounts = [
  { id: 'act_123456', name: 'Main Business Account', currency: 'USD', amount_spent: '4500.00' },
  { id: 'act_789012', name: 'Secondary Account', currency: 'USD', amount_spent: '1200.00' },
]

export const mockCampaigns = [
  {
    id: 'camp-001',
    name: 'Spring Sale 2024',
    status: 'ACTIVE',
    objective: 'CONVERSIONS',
    daily_budget: '5000',
    spend: 2500,
    impressions: 125000,
    clicks: 3200,
    conversions: 85,
    created_time: '2024-03-01T00:00:00Z',
  },
  {
    id: 'camp-002',
    name: 'Flash Deal Friday',
    status: 'PAUSED',
    objective: 'TRAFFIC',
    daily_budget: '2000',
    spend: 800,
    impressions: 45000,
    clicks: 1200,
    conversions: 22,
    created_time: '2024-03-15T00:00:00Z',
  },
  {
    id: 'camp-003',
    name: 'Brand Awareness Q1',
    status: 'ACTIVE',
    objective: 'REACH',
    daily_budget: '3000',
    spend: 1200,
    impressions: 200000,
    clicks: 800,
    conversions: 15,
    created_time: '2024-01-15T00:00:00Z',
  },
]

export const mockSyncResult = {
  success: true,
  campaignsSynced: 3,
  eventsSynced: 15000,
  lastSync: new Date().toISOString(),
}