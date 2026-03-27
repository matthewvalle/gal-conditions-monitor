import type { VercelRequest, VercelResponse } from '@vercel/node';

// MVP zone definitions
const mvpZones = [
  { id: 'tuckerman-ravine', name: 'Tuckerman Ravine', lat: 44.2596, lon: -71.2973, elevation: 4000, region: 'New Hampshire', subRegion: 'Presidential Range', aspect: 'SE', approachMiles: 2.4, isMvp: true },
  { id: 'huntington-ravine', name: 'Huntington Ravine', lat: 44.2680, lon: -71.2935, elevation: 4200, region: 'New Hampshire', subRegion: 'Presidential Range', aspect: 'E', approachMiles: 2.5, isMvp: true },
  { id: 'gulf-of-slides', name: 'Gulf of Slides', lat: 44.2495, lon: -71.2890, elevation: 3800, region: 'New Hampshire', subRegion: 'Presidential Range', aspect: 'E/SE', approachMiles: 2.8, isMvp: true },
  { id: 'great-gulf', name: 'Great Gulf', lat: 44.2795, lon: -71.3050, elevation: 4000, region: 'New Hampshire', subRegion: 'Presidential Range', aspect: 'NE', approachMiles: 3.5, isMvp: true },
  { id: 'oakes-gulf', name: 'Oakes Gulf', lat: 44.2470, lon: -71.3130, elevation: 4300, region: 'New Hampshire', subRegion: 'Presidential Range', aspect: 'SE', approachMiles: 4.0, isMvp: true },
  { id: 'burt-ammonoosuc-ravines', name: 'Burt and Ammonoosuc Ravines', lat: 44.2720, lon: -71.3310, elevation: 4200, region: 'New Hampshire', subRegion: 'Presidential Range', aspect: 'W/SW', approachMiles: 3.2, isMvp: true },
  { id: 'sherburne-ski-trail', name: 'Sherburne Ski Trail', lat: 44.2570, lon: -71.2530, elevation: 2400, region: 'New Hampshire', subRegion: 'Presidential Range', aspect: 'SE', approachMiles: 0, isMvp: true },
  { id: 'pinkham-notch', name: 'Pinkham Notch', lat: 44.2573, lon: -71.2530, elevation: 2032, region: 'New Hampshire', subRegion: 'Presidential Range', aspect: '', approachMiles: 0, isMvp: true },
];

// Fetch weather directly from Open-Meteo (inline, no library import)
async function getWeather(lat: number, lon: number, elevation: number) {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    elevation: String(Math.round(elevation * 0.3048)), // feet to meters
    current: 'temperature_2m,apparent_temperature,wind_speed_10m,wind_direction_10m,wind_gusts_10m,weather_code',
    hourly: 'temperature_2m,snowfall,precipitation,wind_speed_10m',
    daily: 'temperature_2m_max,temperature_2m_min,snowfall_sum,precipitation_sum,wind_speed_10m_max,weather_code',
    temperature_unit: 'fahrenheit',
    wind_speed_unit: 'mph',
    precipitation_unit: 'inch',
    forecast_days: '5',
    timezone: 'America/New_York',
  });

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
  return res.json();
}

// Fetch NWS alerts
async function getAlerts() {
  try {
    const res = await fetch('https://api.weather.gov/alerts/active?area=NH', {
      headers: { 'User-Agent': 'GraniteAlpineLab/1.0 (conditions-monitor)' },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.features || []).map((f: any) => ({
      id: f.id,
      event: f.properties.event,
      severity: f.properties.severity,
      headline: f.properties.headline || '',
      description: f.properties.description || '',
      areaDesc: f.properties.areaDesc || '',
      expires: f.properties.expires || '',
    }));
  } catch { return []; }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // Fetch weather for all zones + alerts in parallel
    const results = await Promise.allSettled([
      ...mvpZones.map((z) => getWeather(z.lat, z.lon, z.elevation)),
      getAlerts(),
    ]);

    // Build weather map from settled results
    const weatherMap: Record<string, any> = {};
    mvpZones.forEach((zone, i) => {
      const result = results[i];
      if (result.status === 'fulfilled') {
        const data = result.value;
        weatherMap[zone.id] = {
          current: {
            temperature: data.current?.temperature_2m,
            feelsLike: data.current?.apparent_temperature,
            windSpeed: data.current?.wind_speed_10m,
            windDirection: data.current?.wind_direction_10m,
            windGust: data.current?.wind_gusts_10m,
            weatherCode: data.current?.weather_code,
          },
          hourly: data.hourly,
          daily: data.daily,
        };
      }
    });

    // Alerts are the last result
    const alertsResult = results[results.length - 1];
    const alerts = alertsResult.status === 'fulfilled' ? alertsResult.value : [];

    return res.status(200).json({
      zones: mvpZones,
      weather: weatherMap,
      forecast: null,
      alerts,
      updatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message, stack: err.stack?.split('\n').slice(0, 5) });
  }
}
