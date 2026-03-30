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
      const totalCategories = 16 + 12 + 10 + 6 // traffic + page + event + conversion
      expect(ALL_NODE_CONFIGS.length).toBe(totalCategories)
    })

    it('should have unique categories', () => {
      const categories = ALL_NODE_CONFIGS.map(c => c.category)
      const uniqueCategories = new Set(categories)
      expect(categories.length).toBe(uniqueCategories.size)
    })
  })
})
