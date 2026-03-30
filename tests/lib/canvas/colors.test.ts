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
