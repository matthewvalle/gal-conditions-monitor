import type { VercelRequest, VercelResponse } from '@vercel/node';

// MVP zone definitions — Presidential Range (alpine)
const mvpZones = [
  { id: 'tuckerman-ravine', name: 'Tuckerman Ravine', lat: 44.2596, lon: -71.2973, elevation: 4000, region: 'New Hampshire', subRegion: 'Presidential Range', aspect: 'SE', approachMiles: 2.4, isMvp: true, zoneType: 'alpine' as const },
  { id: 'huntington-ravine', name: 'Huntington Ravine', lat: 44.2680, lon: -71.2935, elevation: 4200, region: 'New Hampshire', subRegion: 'Presidential Range', aspect: 'E', approachMiles: 2.5, isMvp: true, zoneType: 'alpine' as const },
  { id: 'gulf-of-slides', name: 'Gulf of Slides', lat: 44.2495, lon: -71.2890, elevation: 3800, region: 'New Hampshire', subRegion: 'Presidential Range', aspect: 'E/SE', approachMiles: 2.8, isMvp: true, zoneType: 'alpine' as const },
  { id: 'great-gulf', name: 'Great Gulf', lat: 44.2795, lon: -71.3050, elevation: 4000, region: 'New Hampshire', subRegion: 'Presidential Range', aspect: 'NE', approachMiles: 3.5, isMvp: true, zoneType: 'alpine' as const },
  { id: 'oakes-gulf', name: 'Oakes Gulf', lat: 44.2470, lon: -71.3130, elevation: 4300, region: 'New Hampshire', subRegion: 'Presidential Range', aspect: 'SE', approachMiles: 4.0, isMvp: true, zoneType: 'alpine' as const },
  { id: 'burt-ammonoosuc-ravines', name: 'Burt and Ammonoosuc Ravines', lat: 44.2720, lon: -71.3310, elevation: 4200, region: 'New Hampshire', subRegion: 'Presidential Range', aspect: 'W/SW', approachMiles: 3.2, isMvp: true, zoneType: 'alpine' as const },
  { id: 'sherburne-ski-trail', name: 'Sherburne Ski Trail', lat: 44.2570, lon: -71.2530, elevation: 2400, region: 'New Hampshire', subRegion: 'Presidential Range', aspect: 'SE', approachMiles: 0, isMvp: true, zoneType: 'alpine' as const },
  { id: 'pinkham-notch', name: 'Pinkham Notch', lat: 44.2573, lon: -71.2530, elevation: 2032, region: 'New Hampshire', subRegion: 'Presidential Range', aspect: '', approachMiles: 0, isMvp: true, zoneType: 'alpine' as const },
];

