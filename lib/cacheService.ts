// lib/cacheService.ts
import NodeCache from 'node-cache';

interface CacheServiceInterface {
  get<T>(key: string): T | undefined;
  set<T>(key: string, value: T, ttl?: number): boolean;
  delete(key: string): void;
  deleteByPattern(pattern: string): void;
  flush(): void;
}

class CacheService implements CacheServiceInterface {
  private cache: NodeCache;

  constructor(ttlSeconds: number) {
    this.cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2 });
  }

  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  set<T>(key: string, value: T, ttl?: number): boolean {
    if (ttl === undefined) {
      return this.cache.set(key, value);
    } else {
      return this.cache.set(key, value, ttl);
    }
  }

  delete(key: string): void {
    this.cache.del(key);
  }

  deleteByPattern(pattern: string): void {
    const keys = this.cache.keys();
    keys.forEach((key) => {
      if (key.includes(pattern)) {
        this.cache.del(key);
      }
    });
  }

  flush(): void {
    this.cache.flushAll();
  }
}

export default new CacheService(60 * 60); // Cache with a default TTL of 1 hour
