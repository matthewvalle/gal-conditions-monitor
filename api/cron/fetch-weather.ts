/**
 * Daily cron handler — fetches ALL data sources:
 * 1. Open-Meteo weather for all MVP zones
 * 2. MWAC avalanche forecast
 * 3. NWS active alerts for NH
 *
 * Configured in vercel.json: { "path": "/api/cron/fetch-weather", "schedule": "0 6 * * *" }
 */
import { cacheSet, setLastFetch } from '../../lib/cache';
import { fetchZoneWeather } from '../../lib/open-meteo';
import { fetchMwacForecast } from '../../lib/mwac-scraper';
import { fetchAlerts } from '../../lib/nws';

// Read zone metadata
import zoneData from '../../data/zone-metadata.json';
const mvpZones = (zoneData as any[]).filter((z: any) => z.isMvp);

export async function GET(request: Request): Promise<Response> {
  // Verify cron secret if set
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const results: string[] = [];

  // 1. Fetch weather for all MVP zones
  try {
    const weatherResults = await Promise.allSettled(
      mvpZones.map(async (zone: any) => {
        const weather = await fetchZoneWeather(zone as any);
        await cacheSet(`weather:${zone.id}`, weather, 3 * 3600);
        return zone.id;
      })
    );

    const succeeded = weatherResults.filter((r) => r.status === 'fulfilled').length;
    results.push(`Weather: ${succeeded}/${mvpZones.length} zones updated`);
    await setLastFetch('weather');
  } catch (err) {
    results.push(`Weather: ERROR - ${err}`);
  }

  // 2. Fetch MWAC forecast
  try {
    const mwac = await fetchMwacForecast();
    await cacheSet('mwac:current', mwac, 12 * 3600);
    await setLastFetch('mwac');
    results.push(`MWAC: Updated (danger: ${mwac.dangerLevel?.alpine ?? 'N/A'})`);
  } catch (err) {
    results.push(`MWAC: ERROR - ${err}`);
  }

  // 3. Fetch NWS alerts
  try {
    const alerts = await fetchAlerts('NH');
    await cacheSet('nws:alerts:NH', alerts, 3600);
    await setLastFetch('nws');
    results.push(`NWS: ${alerts.length} active alerts`);
  } catch (err) {
    results.push(`NWS: ERROR - ${err}`);
  }

  return Response.json(
    { ok: true, results, timestamp: new Date().toISOString() },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
