import { getZoneById } from '../../../data/zones/zones';
import { cacheGet } from '../../lib/cache';
import { computeTripAssessment } from '../../lib/trip-assessment';
import { getGearSuggestions } from '../../lib/gear-suggestions';
import type {
  ZoneWeather,
  MwacForecast,
  NwsAlert,
  ZoneDetailResponse,
} from '../../lib/types';

/**
 * GET /api/zone/:id
 *
 * Returns full detail for a single zone including weather, forecast,
 * MWAC data, trip assessment, gear suggestions, and NWS alerts.
 */
export async function GET(request: Request): Promise<Response> {
  // Extract zone ID from the URL path
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  // Expected path: /api/zone/{id}
  const zoneId = pathParts[pathParts.length - 1];

  if (!zoneId) {
    return Response.json({ error: 'Zone ID is required' }, { status: 400 });
  }

  const zone = getZoneById(zoneId);
  if (!zone) {
    return Response.json(
      { error: `Zone "${zoneId}" not found` },
      { status: 404 }
    );
  }

  try {
    // Fetch all data from cache in parallel
    const [weather, mwac, alerts] = await Promise.all([
      cacheGet<ZoneWeather>(`weather:${zone.id}`),
      cacheGet<MwacForecast>('mwac:current'),
      cacheGet<NwsAlert[]>(`nws:alerts:NH`),
    ]);

    // Compute gear suggestions and trip assessment
    let assessment = null;

    if (weather) {
      const gear = getGearSuggestions(weather);
      assessment = computeTripAssessment(weather, mwac, gear);
    }

    // Filter alerts relevant to this zone's region
    const zoneAlerts = (alerts ?? []).filter(
      (a) =>
        a.areaDesc.toLowerCase().includes(zone.region.toLowerCase()) ||
        a.areaDesc.toLowerCase().includes(zone.subRegion.toLowerCase())
    );

    const response: ZoneDetailResponse = {
      zone,
      weather: weather!,
      forecast: mwac,
      alerts: zoneAlerts,
      assessment,
      updatedAt: new Date().toISOString(),
    };

    return Response.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (err) {
    console.error(`[GET /api/zone/${zoneId}] Error:`, err);
    return Response.json(
      { error: 'Failed to load zone detail' },
      { status: 500 }
    );
  }
}
