import { FunnelNode, FunnelEdge, FunnelMetadata } from '@/types/funnel'

export const demoNodes: FunnelNode[] = [
  {
    id: 'n1',
    type: 'pageNode',
    position: { x: 0, y: 0 },
    data: {
      id: 'n1',
      label: 'Home',
      volume: 5000,
      spend: 0,
    },
  },
  {
    id: 'n2',
    type: 'pageNode',
    position: { x: 0, y: 0 },
    data: {
      id: 'n2',
      label: 'Product',
      volume: 800,
      spend: 500,
      campaign: 'Campaign A',
      conversion: 16,
    },
  },
  {
    id: 'n3',
    type: 'pageNode',
    position: { x: 0, y: 0 },
    data: {
      id: 'n3',
      label: 'Checkout',
      volume: 150,
      conversion: 18.75,
    },
  },
  {
    id: 'n4',
    type: 'pageNode',
    position: { x: 0, y: 0 },
    data: {
      id: 'n4',
      label: 'Thank You',
      volume: 45,
      isConversion: true,
      conversion: 30,
      roi: 3.2,
    },
  },
]

export const demoEdges: FunnelEdge[] = [
  {
    id: 'e1',
    source: 'n1',
    target: 'n2',
    type: 'smoothstep',
    animated: true,
    data: {
      source: 'n1',
      target: 'n2',
      conversion: 16,
      traffic: 800,
    },
  },
  {
    id: 'e2',
    source: 'n2',
    target: 'n3',
    type: 'smoothstep',
    animated: true,
    data: {
      source: 'n2',
      target: 'n3',
      conversion: 18.75,
      traffic: 150,
    },
  },
  {
    id: 'e3',
    source: 'n3',
    target: 'n4',
    type: 'smoothstep',
    animated: true,
    data: {
      source: 'n3',
      target: 'n4',
      conversion: 30,
      traffic: 45,
    },
  },
]

export const demoMetadata: FunnelMetadata = {
  totalSpend: 500,
  totalRevenue: 1600,
  overallROI: '3.2x',
  mainCampaign: 'Campaign A',
}