// GBA glade zone definitions
const gbaZones = [
  { id: 'baldface', name: 'Baldface', lat: 44.2375, lon: -71.015, elevation: 3000, region: 'New Hampshire', subRegion: 'GBA Glades', aspect: 'Various', approachMiles: 3.0, isMvp: false, zoneType: 'glade' as const },
  { id: 'black-white-glade', name: 'Black & White Glade', lat: 44.55, lon: -70.6841, elevation: 2214, region: 'Maine', subRegion: 'GBA Glades', aspect: 'Various', approachMiles: 4.0, isMvp: false, zoneType: 'glade' as const },
  { id: 'bill-hill-glade', name: 'Bill Hill Glade', lat: 44.3866, lon: -71.2047, elevation: 1471, region: 'New Hampshire', subRegion: 'GBA Glades', aspect: 'N', approachMiles: 0.5, isMvp: false, zoneType: 'glade' as const },
  { id: 'cooley-jericho-glade', name: 'Cooley-Jericho Glade', lat: 44.1719, lon: -71.8119, elevation: 2625, region: 'New Hampshire', subRegion: 'GBA Glades', aspect: 'Various', approachMiles: 1.0, isMvp: false, zoneType: 'glade' as const },
  { id: 'hypnosis-glade', name: 'Hypnosis Glade', lat: 43.9025, lon: -71.1246, elevation: 1035, region: 'New Hampshire', subRegion: 'GBA Glades', aspect: 'Various', approachMiles: 0.3, isMvp: false, zoneType: 'glade' as const },
  { id: 'maple-villa-glade', name: 'Maple Villa Glade', lat: 44.0727, lon: -71.1368, elevation: 2200, region: 'New Hampshire', subRegion: 'GBA Glades', aspect: 'N', approachMiles: 1.5, isMvp: false, zoneType: 'glade' as const },
  { id: 'page-hill', name: 'Page Hill', lat: 43.8598, lon: -71.2631, elevation: 1145, region: 'New Hampshire', subRegion: 'GBA Glades', aspect: 'Various', approachMiles: 0.2, isMvp: false, zoneType: 'glade' as const },
  { id: 'prkr-mtn-glades', name: 'PRKR MTN Glades', lat: 44.3291, lon: -71.764, elevation: 1894, region: 'New Hampshire', subRegion: 'GBA Glades', aspect: 'NE', approachMiles: 0.5, isMvp: false, zoneType: 'glade' as const },
  { id: 'the-pike-glades', name: 'The Pike Glades', lat: 43.9735, lon: -71.9536, elevation: 2200, region: 'New Hampshire', subRegion: 'GBA Glades', aspect: 'Various', approachMiles: 1.0, isMvp: false, zoneType: 'glade' as const },
  { id: 'ski-tow-glade', name: 'Ski Tow Glade', lat: 44.452, lon: -71.5704, elevation: 2000, region: 'New Hampshire', subRegion: 'GBA Glades', aspect: 'Various', approachMiles: 0.5, isMvp: false, zoneType: 'glade' as const },
  { id: 'west-side-glade', name: 'West Side Glade', lat: 44.0881, lon: -71.2934, elevation: 1300, region: 'New Hampshire', subRegion: 'GBA Glades', aspect: 'N', approachMiles: 0.5, isMvp: false, zoneType: 'glade' as const },
  { id: 'historic-ccc-trails', name: 'Historic CCC Trails', lat: 44.163, lon: -71.153, elevation: 3950, region: 'New Hampshire', subRegion: 'GBA Glades', aspect: 'Various', approachMiles: 2.0, isMvp: false, zoneType: 'glade' as const },
  { id: 'crescent-ridge-glade', name: 'Crescent Ridge Glade', lat: 44.3919, lon: -71.2863, elevation: 3046, region: 'New Hampshire', subRegion: 'GBA Glades', aspect: 'SE/E', approachMiles: 2.0, isMvp: false, zoneType: 'glade' as const },
];

// All zones combined
const allZones = [...mvpZones, ...gbaZones];

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

// Strip HTML tags to plain text
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
}

