import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchZoneWeather } from '../lib/open-meteo';
import { fetchAlerts } from '../lib/nws';
import { cacheGetOrFetch } from '../lib/cache';
import type { ZoneWeather, NwsAlert } from '../lib/types';

// Inline MVP zone definitions (avoids JSON import issues on Vercel)
const mvpZones = [
  { id: 'tuckerman-ravine', name: 'Tuckerman Ravine', lat: 44.2596, lon: -71.2973, elevation: 4000, region: 'New Hampshire', subRegion: 'Presidential Range', aspect: 'SE', approachMiles: 2.4, isMvp: true },
  { id: 'sherburne-ski-trail', name: 'Sherburne Ski Trail', lat: 44.2570, lon: -71.2530, elevation: 2400, region: 'New Hampshire', subRegion: 'Presidential Range', aspect: 'SE', approachMiles: 0, isMvp: true },
  { id: 'gulf-of-slides', name: 'Gulf of Slides', lat: 44.2495, lon: -71.2890, elevation: 3800, region: 'New Hampshire', subRegion: 'Presidential Range', aspect: 'E/SE', approachMiles: 2.8, isMvp: true },
  { id: 'great-gulf', name: 'Great Gulf', lat: 44.2795, lon: -71.3050, elevation: 4000, region: 'New Hampshire', subRegion: 'Presidential Range', aspect: 'NE', approachMiles: 3.5, isMvp: true },
  { id: 'oakes-gulf', name: 'Oakes Gulf', lat: 44.2470, lon: -71.3130, elevation: 4300, region: 'New Hampshire', subRegion: 'Presidential Range', aspect: 'SE', approachMiles: 4.0, isMvp: true },
  { id: 'huntington-ravine', name: 'Huntington Ravine', lat: 44.2680, lon: -71.2935, elevation: 4200, region: 'New Hampshire', subRegion: 'Presidential Range', aspect: 'E', approachMiles: 2.5, isMvp: true },
  { id: 'burt-ammonoosuc-ravines', name: 'Burt and Ammonoosuc Ravines', lat: 44.2720, lon: -71.3310, elevation: 4200, region: 'New Hampshire', subRegion: 'Presidential Range', aspect: 'W/SW', approachMiles: 3.2, isMvp: true },
  { id: 'pinkham-notch', name: 'Pinkham Notch', lat: 44.2573, lon: -71.2530, elevation: 2032, region: 'New Hampshire', subRegion: 'Presidential Range', aspect: '', approachMiles: 0, isMvp: true },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // Fetch weather for all zones in parallel (with individual error handling)
    const weatherPromises = mvpZones.map((zone) =>
      cacheGetOrFetch<ZoneWeather | null>(`weather:${zone.id}`, 2 * 3600, () =>
        fetchZoneWeather(zone as any).catch((err: any) => {
          console.error(`Weather fetch failed for ${zone.id}:`, err.message);
          return null;
        })
      )
    );

    // Fetch NWS alerts (separate, with fallback)
    const alertsPromise = cacheGetOrFetch<NwsAlert[]>('nws:alerts:NH', 3600, () =>
      fetchAlerts('NH').catch(() => [])
    );

    // Wait for all
    const [alerts, ...weatherResults] = await Promise.all([
      alertsPromise,
      ...weatherPromises,
    ]);

    // Build weather map
    const weatherMap: Record<string, ZoneWeather> = {};
    mvpZones.forEach((zone, i) => {
      const w = weatherResults[i];
      if (w) weatherMap[zone.id] = w as ZoneWeather;
    });

    return res.status(200).json({
      zones: mvpZones,
      weather: weatherMap,
      forecast: null, // MWAC scraped separately to avoid timeout
      alerts,
      updatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[GET /api/zones] Error:', err.message, err.stack);
    return res.status(500).json({
      error: 'Failed to load zone data',
      message: err.message,
    });
  }
}
