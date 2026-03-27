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

// WMO weather code → human-readable condition
function weatherCodeToCondition(code: number): { condition: string; icon: string } {
  const map: Record<number, { condition: string; icon: string }> = {
    0: { condition: 'Clear', icon: 'clear' },
    1: { condition: 'Mostly Clear', icon: 'mostly-clear' },
    2: { condition: 'Partly Cloudy', icon: 'partly-cloudy' },
    3: { condition: 'Overcast', icon: 'overcast' },
    45: { condition: 'Fog', icon: 'fog' },
    48: { condition: 'Rime Fog', icon: 'fog' },
    51: { condition: 'Light Drizzle', icon: 'drizzle' },
    53: { condition: 'Drizzle', icon: 'drizzle' },
    55: { condition: 'Heavy Drizzle', icon: 'drizzle' },
    56: { condition: 'Freezing Drizzle', icon: 'freezing-rain' },
    57: { condition: 'Freezing Drizzle', icon: 'freezing-rain' },
    61: { condition: 'Light Rain', icon: 'rain' },
    63: { condition: 'Rain', icon: 'rain' },
    65: { condition: 'Heavy Rain', icon: 'rain' },
    66: { condition: 'Freezing Rain', icon: 'freezing-rain' },
    67: { condition: 'Freezing Rain', icon: 'freezing-rain' },
    71: { condition: 'Light Snow', icon: 'snow' },
    73: { condition: 'Snow', icon: 'snow' },
    75: { condition: 'Heavy Snow', icon: 'snow' },
    77: { condition: 'Snow Grains', icon: 'snow' },
    80: { condition: 'Rain Showers', icon: 'rain' },
    81: { condition: 'Rain Showers', icon: 'rain' },
    82: { condition: 'Heavy Rain Showers', icon: 'rain' },
    85: { condition: 'Snow Showers', icon: 'snow' },
    86: { condition: 'Heavy Snow Showers', icon: 'snow' },
    95: { condition: 'Thunderstorm', icon: 'thunderstorm' },
    96: { condition: 'Thunderstorm w/ Hail', icon: 'thunderstorm' },
    99: { condition: 'Thunderstorm w/ Heavy Hail', icon: 'thunderstorm' },
  };
  return map[code] || { condition: 'Unknown', icon: 'unknown' };
}

// Convert wind degrees to cardinal direction
function degreesToCardinal(deg: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}

// Fetch weather from Open-Meteo and transform to ZoneWeather shape
async function getWeather(zoneId: string, lat: number, lon: number, elevation: number) {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    elevation: String(Math.round(elevation * 0.3048)),
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m,weather_code,visibility',
    hourly: 'temperature_2m,snowfall,precipitation,precipitation_probability,wind_speed_10m,wind_gusts_10m,wind_direction_10m,weather_code',
    daily: 'temperature_2m_max,temperature_2m_min,snowfall_sum,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,weather_code,sunrise,sunset',
    temperature_unit: 'fahrenheit',
    wind_speed_unit: 'mph',
    precipitation_unit: 'inch',
    forecast_days: '5',
    timezone: 'America/New_York',
  });

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
  const data = await res.json();

  const { condition, icon } = weatherCodeToCondition(data.current?.weather_code ?? 0);
  const visibilityMeters = data.current?.visibility ?? 10000;

  // Build ZoneWeather matching the TypeScript interface exactly
  return {
    zoneId,
    fetchedAt: new Date().toISOString(),
    current: {
      tempF: Math.round(data.current?.temperature_2m ?? 0),
      feelsLikeF: Math.round(data.current?.apparent_temperature ?? 0),
      windMph: Math.round(data.current?.wind_speed_10m ?? 0),
      windGustMph: Math.round(data.current?.wind_gusts_10m ?? 0),
      windDirection: degreesToCardinal(data.current?.wind_direction_10m ?? 0),
      humidity: data.current?.relative_humidity_2m ?? 0,
      precipInches: 0,
      snowDepthInches: null,
      visibility: Math.round(visibilityMeters * 0.000621371 * 10) / 10, // meters to miles
      condition,
      icon,
    },
    hourly: (data.hourly?.time ?? []).map((t: string, i: number) => ({
      time: t,
      tempF: Math.round(data.hourly.temperature_2m?.[i] ?? 0),
      windMph: Math.round(data.hourly.wind_speed_10m?.[i] ?? 0),
      windGustMph: Math.round(data.hourly.wind_gusts_10m?.[i] ?? 0),
      windDirection: degreesToCardinal(data.hourly.wind_direction_10m?.[i] ?? 0),
      precipProbability: data.hourly.precipitation_probability?.[i] ?? 0,
      precipInches: data.hourly.precipitation?.[i] ?? 0,
      snowInches: data.hourly.snowfall?.[i] ?? 0,
      condition: weatherCodeToCondition(data.hourly.weather_code?.[i] ?? 0).condition,
      icon: weatherCodeToCondition(data.hourly.weather_code?.[i] ?? 0).icon,
    })),
    daily: (data.daily?.time ?? []).map((t: string, i: number) => ({
      date: t,
      highF: Math.round(data.daily.temperature_2m_max?.[i] ?? 0),
      lowF: Math.round(data.daily.temperature_2m_min?.[i] ?? 0),
      windMph: Math.round(data.daily.wind_speed_10m_max?.[i] ?? 0),
      windGustMph: Math.round(data.daily.wind_gusts_10m_max?.[i] ?? 0),
      precipProbability: data.daily.precipitation_probability_max?.[i] ?? 0,
      totalPrecipInches: data.daily.precipitation_sum?.[i] ?? 0,
      totalSnowInches: data.daily.snowfall_sum?.[i] ?? 0,
      condition: weatherCodeToCondition(data.daily.weather_code?.[i] ?? 0).condition,
      icon: weatherCodeToCondition(data.daily.weather_code?.[i] ?? 0).icon,
      sunrise: data.daily.sunrise?.[i] ?? '',
      sunset: data.daily.sunset?.[i] ?? '',
    })),
  };
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
    const results = await Promise.allSettled([
      ...mvpZones.map((z) => getWeather(z.id, z.lat, z.lon, z.elevation)),
      getAlerts(),
    ]);

    const weatherMap: Record<string, any> = {};
    mvpZones.forEach((zone, i) => {
      const result = results[i];
      if (result.status === 'fulfilled') {
        weatherMap[zone.id] = result.value;
      }
    });

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
    return res.status(500).json({ error: err.message });
  }
}