// Fetch MWAC avalanche forecast
async function getMwacForecast() {
  try {
    const res = await fetch('https://api.avalanche.org/v2/public/products?avalanche_center_id=MWAC&type=forecast');
    if (!res.ok) throw new Error(`MWAC API ${res.status}`);
    const products = await res.json();

    const forecast = Array.isArray(products)
      ? products.find((p: any) => p.product_type === 'forecast')
      : null;

    if (!forecast) {
      return {
        dangerRating: -1,
        dangerLabel: 'No rating',
        dangerLevels: { alpine: null, treeline: null, belowTreeline: null },
        tomorrowLevels: { alpine: null, treeline: null, belowTreeline: null },
        bottomLine: 'Forecast data unavailable',
        author: '',
        publishedAt: '',
        expiresAt: '',
        source: 'Mount Washington Avalanche Center (USDA Forest Service)',
        sourceUrl: 'https://www.mountwashingtonavalanchecenter.org/forecasts/#/presidential-range',
        disclaimer: 'This data is sourced from MWAC. Always check the official forecast before heading into avalanche terrain.',
      };
    }

    // Parse danger levels from the danger array
    // valid_day "current" = today, "tomorrow" = tomorrow
    const todayDanger = (forecast.danger || []).find((d: any) => d.valid_day === 'current') || {};
    const tomorrowDanger = (forecast.danger || []).find((d: any) => d.valid_day === 'tomorrow') || {};

    // Map: upper=Alpine, middle=Treeline, lower=Below Treeline
    const parseDangerLevel = (val: any) => (typeof val === 'number' && val >= 0 ? val : null);

    return {
      dangerRating: forecast.danger_rating ?? -1,
      dangerLabel: forecast.danger_level_text || 'No rating',
      dangerLevels: {
        alpine: parseDangerLevel(todayDanger.upper),
        treeline: parseDangerLevel(todayDanger.middle),
        belowTreeline: parseDangerLevel(todayDanger.lower),
      },
      tomorrowLevels: {
        alpine: parseDangerLevel(tomorrowDanger.upper),
        treeline: parseDangerLevel(tomorrowDanger.middle),
        belowTreeline: parseDangerLevel(tomorrowDanger.lower),
      },
      bottomLine: forecast.bottom_line ? stripHtml(forecast.bottom_line) : '',
      author: forecast.author || '',
      publishedAt: forecast.published_time || '',
      expiresAt: forecast.expires_time || '',
      source: 'Mount Washington Avalanche Center (USDA Forest Service)',
      sourceUrl: 'https://www.mountwashingtonavalanchecenter.org/forecasts/#/presidential-range',
      disclaimer: 'This data is sourced from MWAC. Always check the official forecast before heading into avalanche terrain.',
    };
  } catch {
    return {
      dangerRating: -1,
      dangerLabel: 'No rating',
      dangerLevels: { alpine: null, treeline: null, belowTreeline: null },
      tomorrowLevels: { alpine: null, treeline: null, belowTreeline: null },
      bottomLine: 'Unable to fetch avalanche forecast. Check mountwashingtonavalanchecenter.org directly.',
      author: '',
      publishedAt: '',
      expiresAt: '',
      source: 'Mount Washington Avalanche Center (USDA Forest Service)',
      sourceUrl: 'https://www.mountwashingtonavalanchecenter.org/forecasts/#/presidential-range',
      disclaimer: 'This data is sourced from MWAC. Always check the official forecast before heading into avalanche terrain.',
    };
  }
}

// Quick assessment: combine weather + avy danger into a single rating per zone
function getQuickAssessment(weather: any, mwacForecast: any): { rating: 'good' | 'fair' | 'poor' | 'dangerous'; reasons: string[] } {
  const reasons: string[] = [];
  let rating: 'good' | 'fair' | 'poor' | 'dangerous' = 'good';

  const current = weather?.current;
  if (!current) return { rating: 'fair', reasons: ['Weather data unavailable'] };

  const avyRating = mwacForecast?.dangerRating ?? -1;
  const gusts = current.windGustMph ?? 0;
  const temp = current.tempF ?? 32;
  const visibility = current.visibility ?? 10;

  // Dangerous conditions
  if (avyRating >= 4) { rating = 'dangerous'; reasons.push(`Avalanche danger: ${mwacForecast?.dangerLabel || 'High/Extreme'}`); }
  if (gusts > 70) { rating = 'dangerous'; reasons.push(`Extreme gusts: ${gusts} mph`); }
  if (temp < -15) { rating = 'dangerous'; reasons.push(`Extreme cold: ${temp}°F`); }

  // Poor conditions
  if (rating !== 'dangerous') {
    if (avyRating >= 3) { rating = 'poor'; reasons.push(`Avalanche danger: ${mwacForecast?.dangerLabel || 'Considerable'}`); }
    if (gusts > 50) { rating = 'poor'; reasons.push(`Very high gusts: ${gusts} mph`); }
    if (temp < 0) { rating = 'poor'; reasons.push(`Very cold: ${temp}°F`); }
  }

  // Fair conditions
  if (rating === 'good') {
    if (avyRating === 2) { rating = 'fair'; reasons.push(`Avalanche danger: ${mwacForecast?.dangerLabel || 'Moderate'}`); }
    if (gusts > 35) { rating = 'fair'; reasons.push(`Strong gusts: ${gusts} mph`); }
    if (temp < 15) { rating = 'fair'; reasons.push(`Cold: ${temp}°F`); }
    if (visibility < 1) { rating = 'fair'; reasons.push('Poor visibility'); }
  }

  if (reasons.length === 0) reasons.push('Conditions look favorable');

  return { rating, reasons };
}

