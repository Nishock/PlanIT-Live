interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

class Cache {
  private cache = new Map<string, CacheItem<any>>()

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    })
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null

    const isExpired = Date.now() - item.timestamp > item.ttl
    if (isExpired) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  has(key: string): boolean {
    return this.cache.has(key) && !this.isExpired(key)
  }

  private isExpired(key: string): boolean {
    const item = this.cache.get(key)
    if (!item) return true
    return Date.now() - item.timestamp > item.ttl
  }
}

export const cache = new Cache()

// Cache keys
export const CACHE_KEYS = {
  TASKS: 'tasks',
  DOCUMENTS: 'documents',
  PROJECTS: 'projects',
  WORKSPACES: 'workspaces',
  USER_PROFILE: 'user_profile',
} as const

// Cache TTLs (in milliseconds)
export const CACHE_TTL = {
  SHORT: 30 * 1000, // 30 seconds
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 15 * 60 * 1000, // 15 minutes
} as const 