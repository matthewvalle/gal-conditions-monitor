/** A backcountry zone with geographic and descriptive metadata. */
export interface Zone {
  id: string;
  name: string;
  lat: number;
  lon: number;
  elevation: number; // feet
  region: string;
  subRegion: string;
  aspect?: string;
  approachMiles: number;
  isMvp: boolean;
  zoneType: 'alpine' | 'glade';
}

/** Current and forecasted weather for a single zone. */
export interface ZoneWeather {
  zoneId: string;
  fetchedAt: string; // ISO 8601
  current: {
    tempF: number;
    feelsLikeF: number;
    windMph: number;
    windGustMph: number;
    windDirection: string; // cardinal, e.g. "NW"
    humidity: number; // percent
    precipInches: number;
    snowDepthInches: number | null;
    visibility: number; // miles
    condition: string; // e.g. "Partly Cloudy"
    icon: string;
  };
  hourly: Array<{
    time: string; // ISO 8601
    tempF: number;
    windMph: number;
    windGustMph: number;
    windDirection: string;
    precipProbability: number; // percent
    precipInches: number;
    snowInches: number;
    condition: string;
    icon: string;
  }>;
  daily: Array<{
    date: string; // YYYY-MM-DD
    highF: number;
    lowF: number;
    windMph: number;
    windGustMph: number;
    precipProbability: number;
    totalPrecipInches: number;
    totalSnowInches: number;
    condition: string;
    icon: string;
    sunrise: string;
    sunset: string;
  }>;
}

/** MWAC avalanche forecast for the Presidential Range. */
export interface MwacForecast {
  fetchedAt: string; // ISO 8601
  issuedAt: string; // ISO 8601
  expiresAt: string; // ISO 8601
  dangerLevel: {
    alpine: DangerRating;
    belowTreeline: DangerRating;
    treeline: DangerRating;
  };
  bottomLine: string; // summary text
  problems: Array<{
    type: string; // e.g. "Wind Slab", "Loose Wet"
    aspects: string[]; // e.g. ["N", "NE", "E"]
    elevations: string[]; // e.g. ["Alpine", "Treeline"]
    likelihood: string; // e.g. "Likely", "Possible"
    size: string; // e.g. "Small", "Large"
  }>;
  detailUrl: string;
}

/** Avalanche danger rating 1-5. */
export type DangerRating = 1 | 2 | 3 | 4 | 5;

/** NWS weather alert for a zone or region. */
export interface NwsAlert {
  id: string;
  zoneId: string;
  event: string; // e.g. "Winter Storm Warning"
  severity: 'Extreme' | 'Severe' | 'Moderate' | 'Minor' | 'Unknown';
  urgency: 'Immediate' | 'Expected' | 'Future' | 'Past' | 'Unknown';
  headline: string;
  description: string;
  instruction: string | null;
  areaDesc: string; // e.g. "Northern Coos; Southern Coos; Grafton"
  onset: string; // ISO 8601
  expires: string; // ISO 8601
  fetchedAt: string; // ISO 8601
}

/** Trip assessment generated from weather + avy data for a zone. */
export interface TripAssessment {
  zoneId: string;
  generatedAt: string; // ISO 8601
  overallRating: 'excellent' | 'good' | 'fair' | 'poor' | 'dangerous';
  confidence: number; // 0-1
  summary: string;
  factors: Array<{
    name: string; // e.g. "Avalanche Danger", "Wind", "Temperature"
    rating: 'green' | 'yellow' | 'orange' | 'red';
    detail: string;
  }>;
  gear: GearSuggestion[];
}

/** Gear suggestion based on conditions. */
export interface GearSuggestion {
  item: string; // e.g. "Ski crampons"
  reason: string;
  priority: 'essential' | 'recommended' | 'optional';
}

/** Response shape for GET /api/zones */
export interface ZonesResponse {
  zones: Zone[];
  weather: Record<string, ZoneWeather>;
  forecast: MwacForecast | null;
  alerts: NwsAlert[];
  updatedAt: string; // ISO 8601
}

/** Response shape for GET /api/zones/:id */
export interface ZoneDetailResponse {
  zone: Zone;
  weather: ZoneWeather;
  forecast: MwacForecast | null;
  alerts: NwsAlert[];
  assessment: TripAssessment | null;
  updatedAt: string; // ISO 8601
}