// Quick assessment for GBA glade zones (no MWAC avalanche data)
function getGladeAssessment(weather: any): { rating: 'good' | 'fair' | 'poor'; reasons: string[] } {
  const reasons: string[] = [];
  let rating: 'good' | 'fair' | 'poor' = 'good';

  const current = weather?.current;
  if (!current) return { rating: 'fair', reasons: ['Weather data unavailable'] };

  const gusts = current.windGustMph ?? 0;
  const wind = current.windMph ?? 0;
  const temp = current.tempF ?? 32;

  // Check recent snowfall from hourly data (last 24 hours)
  const recentSnow = (weather.hourly || [])
    .slice(0, 24)
    .reduce((sum: number, h: any) => sum + (h.snowInches || 0), 0);

  // Poor conditions
  if (temp < 0 || temp > 40) {
    rating = 'poor';
    reasons.push(temp < 0 ? `Very cold: ${temp}°F` : `Warm temps: ${temp}°F — potential for poor snow quality`);
  }
  if (gusts > 35 || wind > 35) {
    rating = 'poor';
    reasons.push(`Strong winds: ${wind} mph, gusts ${gusts} mph`);
  }

  // Fair conditions
  if (rating === 'good') {
    if (temp < 15 || temp > 35) {
      rating = 'fair';
      reasons.push(temp < 15 ? `Cold: ${temp}°F` : `Warm: ${temp}°F`);
    }
    if (gusts > 20 || wind > 20) {
      rating = 'fair';
      reasons.push(`Moderate winds: ${wind} mph, gusts ${gusts} mph`);
    }
  }

  // Good conditions boost
  if (rating === 'good' && recentSnow > 2) {
    reasons.push(`Recent snowfall: ${Math.round(recentSnow * 10) / 10}" — fresh conditions likely`);
  }

  reasons.push('MWAC avalanche forecast does not cover this zone. Exercise caution above treeline.');

  if (reasons.length === 1) reasons.unshift('Conditions look favorable for glade skiing');

  return { rating, reasons };
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
      ...allZones.map((z) => getWeather(z.id, z.lat, z.lon, z.elevation)),
      getAlerts(),
      getMwacForecast(),
    ]);

    const weatherMap: Record<string, any> = {};
    allZones.forEach((zone, i) => {
      const result = results[i];
      if (result.status === 'fulfilled') {
        weatherMap[zone.id] = result.value;
      }
    });

    const alertsResult = results[allZones.length];
    const alerts = alertsResult.status === 'fulfilled' ? alertsResult.value : [];

    const forecastResult = results[allZones.length + 1];
    const mwacForecast = forecastResult.status === 'fulfilled' ? forecastResult.value : null;

    // Build per-zone assessments
    const assessments: Record<string, any> = {};
    allZones.forEach((zone) => {
      const weather = weatherMap[zone.id];
      if (zone.zoneType === 'glade') {
        assessments[zone.id] = getGladeAssessment(weather);
      } else {
        assessments[zone.id] = getQuickAssessment(weather, mwacForecast);
      }
    });

    return res.status(200).json({
      zones: allZones,
      weather: weatherMap,
      forecast: mwacForecast,
      assessments,
      alerts,
      updatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
