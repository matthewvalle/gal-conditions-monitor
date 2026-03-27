import { zones } from '../../data/zones/zones';
import { cacheGet } from '../../lib/cache';
import type {
  ZoneWeather,
  MwacForecast,
  NwsAlert,
  ZonesResponse,
} from '../../lib/types';

/**
 * GET /api/zones
 *
 * Returns all zones with current weather, trip assessments,
 * and NWS alerts. Reads everything from cache (populated by cron jobs).
 */
export async function GET(): Promise<Response> {
  try {
    // Fetch MWAC forecast (shared across all zones)
    const mwac = await cacheGet<MwacForecast>('mwac:current');

    // Fetch NWS alerts for NH (MVP)
    const alerts = (await cacheGet<NwsAlert[]>('nws:alerts:NH')) ?? [];

    // Build weather map for all zones
    const weatherMap: Record<string, ZoneWeather> = {};
    const assessmentPromises = zones.map(async (zone) => {
      const weather = await cacheGet<ZoneWeather>(`weather:${zone.id}`);
      if (weather) {
        weatherMap[zone.id] = weather;
      }
    });
    await Promise.all(assessmentPromises);

    const response: ZonesResponse = {
      zones,
      weather: weatherMap,
      forecast: mwac,
      alerts,
      updatedAt: new Date().toISOString(),
    };

    return Response.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (err) {
    console.error('[GET /api/zones] Error:', err);
    return Response.json(
      { error: 'Failed to load zone data' },
      { status: 500 }
    );
  }
}
