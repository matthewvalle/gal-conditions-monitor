import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchZoneWeather } from '../lib/open-meteo';
import { fetchMwacForecast } from '../lib/mwac-scraper';
import { fetchAlerts } from '../lib/nws';
import { cacheGetOrFetch } from '../lib/cache';
import type { ZoneWeather, MwacForecast, NwsAlert } from '../lib/types';

// Load zone metadata
import zoneData from '../data/zone-metadata.json';
const allZones = zoneData as any[];
const mvpZones = allZones.filter((z: any) => z.isMvp);

/**
 * GET /api/zones
 *
 * Returns all MVP zones with current weather, MWAC forecast, and NWS alerts.
 * Fetches data inline with caching (stale-while-revalidate pattern).
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // Fetch all data sources in parallel with caching
    const [mwac, alerts, ...weatherResults] = await Promise.all([
      cacheGetOrFetch<MwacForecast>('mwac:current', 4 * 3600, () =>
        fetchMwacForecast().catch((): any => ({
          dangerLevel: null,
          dangerLabel: 'Unavailable',
          problems: [],
          bottomLine: 'Unable to fetch MWAC forecast. Check mountwashingtonavalanchecenter.org directly.',
          issuedAt: '',
          expiresAt: '',
          fetchedAt: new Date().toISOString(),
        }))
      ),
      cacheGetOrFetch<NwsAlert[]>('nws:alerts:NH', 3600, () =>
        fetchAlerts('NH').catch(() => [])
      ),
      ...mvpZones.map((zone: any) =>
        cacheGetOrFetch<ZoneWeather | null>(`weather:${zone.id}`, 2 * 3600, () =>
          fetchZoneWeather(zone).catch(() => null)
        )
      ),
    ]);

    // Build weather map
    const weatherMap: Record<string, ZoneWeather> = {};
    mvpZones.forEach((zone: any, i: number) => {
      const w = weatherResults[i];
      if (w) weatherMap[zone.id] = w as ZoneWeather;
    });

    return res.status(200).json({
      zones: mvpZones,
      weather: weatherMap,
      forecast: mwac,
      alerts,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[GET /api/zones] Error:', err);
    return res.status(500).json({ error: 'Failed to load zone data', details: String(err) });
  }
}
