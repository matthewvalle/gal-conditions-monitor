import { getMvpZones } from '../../data/zones/zones';
import { fetchZoneWeather } from '../lib/open-meteo';
import { cacheSet, setLastFetch } from '../lib/cache';

const WEATHER_TTL = 3 * 60 * 60; // 3 hours

/**
 * Vercel Cron handler — fetches Open-Meteo weather for all MVP zones
 * and stores each result in the cache.
 *
 * Configured in vercel.json:
 *   { "path": "/api/cron/fetch-weather", "schedule": "0 */3 * * *" }
 */
export async function POST(request: Request): Promise<Response> {
  // Optional: verify Vercel cron secret
  const authHeader = request.headers.get('authorization');
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response('Unauthorized', { status: 401 });
  }

  const zones = getMvpZones();
  const results: { zoneId: string; ok: boolean; error?: string }[] = [];

  // Fetch all zones in parallel
  const settled = await Promise.allSettled(
    zones.map(async (zone) => {
      const weather = await fetchZoneWeather(zone);
      await cacheSet(`weather:${zone.id}`, weather, WEATHER_TTL);
      return zone.id;
    })
  );

  for (const result of settled) {
    if (result.status === 'fulfilled') {
      results.push({ zoneId: result.value, ok: true });
    } else {
      const errMsg =
        result.reason instanceof Error
          ? result.reason.message
          : String(result.reason);
      console.error('[fetch-weather] Zone failed:', errMsg);
      results.push({ zoneId: 'unknown', ok: false, error: errMsg });
    }
  }

  await setLastFetch('weather');

  const successCount = results.filter((r) => r.ok).length;
  console.log(
    `[fetch-weather] Completed: ${successCount}/${zones.length} zones updated`
  );

  return Response.json({
    success: true,
    zonesUpdated: successCount,
    zonesTotal: zones.length,
    results,
    timestamp: new Date().toISOString(),
  });
}
