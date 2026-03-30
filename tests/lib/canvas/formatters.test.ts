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
