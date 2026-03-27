import { getLastFetch } from '../../lib/cache';

interface HealthResponse {
  status: 'ok' | 'degraded' | 'error';
  sources: {
    weather: { lastFetch: string | null; ok: boolean };
    mwac: { lastFetch: string | null; ok: boolean };
    nws: { lastFetch: string | null; ok: boolean };
  };
  timestamp: string;
}

// Max age before a source is considered stale
const STALE_THRESHOLDS: Record<string, number> = {
  weather: 4 * 60 * 60 * 1000, // 4 hours (cron runs every 3h)
  mwac: 14 * 60 * 60 * 1000, // 14 hours (cron runs every 12h)
  nws: 2 * 60 * 60 * 1000, // 2 hours (cron runs every 1h)
};

function isStale(lastFetch: string | null, thresholdMs: number): boolean {
  if (!lastFetch) return true;
  const age = Date.now() - new Date(lastFetch).getTime();
  return age > thresholdMs;
}

/**
 * GET /api/health
 *
 * Returns the operational status of each data source based on
 * last-fetch timestamps.
 */
export async function GET(): Promise<Response> {
  const [weatherTs, mwacTs, nwsTs] = await Promise.all([
    getLastFetch('weather'),
    getLastFetch('mwac'),
    getLastFetch('nws'),
  ]);

  const weatherOk = !isStale(weatherTs, STALE_THRESHOLDS.weather);
  const mwacOk = !isStale(mwacTs, STALE_THRESHOLDS.mwac);
  const nwsOk = !isStale(nwsTs, STALE_THRESHOLDS.nws);

  const allOk = weatherOk && mwacOk && nwsOk;
  const allDown = !weatherOk && !mwacOk && !nwsOk;

  const response: HealthResponse = {
    status: allDown ? 'error' : allOk ? 'ok' : 'degraded',
    sources: {
      weather: { lastFetch: weatherTs, ok: weatherOk },
      mwac: { lastFetch: mwacTs, ok: mwacOk },
      nws: { lastFetch: nwsTs, ok: nwsOk },
    },
    timestamp: new Date().toISOString(),
  };

  return Response.json(response, {
    status: allDown ? 503 : 200,
    headers: {
      'Cache-Control': 'no-cache',
    },
  });
}
