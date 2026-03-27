import type { Zone, ZoneWeather } from './types';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

const HOURLY_VARS = [
  'temperature_2m',
  'apparent_temperature',
  'wind_speed_10m',
  'wind_direction_10m',
  'wind_gusts_10m',
  'snowfall',
  'snow_depth',
  'precipitation',
  'precipitation_probability',
  'weather_code',
  'visibility',
].join(',');

const DAILY_VARS = [
  'temperature_2m_max',
  'temperature_2m_min',
  'snowfall_sum',
  'precipitation_sum',
  'wind_speed_10m_max',
  'wind_gusts_10m_max',
  'weather_code',
  'sunrise',
  'sunset',
].join(',');

// ─── Raw API response shapes ─────────────────────────────────────

interface OpenMeteoHourly {
  time: string[];
  temperature_2m: number[];
  apparent_temperature: number[];
  wind_speed_10m: number[];
  wind_direction_10m: number[];
  wind_gusts_10m: number[];
  snowfall: number[];
  snow_depth: number[];
  precipitation: number[];
  precipitation_probability: number[];
  weather_code: number[];
  visibility: number[];
}

interface OpenMeteoDaily {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  snowfall_sum: number[];
  precipitation_sum: number[];
  wind_speed_10m_max: number[];
  wind_gusts_10m_max: number[];
  weather_code: number[];
  sunrise: string[];
  sunset: string[];
}

interface OpenMeteoResponse {
  hourly: OpenMeteoHourly;
  daily: OpenMeteoDaily;
}

// ─── Unit conversion helpers ─────────────────────────────────────

// Open-Meteo returns visibility in meters regardless of unit settings.
function metersToMiles(m: number): number {
  return Math.round((m / 1609.344) * 10) / 10;
}

// Open-Meteo returns snow_depth in meters even with inch precipitation.
function snowDepthMetersToInches(m: number): number {
  return Math.round(m * 39.3701 * 10) / 10;
}

// Convert wind direction degrees to cardinal string.
function degreesToCardinal(deg: number): string {
  const directions = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
  ];
  const idx = Math.round(deg / 22.5) % 16;
  return directions[idx];
}

// Map WMO weather codes to human-readable conditions.
function weatherCodeToCondition(code: number): string {
  const map: Record<number, string> = {
    0: 'Clear Sky',
    1: 'Mainly Clear',
    2: 'Partly Cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Rime Fog',
    51: 'Light Drizzle',
    53: 'Moderate Drizzle',
    55: 'Dense Drizzle',
    56: 'Freezing Drizzle (Light)',
    57: 'Freezing Drizzle (Dense)',
    61: 'Light Rain',
    63: 'Moderate Rain',
    65: 'Heavy Rain',
    66: 'Freezing Rain (Light)',
    67: 'Freezing Rain (Heavy)',
    71: 'Light Snow',
    73: 'Moderate Snow',
    75: 'Heavy Snow',
    77: 'Snow Grains',
    80: 'Light Showers',
    81: 'Moderate Showers',
    82: 'Violent Showers',
    85: 'Light Snow Showers',
    86: 'Heavy Snow Showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm w/ Light Hail',
    99: 'Thunderstorm w/ Heavy Hail',
  };
  return map[code] ?? 'Unknown';
}

// Map WMO weather codes to icon identifiers.
function weatherCodeToIcon(code: number): string {
  if (code === 0) return 'clear';
  if (code <= 2) return 'partly-cloudy';
  if (code === 3) return 'cloudy';
  if (code <= 48) return 'fog';
  if (code <= 57) return 'drizzle';
  if (code <= 67) return 'rain';
  if (code <= 77) return 'snow';
  if (code <= 82) return 'showers';
  if (code <= 86) return 'snow-showers';
  return 'thunderstorm';
}

// ─── Public API ──────────────────────────────────────────────────

export async function fetchZoneWeather(zone: Zone): Promise<ZoneWeather> {
  const elevationMeters = Math.round(zone.elevation * 0.3048);

  const params = new URLSearchParams({
    latitude: zone.lat.toString(),
    longitude: zone.lon.toString(),
    elevation: elevationMeters.toString(),
    hourly: HOURLY_VARS,
    daily: DAILY_VARS,
    temperature_unit: 'fahrenheit',
    wind_speed_unit: 'mph',
    precipitation_unit: 'inch',
    timezone: 'America/New_York',
    forecast_days: '7',
  });

  const url = `${BASE_URL}?${params.toString()}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(
      `Open-Meteo API error for zone ${zone.id}: ${res.status} ${res.statusText}`
    );
  }

  const data: OpenMeteoResponse = await res.json();

  // Find the nearest hourly slot to "now" for current conditions.
  const now = new Date();
  const nowHour = now.toISOString().slice(0, 13);
  let currentIdx = data.hourly.time.findIndex((t) => t.startsWith(nowHour));
  if (currentIdx === -1) currentIdx = 0;

  // Build the ZoneWeather response matching the existing interface.
  const zoneWeather: ZoneWeather = {
    zoneId: zone.id,
    fetchedAt: new Date().toISOString(),

    current: {
      tempF: data.hourly.temperature_2m[currentIdx],
      feelsLikeF: data.hourly.apparent_temperature[currentIdx],
      windMph: data.hourly.wind_speed_10m[currentIdx],
      windGustMph: data.hourly.wind_gusts_10m[currentIdx],
      windDirection: degreesToCardinal(data.hourly.wind_direction_10m[currentIdx]),
      humidity: 0, // Open-Meteo doesn't return humidity in this variable set
      precipInches: data.hourly.precipitation[currentIdx],
      snowDepthInches: snowDepthMetersToInches(data.hourly.snow_depth[currentIdx]),
      visibility: metersToMiles(data.hourly.visibility[currentIdx]),
      condition: weatherCodeToCondition(data.hourly.weather_code[currentIdx]),
      icon: weatherCodeToIcon(data.hourly.weather_code[currentIdx]),
    },

    hourly: data.hourly.time.map((time, i) => ({
      time,
      tempF: data.hourly.temperature_2m[i],
      windMph: data.hourly.wind_speed_10m[i],
      windGustMph: data.hourly.wind_gusts_10m[i],
      windDirection: degreesToCardinal(data.hourly.wind_direction_10m[i]),
      precipProbability: data.hourly.precipitation_probability[i],
      precipInches: data.hourly.precipitation[i],
      snowInches: data.hourly.snowfall[i],
      condition: weatherCodeToCondition(data.hourly.weather_code[i]),
      icon: weatherCodeToIcon(data.hourly.weather_code[i]),
    })),

    daily: data.daily.time.map((date, i) => ({
      date,
      highF: data.daily.temperature_2m_max[i],
      lowF: data.daily.temperature_2m_min[i],
      windMph: data.daily.wind_speed_10m_max[i],
      windGustMph: data.daily.wind_gusts_10m_max[i],
      precipProbability: 0, // Not available in daily from Open-Meteo without additional vars
      totalPrecipInches: data.daily.precipitation_sum[i],
      totalSnowInches: data.daily.snowfall_sum[i],
      condition: weatherCodeToCondition(data.daily.weather_code[i]),
      icon: weatherCodeToIcon(data.daily.weather_code[i]),
      sunrise: data.daily.sunrise[i],
      sunset: data.daily.sunset[i],
    })),
  };

  return zoneWeather;
}
