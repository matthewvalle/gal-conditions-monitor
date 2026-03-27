import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cacheSet, setLastFetch } from '../../lib/cache';
import { fetchZoneWeather } from '../../lib/open-meteo';
import { fetchMwacForecast } from '../../lib/mwac-scraper';
import { fetchAlerts } from '../../lib/nws';

import zoneData from '../../data/zone-metadata.json';
const mvpZones = (zoneData as any[]).filter((z: any) => z.isMvp);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Verify cron secret if set
  if (process.env.CRON_SECRET && req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const results: string[] = [];

  try {
    const weatherResults = await Promise.allSettled(
      mvpZones.map(async (zone: any) => {
        const weather = await fetchZoneWeather(zone as any);
        await cacheSet(`weather:${zone.id}`, weather, 3 * 3600);
        return zone.id;
      })
    );
    const succeeded = weatherResults.filter((r) => r.status === 'fulfilled').length;
    results.push(`Weather: ${succeeded}/${mvpZones.length} zones`);
    await setLastFetch('weather');
  } catch (err) {
    results.push(`Weather: ERROR - ${err}`);
  }

  try {
    const mwac = await fetchMwacForecast();
    await cacheSet('mwac:current', mwac, 12 * 3600);
    await setLastFetch('mwac');
    results.push(`MWAC: OK`);
  } catch (err) {
    results.push(`MWAC: ERROR - ${err}`);
  }

  try {
    const alerts = await fetchAlerts('NH');
    await cacheSet('nws:alerts:NH', alerts, 3600);
    await setLastFetch('nws');
    results.push(`NWS: ${alerts.length} alerts`);
  } catch (err) {
    results.push(`NWS: ERROR - ${err}`);
  }

  return res.status(200).json({ ok: true, results, timestamp: new Date().toISOString() });
}
