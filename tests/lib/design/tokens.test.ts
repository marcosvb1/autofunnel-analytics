import { describe, it, expect } from 'vitest'
import { colors, shadows, motion } from '@/lib/design/tokens'

describe('Design Tokens', () => {
  it('should have correct primary colors', () => {
    expect(colors.primary.base).toBe('#2563EB')
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
