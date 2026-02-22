interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class SimpleCache {
  private cache = new Map<string, CacheEntry<any>>();

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    const age = now - entry.timestamp;

    if (age > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  clear(key?: string) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  size() {
    return this.cache.size;
  }
}

export const cache = new SimpleCache();

// Memoization helper for expensive functions
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  keyGenerator?: (...args: any[]) => string
): T {
  const memoCache = new Map<string, any>();

  return ((...args: any[]) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
    
    if (memoCache.has(key)) {
      return memoCache.get(key);
    }

    const result = fn(...args);
    memoCache.set(key, result);
    
    // Limit cache size to prevent memory leaks
    if (memoCache.size > 100) {
      const firstKey = memoCache.keys().next().value;
      memoCache.delete(firstKey);
    }

    return result;
  }) as T;
}
