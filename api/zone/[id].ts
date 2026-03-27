import type { VercelRequest, VercelResponse } from '@vercel/node';

// Same MVP zones as the /api/zones endpoint
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

function weatherCodeToCondition(code: number): string {
  const map: Record<number, string> = {
    0: 'Clear', 1: 'Mostly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Rime Fog', 51: 'Light Drizzle', 53: 'Drizzle',
    55: 'Heavy Drizzle', 56: 'Freezing Drizzle', 57: 'Freezing Drizzle',
    61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain',
    66: 'Freezing Rain', 67: 'Freezing Rain',
    71: 'Light Snow', 73: 'Snow', 75: 'Heavy Snow', 77: 'Snow Grains',
    80: 'Rain Showers', 81: 'Rain Showers', 82: 'Heavy Showers',
    85: 'Snow Showers', 86: 'Heavy Snow Showers',
    95: 'Thunderstorm', 96: 'Thunderstorm w/ Hail', 99: 'Severe Thunderstorm',
  };
  return map[code] || 'Unknown';
}

function degreesToCardinal(deg: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
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

    const todayDanger = (forecast.danger || []).find((d: any) => d.valid_day === 'current') || {};
    const tomorrowDanger = (forecast.danger || []).find((d: any) => d.valid_day === 'tomorrow') || {};

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

// Inline gear suggestions based on conditions
function getGearSuggestions(current: any, daily: any[]) {
  const suggestions: any[] = [];

  if (current.windGustMph > 50) {
    suggestions.push({ text: 'Extreme wind — hardshell, ski goggles, and ski crampons essential', priority: 'essential', category: 'protection', reviewUrl: '/grivel-ski-tour-skimatic-review/' });
  } else if (current.windGustMph > 35) {
    suggestions.push({ text: 'High winds forecast — bring hardshell and goggles', priority: 'essential', category: 'protection', reviewUrl: '/best-ski-goggles-2026/' });
  }

  if (current.tempF < -10) {
    suggestions.push({ text: 'Extreme cold — heavy insulation, face protection, chemical warmers', priority: 'essential', category: 'warmth', reviewUrl: '/darn-tough-thermolite-rfl-review/' });
  } else if (current.tempF < 10) {
    suggestions.push({ text: 'Cold conditions — insulated layer and warm socks essential', priority: 'essential', category: 'warmth', reviewUrl: '/best-ski-socks-2026/' });
  }

  const totalSnow = daily.slice(0, 2).reduce((sum: number, d: any) => sum + (d.totalSnowInches || 0), 0);
  if (totalSnow > 8) {
    suggestions.push({ text: `${Math.round(totalSnow)}" of new snow expected — wider skis and avalanche awareness critical`, priority: 'essential', category: 'snow', reviewUrl: '/best-backcountry-skis-2026/' });
  } else if (totalSnow > 3) {
    suggestions.push({ text: `${Math.round(totalSnow)}" of fresh snow forecast — good powder conditions`, priority: 'recommended', category: 'snow', reviewUrl: '/best-climbing-skins-2026/' });
  }

  suggestions.push({ text: 'Navigation app for backcountry routing', priority: 'recommended', category: 'navigation', reviewUrl: '/best-backcountry-ski-apps-2026/' });
  suggestions.push({ text: 'Check avalanche forecast before heading out', priority: 'essential', category: 'safety', reviewUrl: '/best-avalanche-resources-2026/' });

  return suggestions;
}

// Trip assessment factoring in weather + avalanche danger
function getTripAssessment(current: any, mwacForecast: any) {
  const reasons: string[] = [];
  let level = 'good';

  const avyRating = mwacForecast?.dangerRating ?? -1;
  const gusts = current.windGustMph ?? 0;
  const temp = current.tempF ?? 32;
  const visibility = current.visibility ?? 10;

  // Dangerous conditions
  if (avyRating >= 4) { level = 'dangerous'; reasons.push(`Avalanche danger: ${mwacForecast?.dangerLabel || 'High/Extreme'}`); }
  if (gusts > 70) { level = 'dangerous'; reasons.push(`Extreme gusts: ${gusts} mph`); }
  if (temp < -15) { level = 'dangerous'; reasons.push(`Extreme cold: ${temp}°F`); }

  // Poor conditions
  if (level !== 'dangerous') {
    if (avyRating >= 3) { level = 'poor'; reasons.push(`Avalanche danger: ${mwacForecast?.dangerLabel || 'Considerable'}`); }
    if (gusts > 50) { level = 'poor'; reasons.push(`Very high gusts: ${gusts} mph`); }
    if (temp < 0) { level = 'poor'; reasons.push(`Very cold: ${temp}°F`); }
  }

  // Fair conditions
  if (level === 'good') {
    if (avyRating === 2) { level = 'fair'; reasons.push(`Avalanche danger: ${mwacForecast?.dangerLabel || 'Moderate'}`); }
    if (gusts > 35) { level = 'fair'; reasons.push(`Strong gusts: ${gusts} mph`); }
    if (temp < 15) { level = 'fair'; reasons.push(`Cold: ${temp}°F`); }
    if (visibility < 1) { level = 'fair'; reasons.push('Poor visibility'); }
  }

  if (reasons.length === 0) reasons.push('Conditions look favorable');

  const labels: Record<string, string> = {
    good: 'Good conditions for touring',
    fair: 'Fair — check details before heading out',
    poor: 'Caution advised — challenging conditions',
    dangerous: 'Not recommended — dangerous conditions',
  };

  return { overallRating: level, summary: labels[level] || labels.fair, reasons };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  const zoneId = Array.isArray(id) ? id[0] : id;
  if (!zoneId) return res.status(400).json({ error: 'Zone ID required' });

  const zone = mvpZones.find((z) => z.id === zoneId);
  if (!zone) return res.status(404).json({ error: `Zone "${zoneId}" not found` });

  try {
    // Fetch weather from Open-Meteo
    const params = new URLSearchParams({
      latitude: String(zone.lat), longitude: String(zone.lon),
      elevation: String(Math.round(zone.elevation * 0.3048)),
      current: 'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m,weather_code,visibility',
      hourly: 'temperature_2m,snowfall,precipitation,precipitation_probability,wind_speed_10m,wind_gusts_10m,wind_direction_10m,weather_code',
      daily: 'temperature_2m_max,temperature_2m_min,snowfall_sum,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,weather_code,sunrise,sunset',
      temperature_unit: 'fahrenheit', wind_speed_unit: 'mph', precipitation_unit: 'inch',
      forecast_days: '5', timezone: 'America/New_York',
    });

    const meteoRes = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
    const data = await meteoRes.json();

    const condition = weatherCodeToCondition(data.current?.weather_code ?? 0);
    const visibilityMi = Math.round((data.current?.visibility ?? 10000) * 0.000621371 * 10) / 10;

    const weather = {
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
        visibility: visibilityMi,
        condition,
        icon: condition.toLowerCase().replace(/\s+/g, '-'),
      },
      hourly: (data.hourly?.time ?? []).map((t: string, i: number) => ({
        time: t, tempF: Math.round(data.hourly.temperature_2m?.[i] ?? 0),
        windMph: Math.round(data.hourly.wind_speed_10m?.[i] ?? 0),
        windGustMph: Math.round(data.hourly.wind_gusts_10m?.[i] ?? 0),
        windDirection: degreesToCardinal(data.hourly.wind_direction_10m?.[i] ?? 0),
        precipProbability: data.hourly.precipitation_probability?.[i] ?? 0,
        precipInches: data.hourly.precipitation?.[i] ?? 0,
        snowInches: data.hourly.snowfall?.[i] ?? 0,
        condition: weatherCodeToCondition(data.hourly.weather_code?.[i] ?? 0),
        icon: weatherCodeToCondition(data.hourly.weather_code?.[i] ?? 0).toLowerCase().replace(/\s+/g, '-'),
      })),
      daily: (data.daily?.time ?? []).map((t: string, i: number) => ({
        date: t, highF: Math.round(data.daily.temperature_2m_max?.[i] ?? 0),
        lowF: Math.round(data.daily.temperature_2m_min?.[i] ?? 0),
        windMph: Math.round(data.daily.wind_speed_10m_max?.[i] ?? 0),
        windGustMph: Math.round(data.daily.wind_gusts_10m_max?.[i] ?? 0),
        precipProbability: data.daily.precipitation_probability_max?.[i] ?? 0,
        totalPrecipInches: data.daily.precipitation_sum?.[i] ?? 0,
        totalSnowInches: data.daily.snowfall_sum?.[i] ?? 0,
        condition: weatherCodeToCondition(data.daily.weather_code?.[i] ?? 0),
        icon: weatherCodeToCondition(data.daily.weather_code?.[i] ?? 0).toLowerCase().replace(/\s+/g, '-'),
        sunrise: data.daily.sunrise?.[i] ?? '', sunset: data.daily.sunset?.[i] ?? '',
      })),
    };

    // Fetch MWAC forecast in parallel (don't block on failure)
    let mwacForecast = null;
    try {
      mwacForecast = await getMwacForecast();
    } catch {
      // MWAC fetch failed — continue with null forecast
    }

    const assessment = getTripAssessment(weather.current, mwacForecast);
    const gearSuggestions = getGearSuggestions(weather.current, weather.daily);

    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({
      zone,
      weather,
      forecast: mwacForecast,
      alerts: [],
      assessment,
      gearSuggestions,
      updatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
