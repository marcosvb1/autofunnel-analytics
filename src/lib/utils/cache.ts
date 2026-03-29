interface CacheEntry<T> {
  data: T
  timestamp: number
}

const CACHE = new Map<string, CacheEntry<unknown>>()
const DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes

export function getCached<T>(key: string, ttl: number = DEFAULT_TTL): T | null {
  const entry = CACHE.get(key) as CacheEntry<T> | undefined
  if (!entry) return null
  
  const now = Date.now()
  if (now - entry.timestamp > ttl) {
    CACHE.delete(key)
    return null
  }
  
  return entry.data
}

export function setCached<T>(key: string, data: T, ttl: number = DEFAULT_TTL): void {
  CACHE.set(key, { data, timestamp: Date.now() })
}

export function invalidateCache(prefix?: string): void {
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

export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = DEFAULT_TTL
): Promise<T> {
  const cached = getCached<T>(key, ttl)
  if (cached !== null) {
    return cached
  }
  
  const data = await fetcher()
  setCached(key, data, ttl)
  return data
}
