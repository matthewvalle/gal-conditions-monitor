import { fetchMwacForecast } from '../lib/mwac-scraper';
import { cacheSet, setLastFetch } from '../lib/cache';

const MWAC_TTL = 12 * 60 * 60; // 12 hours

/**
 * Vercel Cron handler — scrapes the MWAC forecast page and caches
 * the parsed avalanche data.
 *
 * Configured in vercel.json:
 *   { "path": "/api/cron/fetch-mwac", "schedule": "0 6,18 * * *" }
 */
export async function POST(request: Request): Promise<Response> {
  const authHeader = request.headers.get('authorization');
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const forecast = await fetchMwacForecast();
    await cacheSet('mwac:current', forecast, MWAC_TTL);
    await setLastFetch('mwac');

    const maxDanger = Math.max(
      forecast.dangerLevel.alpine,
      forecast.dangerLevel.treeline,
      forecast.dangerLevel.belowTreeline
    );

    console.log(
      `[fetch-mwac] Success — max danger level: ${maxDanger}, problems: ${forecast.problems.length}`
    );

    return Response.json({
      success: true,
      dangerLevel: forecast.dangerLevel,
      problemCount: forecast.problems.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[fetch-mwac] Failed:', message);

    return Response.json(
      {
        success: false,
        error: message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
