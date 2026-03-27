/**
 * Simple in-memory cache for serverless functions.
 *
 * Since Vercel serverless functions are ephemeral, this cache lives
 * for the duration of a warm function instance. The real caching
 * strategy is stale-while-revalidate: API routes fetch fresh data
 * inline when the cache is empty or stale, and HTTP Cache-Control
 * headers handle edge caching for subsequent requests.
 *
 * Key patterns:
 *   weather:{zoneId}          — ZoneWeather, TTL 2h
 *   mwac:current              — MwacForecast, TTL 4h
 *   nws:alerts:{state}        — NwsAlert[], TTL 1h
 *   meta:last_fetch:{source}  — ISO timestamp
 */

interface CacheEntry {
  value: string;
  expiresAt: number;
  createdAt: number;
}

const store = new Map<string, CacheEntry>();

export async function cacheGet<T>(key: string): Promise<T | null> {
  const entry = store.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }

  try {
    return JSON.parse(entry.value) as T;
  } catch {
    store.delete(key);
    return null;
  }
}

export async function cacheSet(
  key: string,
  value: unknown,
  ttlSeconds: number
): Promise<void> {
  store.set(key, {
    value: JSON.stringify(value),
    expiresAt: Date.now() + ttlSeconds * 1000,
    createdAt: Date.now(),
  });
}

/**
 * Get cached value, or fetch fresh data if cache is empty/stale.
 * This is the primary pattern for serverless: inline fetch with caching.
 */
export async function cacheGetOrFetch<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = await cacheGet<T>(key);
  if (cached !== null) return cached;

  const fresh = await fetcher();
  await cacheSet(key, fresh, ttlSeconds);
  return fresh;
}

// ─── Convenience: last-fetch meta timestamps ─────────────────────

export async function setLastFetch(source: string): Promise<void> {
  await cacheSet(`meta:last_fetch:${source}`, new Date().toISOString(), 7 * 24 * 3600);
}

export async function getLastFetch(source: string): Promise<string | null> {
  return cacheGet<string>(`meta:last_fetch:${source}`);
}

export function getCacheAge(key: string): number | null {
  const entry = store.get(key);
  if (!entry) return null;
  return Math.floor((Date.now() - entry.createdAt) / 1000);
}
