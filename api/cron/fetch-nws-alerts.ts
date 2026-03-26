import { fetchAlerts, type SupportedState } from '../lib/nws';
import { cacheSet, setLastFetch } from '../lib/cache';

const NWS_TTL = 60 * 60; // 1 hour

// MVP: NH only. Phase 2 will add more states.
const MVP_STATES: SupportedState[] = ['NH'];
// const PHASE2_STATES: SupportedState[] = ['NH', 'VT', 'ME', 'NY', 'MA'];

/**
 * Vercel Cron handler — fetches NWS active alerts for monitored states
 * and caches them per-state.
 *
 * Configured in vercel.json:
 *   { "path": "/api/cron/fetch-nws-alerts", "schedule": "15 * * * *" }
 */
export async function POST(request: Request): Promise<Response> {
  const authHeader = request.headers.get('authorization');
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response('Unauthorized', { status: 401 });
  }

  const results: { state: string; alertCount: number; ok: boolean; error?: string }[] = [];

  for (const state of MVP_STATES) {
    try {
      const alerts = await fetchAlerts(state);
      await cacheSet(`nws:alerts:${state}`, alerts, NWS_TTL);
      results.push({ state, alertCount: alerts.length, ok: true });
      console.log(`[fetch-nws] ${state}: ${alerts.length} active alerts`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[fetch-nws] ${state} failed:`, message);
      results.push({ state, alertCount: 0, ok: false, error: message });
    }
  }

  await setLastFetch('nws');

  return Response.json({
    success: results.every((r) => r.ok),
    results,
    timestamp: new Date().toISOString(),
  });
}
