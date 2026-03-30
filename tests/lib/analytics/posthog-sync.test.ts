import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchFunnelPaths, fetchPageViews } from '@/lib/analytics/posthog-sync'

global.fetch = vi.fn()

describe('PostHog Sync', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchFunnelPaths', () => {
    it('should fetch funnel paths successfully', async () => {
      const mockResponse = {
        results: [
          { nodes: ['page1', 'page2', 'page3'], occurrences: 100 },
          { nodes: ['page1', 'page3'], occurrences: 50 },
        ],
      }

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await fetchFunnelPaths('test-project-id', 30)

      expect(result).toEqual([
        { nodes: ['page1', 'page2', 'page3'], occurrences: 100 },
        { nodes: ['page1', 'page3'], occurrences: 50 },
      ])
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/insights/funnel/'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': expect.stringContaining('Bearer'),
          }),
        }),
      )
    })

    it('should return empty array when no results', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: [] }),
      } as Response)

      const result = await fetchFunnelPaths('test-project-id', 30)
      expect(result).toEqual([])
    })

    it('should throw error on failed response', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      } as Response)

      await expect(fetchFunnelPaths('test-project-id', 30))
        .rejects.toThrow('Failed to fetch funnel paths: 401 Unauthorized')
    })

    it('should use default days parameter of 30', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: [] }),
      } as Response)

      await fetchFunnelPaths('test-project-id')

      expect(global.fetch).toHaveBeenCalled()
    })
  })

  describe('fetchPageViews', () => {
    it('should fetch page views successfully', async () => {
      const mockResponse = {
        results: [
          { properties: { $current_url: '/home' }, count: 500 },
          { properties: { $current_url: '/about' }, count: 300 },
        ],
      }

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await fetchPageViews('test-project-id')

      expect(result).toEqual([
        { url: '/home', count: 500 },
        { url: '/about', count: 300 },
      ])
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/events/'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': expect.stringContaining('Bearer'),
          }),
        }),
      )
    })

    it('should return empty array when no results', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: [] }),
      } as Response)

      const result = await fetchPageViews('test-project-id')
      expect(result).toEqual([])
    })

    it('should throw error on failed response', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response)

      await expect(fetchPageViews('test-project-id'))
        .rejects.toThrow('Failed to fetch page views: 500 Internal Server Error')
    })

    it('should handle missing $current_url property', async () => {
      const mockResponse = {
        results: [
          { properties: {}, count: 100 },
        ],
      }

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await fetchPageViews('test-project-id')

      expect(result).toEqual([
        { url: undefined, count: 100 },
      ])
    })
  })
})
