'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface CacheEntry<T> {
  data: T
  timestamp: number
}

const CACHE = new Map<string, CacheEntry<unknown>>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes
const MAX_CACHE_SIZE = 50 // Maximum number of entries

function cleanupCache() {
  const now = Date.now()
  const keysToDelete: string[] = []
  
  // First, remove expired entries
  CACHE.forEach((entry, key) => {
    if (now - entry.timestamp > CACHE_TTL) {
      keysToDelete.push(key)
    }
  })
  
  keysToDelete.forEach(key => CACHE.delete(key))
  
  // If still over limit, remove oldest entries
  if (CACHE.size > MAX_CACHE_SIZE) {
    const entries = Array.from(CACHE.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp)
    
    const toDelete = entries.slice(0, CACHE.size - MAX_CACHE_SIZE)
    toDelete.forEach(([key]) => CACHE.delete(key))
  }
}

export function useCachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: {
    ttl?: number
    enabled?: boolean
  }
) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const ttl = options?.ttl ?? CACHE_TTL
  const enabled = options?.enabled ?? true
  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchCached = useCallback(async () => {
    if (!enabled) return

    const cached = CACHE.get(key) as CacheEntry<T> | undefined
    const now = Date.now()

    if (cached && now - cached.timestamp < ttl) {
      setData(cached.data)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    try {
      const result = await fetcher()
      cleanupCache()
      CACHE.set(key, { data: result, timestamp: now })
      setData(result)
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err instanceof Error ? err.message : 'Failed to fetch')
      }
    } finally {
      setIsLoading(false)
    }
  }, [key, fetcher, ttl, enabled])

  useEffect(() => {
    fetchCached()

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchCached])

  const invalidate = useCallback(() => {
    CACHE.delete(key)
    fetchCached()
  }, [key, fetchCached])

  return {
    data,
    isLoading,
    error,
    refetch: fetchCached,
    invalidate,
  }
}

export function clearCache(prefix?: string) {
  if (prefix) {
    const keysToDelete: string[] = []
    CACHE.forEach((_, key) => {
      if (key.startsWith(prefix)) {
        keysToDelete.push(key)
      }
    })
    keysToDelete.forEach(key => CACHE.delete(key))
  } else {
    CACHE.clear()
  }
}
