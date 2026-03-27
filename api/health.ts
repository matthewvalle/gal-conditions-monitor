import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getLastFetch } from '../lib/cache';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const [weatherTs, mwacTs, nwsTs] = await Promise.all([
    getLastFetch('weather'),
    getLastFetch('mwac'),
    getLastFetch('nws'),
  ]);

  return res.status(200).json({
    status: 'ok',
    sources: {
      weather: { lastFetch: weatherTs },
      mwac: { lastFetch: mwacTs },
      nws: { lastFetch: nwsTs },
    },
    timestamp: new Date().toISOString(),
  });
}
