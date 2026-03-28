import { describe, it, expect } from 'vitest'
import {
  getDefaultExcludePatterns,
  getDefaultConversionUrls,
  buildFunnelDetectionPrompt,
  FUNNEL_DETECTION_SYSTEM_PROMPT,
} from '@/lib/ai/prompts/funnel-detection'
import type { FunnelDetectionInput } from '@/types/funnel'

describe('getDefaultExcludePatterns', () => {
  it('should return array of exclude patterns', () => {
    const patterns = getDefaultExcludePatterns()
    expect(Array.isArray(patterns)).toBe(true)
    expect(patterns.length).toBeGreaterThan(0)
  })

  it('should include common auth patterns', () => {
    const patterns = getDefaultExcludePatterns()
    expect(patterns).toContain('/login')
    expect(patterns).toContain('/logout')
    expect(patterns).toContain('/register')
  })

  it('should include static asset patterns', () => {
    const patterns = getDefaultExcludePatterns()
    expect(patterns).toContain('/api/')
    expect(patterns).toContain('/static/')
    expect(patterns).toContain('/_next/')
  })
})

describe('getDefaultConversionUrls', () => {
  it('should return array of conversion URLs', () => {
    const urls = getDefaultConversionUrls()
    expect(Array.isArray(urls)).toBe(true)
    expect(urls.length).toBeGreaterThan(0)
  })

  it('should include checkout completion URLs', () => {
    const urls = getDefaultConversionUrls()
    expect(urls).toContain('/checkout/complete')
    expect(urls).toContain('/checkout/success')
    expect(urls).toContain('/thank-you')
  })

  it('should include signup completion URLs', () => {
    const urls = getDefaultConversionUrls()
    expect(urls).toContain('/signup/complete')
    expect(urls).toContain('/signup/success')
  })
})

describe('buildFunnelDetectionPrompt', () => {
  it('should build prompt with minimal input', () => {
    const input: FunnelDetectionInput = {
      paths: [{ nodes: ['/home', '/product', '/checkout'], occurrences: 100 }],
      conversionUrls: [],
      excludePatterns: [],
    }
    const prompt = buildFunnelDetectionPrompt(input)
    expect(prompt).toContain('USER PATHS')
    expect(prompt).toContain('/home → /product → /checkout')
    expect(prompt).toContain('100 occurrences')
  })

  it('should include campaign data when provided', () => {
    const input: FunnelDetectionInput = {
      paths: [{ nodes: ['/home'], occurrences: 50 }],
      campaigns: [
        { id: 'camp-1', name: 'Summer Sale', spend: 500, landingUrl: '/promo' },
      ],
      conversionUrls: ['/checkout/complete'],
      excludePatterns: ['/login'],
    }
    const prompt = buildFunnelDetectionPrompt(input)
    expect(prompt).toContain('Summer Sale')
    expect(prompt).toContain('$500')
    expect(prompt).toContain('/promo')
  })

  it('should use default conversion URLs when none provided', () => {
    const input: FunnelDetectionInput = {
      paths: [{ nodes: ['/home'], occurrences: 10 }],
      conversionUrls: [],
      excludePatterns: [],
    }
    const prompt = buildFunnelDetectionPrompt(input)
    expect(prompt).toContain('/checkout/complete')
  })

  it('should limit paths to 50', () => {
    const paths = Array.from({ length: 100 }, (_, i) => ({
      nodes: [`/page-${i}`],
      occurrences: i + 1,
    }))
    const input: FunnelDetectionInput = {
      paths,
      conversionUrls: [],
      excludePatterns: [],
    }
    const prompt = buildFunnelDetectionPrompt(input)
    expect(prompt).toContain('/page-0')
    expect(prompt).toContain('/page-49')
    expect(prompt).not.toContain('/page-50')
  })
})

describe('FUNNEL_DETECTION_SYSTEM_PROMPT', () => {
  it('should be defined', () => {
    expect(FUNNEL_DETECTION_SYSTEM_PROMPT).toBeDefined()
    expect(typeof FUNNEL_DETECTION_SYSTEM_PROMPT).toBe('string')
  })

  it('should contain analysis instructions', () => {
    expect(FUNNEL_DETECTION_SYSTEM_PROMPT).toContain('funnel')
    expect(FUNNEL_DETECTION_SYSTEM_PROMPT).toContain('nodes')
    expect(FUNNEL_DETECTION_SYSTEM_PROMPT).toContain('edges')
    expect(FUNNEL_DETECTION_SYSTEM_PROMPT).toContain('metadata')
  })
})