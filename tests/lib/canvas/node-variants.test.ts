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
