import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchZoneWeather } from '../../lib/open-meteo';
import { fetchMwacForecast } from '../../lib/mwac-scraper';
import { fetchAlerts } from '../../lib/nws';
import { cacheGetOrFetch } from '../../lib/cache';
import { getGearSuggestions } from '../../lib/gear-suggestions';
import { computeTripAssessment } from '../../lib/trip-assessment';
import type { ZoneWeather, MwacForecast, NwsAlert } from '../../lib/types';

import zoneData from '../../data/zone-metadata.json';
const allZones = zoneData as any[];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  const zoneId = Array.isArray(id) ? id[0] : id;

  if (!zoneId) return res.status(400).json({ error: 'Zone ID required' });

  const zone = allZones.find((z: any) => z.id === zoneId);
  if (!zone) return res.status(404).json({ error: `Zone "${zoneId}" not found` });

  try {
    const [weather, mwac, alerts] = await Promise.all([
      cacheGetOrFetch<ZoneWeather | null>(`weather:${zoneId}`, 2 * 3600, () =>
        fetchZoneWeather(zone).catch(() => null)
      ),
      cacheGetOrFetch<MwacForecast>('mwac:current', 4 * 3600, () =>
        fetchMwacForecast().catch((): any => ({ status: 'unavailable' }))
      ),
      cacheGetOrFetch<NwsAlert[]>('nws:alerts:NH', 3600, () =>
        fetchAlerts('NH').catch(() => [])
      ),
    ]);

    let assessment = null;
    let gearSuggestions = null;
    if (weather) {
      gearSuggestions = getGearSuggestions(weather);
      assessment = computeTripAssessment(weather, mwac, gearSuggestions);
    }

    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({
      zone,
      weather,
      forecast: mwac,
      alerts: alerts ?? [],
      assessment,
      gearSuggestions,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error(`[GET /api/zone/${zoneId}] Error:`, err);
    return res.status(500).json({ error: 'Failed to load zone detail' });
  }
}
