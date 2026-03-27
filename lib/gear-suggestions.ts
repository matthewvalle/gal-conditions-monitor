import type { ZoneWeather, GearSuggestion } from './types';

/**
 * Generates contextual gear suggestions based on current weather conditions.
 * Each suggestion links to the relevant GAL review or buying guide page.
 */
export function getGearSuggestions(weather: ZoneWeather): GearSuggestion[] {
  const suggestions: GearSuggestion[] = [];
  const { current, daily } = weather;

  // Calculate next-24h snowfall from daily forecast
  const next24hSnow = daily.length > 0 ? daily[0].totalSnowInches : 0;

  // ─── Wind-based suggestions ────────────────────────────────

  if (current.windGustMph > 50) {
    suggestions.push({
      item: 'Ski crampons',
      reason: 'Consider ski crampons for icy exposed terrain',
      priority: 'essential',
    });
  }

  if (current.windGustMph > 40) {
    suggestions.push({
      item: 'Hardshell jacket and goggles',
      reason: 'Hardshell and goggles essential — high wind expected',
      priority: 'essential',
    });
  }

  // ─── Temperature-based suggestions ─────────────────────────

  if (current.tempF < -10) {
    suggestions.push({
      item: 'Chemical hand warmers and face protection',
      reason: 'Extreme cold — chemical hand warmers, face protection mandatory',
      priority: 'essential',
    });
  }

  if (current.tempF < 0) {
    suggestions.push({
      item: 'Heavy insulation layer and warm socks',
      reason: 'Heavy insulation layer, check boot warmth',
      priority: 'essential',
    });
  }

  // ─── Snowfall-based suggestions ────────────────────────────

  if (next24hSnow > 12) {
    suggestions.push({
      item: 'Avalanche awareness gear',
      reason: 'Significant new snow — avalanche awareness critical',
      priority: 'essential',
    });
  }

  if (next24hSnow > 6) {
    suggestions.push({
      item: 'Wider skis',
      reason: 'Deep snow expected — wider skis recommended',
      priority: 'recommended',
    });
  }

  // ─── Visibility-based suggestions ──────────────────────────

  if (current.visibility < 3) {
    suggestions.push({
      item: 'GPS device or offline maps app',
      reason: 'Low visibility — GPS device or app with offline maps strongly recommended',
      priority: current.visibility < 1 ? 'essential' : 'recommended',
    });
  }

  // ─── Universal suggestions (always relevant) ──────────────

  suggestions.push({
    item: 'Navigation app',
    reason: 'Navigation app essential for backcountry touring',
    priority: 'recommended',
  });

  suggestions.push({
    item: 'Avalanche forecast check',
    reason: 'Check avalanche forecast before heading out',
    priority: 'essential',
  });

  suggestions.push({
    item: 'Beacon, probe, and shovel',
    reason: 'Carry full avalanche rescue kit: beacon, probe, shovel',
    priority: 'essential',
  });

  return suggestions;
}
