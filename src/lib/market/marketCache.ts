type CacheEntry<T> = {
  value: T;
  createdAt: number;
  ttlMs: number;
};

const cache = new Map<string, CacheEntry<unknown>>();

export function getCached<T>(key: string): { value: T; stale: boolean } | undefined {
  const item = cache.get(key);
  if (!item) return undefined;
  return { value: item.value as T, stale: Date.now() - item.createdAt > item.ttlMs };
}

export function setCached<T>(key: string, value: T, ttlMs: number) {
  cache.set(key, { value, createdAt: Date.now(), ttlMs });
}

export function cacheKey(...parts: Array<string | number | undefined>) {
  return parts.filter(Boolean).join(":");
}
