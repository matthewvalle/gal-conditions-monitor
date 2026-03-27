import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    // Test 1: Basic response
    const tests: string[] = ['basic: ok'];

    // Test 2: Fetch Open-Meteo directly
    const meteoUrl = 'https://api.open-meteo.com/v1/forecast?latitude=44.2596&longitude=-71.2973&current=temperature_2m,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&forecast_days=1';
    const meteoRes = await fetch(meteoUrl);
    const meteoData = await meteoRes.json();
    tests.push(`open-meteo: ${meteoRes.status} - temp=${meteoData?.current?.temperature_2m}°F`);

    // Test 3: Fetch NWS
    const nwsRes = await fetch('https://api.weather.gov/alerts/active?area=NH', {
      headers: { 'User-Agent': 'GraniteAlpineLab/1.0' },
    });
    const nwsData = await nwsRes.json();
    tests.push(`nws: ${nwsRes.status} - ${nwsData?.features?.length ?? 0} alerts`);

    return res.status(200).json({ ok: true, tests });
  } catch (err: any) {
    return res.status(500).json({ error: err.message, stack: err.stack });
  }
}
