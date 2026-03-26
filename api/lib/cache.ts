/**
 * Cache wrapper that uses Vercel KV when available, falling back
 * to an in-memory Map for local development.
 *
 * Key patterns:
 *   weather:{zoneId}          — ZoneWeather, TTL 3h
 *   mwac:current              — MwacForecast, TTL 12h
 *   nws:alerts:{state}        — NwsAlert[], TTL 1h
 *   meta:last_fetch:{source}  — ISO timestamp, TTL 7d
 */

// ─── In-memory fallback ──────────────────────────────────────────

interface CacheEntry {
  value: string; // JSON-serialized
  expiresAt: number; // Unix ms
}

const memoryStore = new Map<string, CacheEntry>();

function isVercelKvAvailable(): boolean {
  return !!(
    typeof process !== 'undefined' &&
    process.env &&
    process.env.KV_REST_API_URL &&
    process.env.KV_REST_API_TOKEN
  );
}

// ─── Vercel KV adapter ──────────────────────────────────────────

async function getVercelKv() {
  // Dynamic import to avoid bundling @vercel/kv when not needed
  const { kv } = await import('@vercel/kv');
  return kv;
}

// ─── Public API ──────────────────────────────────────────────────

export async function cacheGet<T>(key: string): Promise<T | null> {
  if (isVercelKvAvailable()) {
    try {
      const kv = await getVercelKv();
      const value = await kv.get<T>(key);
      return value ?? null;
    } catch (err) {
      console.error(`[Cache] Vercel KV get error for key "${key}":`, err);
      return null;
    }
  }

  // In-memory fallback
  const entry = memoryStore.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    memoryStore.delete(key);
    return null;
  }

  try {
    return JSON.parse(entry.value) as T;
  } catch {
    memoryStore.delete(key);
    return null;
  }
}

export async function cacheSet(
  key: string,
  value: unknown,
  ttlSeconds: number
): Promise<void> {
  if (isVercelKvAvailable()) {
    try {
      const kv = await getVercelKv();
      await kv.set(key, value, { ex: ttlSeconds });
    } catch (err) {
      console.error(`[Cache] Vercel KV set error for key "${key}":`, err);
    }
    return;
  }

  // In-memory fallback
  memoryStore.set(key, {
    value: JSON.stringify(value),
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

// ─── Convenience: last-fetch meta timestamps ─────────────────────

const META_TTL = 7 * 24 * 60 * 60; // 7 days

export async function setLastFetch(source: string): Promise<void> {
  await cacheSet(`meta:last_fetch:${source}`, new Date().toISOString(), META_TTL);
}

export async function getLastFetch(source: string): Promise<string | null> {
  return cacheGet<string>(`meta:last_fetch:${source}`);
}
