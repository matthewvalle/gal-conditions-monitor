import type { ZoneWeather, MwacForecast, TripAssessment, GearSuggestion } from './types';

type OverallRating = TripAssessment['overallRating'];
type FactorRating = 'green' | 'yellow' | 'orange' | 'red';

/**
 * Computes a Go / No-Go trip assessment based on weather and avalanche data.
 *
 * Rating priority (highest severity wins):
 *   dangerous > poor > fair > good > excellent
 *
 * Returns a full TripAssessment with per-factor ratings and gear suggestions.
 * Gear suggestions are populated separately by the gear-suggestions module.
 */
export function computeTripAssessment(
  weather: ZoneWeather,
  mwac: MwacForecast | null,
  gear: GearSuggestion[] = []
): TripAssessment {
  const factors: TripAssessment['factors'] = [];
  let overallRating: OverallRating = 'excellent';

  const { current } = weather;

  // Get the highest danger level across all elevation bands.
  const maxAvyDanger = mwac
    ? Math.max(
        mwac.dangerLevel.alpine,
        mwac.dangerLevel.treeline,
        mwac.dangerLevel.belowTreeline
      )
    : 0;

  // ─── Avalanche danger factor ───────────────────────────────

  if (mwac) {
    let avyRating: FactorRating = 'green';
    let avyDetail = '';

    if (maxAvyDanger >= 4) {
      avyRating = 'red';
      avyDetail = `Avalanche danger is ${dangerLabel(maxAvyDanger)} (level ${maxAvyDanger}) — backcountry travel not recommended`;
      overallRating = escalate(overallRating, 'dangerous');
    } else if (maxAvyDanger >= 3) {
      avyRating = 'orange';
      avyDetail = `Avalanche danger is Considerable (level ${maxAvyDanger}) — careful terrain selection required`;
      overallRating = escalate(overallRating, 'poor');
    } else if (maxAvyDanger === 2) {
      avyRating = 'yellow';
      avyDetail = 'Avalanche danger is Moderate (level 2) — evaluate terrain carefully';
      overallRating = escalate(overallRating, 'fair');
    } else {
      avyRating = 'green';
      avyDetail = `Avalanche danger is ${dangerLabel(maxAvyDanger)} (level ${maxAvyDanger})`;
    }

    factors.push({ name: 'Avalanche Danger', rating: avyRating, detail: avyDetail });
  }

  // ─── Wind factor ───────────────────────────────────────────

  {
    let windRating: FactorRating = 'green';
    let windDetail = '';

    if (current.windGustMph > 80) {
      windRating = 'red';
      windDetail = `Extreme wind gusts of ${Math.round(current.windGustMph)} mph — dangerous exposed terrain`;
      overallRating = escalate(overallRating, 'dangerous');
    } else if (current.windGustMph > 50) {
      windRating = 'orange';
      windDetail = `Strong wind gusts of ${Math.round(current.windGustMph)} mph — exposed ridgelines hazardous`;
      overallRating = escalate(overallRating, 'poor');
    } else if (current.windGustMph > 35) {
      windRating = 'yellow';
      windDetail = `Moderate wind gusts of ${Math.round(current.windGustMph)} mph — be prepared on ridgelines`;
      overallRating = escalate(overallRating, 'fair');
    } else {
      windDetail = `Wind gusts at ${Math.round(current.windGustMph)} mph`;
    }

    factors.push({ name: 'Wind', rating: windRating, detail: windDetail });
  }

  // ─── Temperature factor ────────────────────────────────────

  {
    let tempRating: FactorRating = 'green';
    let tempDetail = '';

    if (current.tempF < -20) {
      tempRating = 'red';
      tempDetail = `Extreme cold: ${Math.round(current.tempF)}°F — severe frostbite risk`;
      overallRating = escalate(overallRating, 'dangerous');
    } else if (current.tempF < -10) {
      tempRating = 'orange';
      tempDetail = `Very cold: ${Math.round(current.tempF)}°F — limit skin exposure, watch for frostbite`;
      overallRating = escalate(overallRating, 'poor');
    } else if (current.tempF < 0) {
      tempRating = 'yellow';
      tempDetail = `Cold: ${Math.round(current.tempF)}°F — dress in layers, protect extremities`;
      overallRating = escalate(overallRating, 'fair');
    } else {
      tempDetail = `Temperature: ${Math.round(current.tempF)}°F`;
    }

    factors.push({ name: 'Temperature', rating: tempRating, detail: tempDetail });
  }

  // ─── Visibility factor ────────────────────────────────────

  {
    let visRating: FactorRating = 'green';
    let visDetail = '';

    if (current.visibility < 0.25) {
      visRating = 'red';
      visDetail = `Near-zero visibility (${current.visibility} mi) — whiteout conditions`;
      overallRating = escalate(overallRating, 'poor');
    } else if (current.visibility < 1) {
      visRating = 'orange';
      visDetail = `Low visibility (~${current.visibility} mi) — navigation very challenging`;
      overallRating = escalate(overallRating, 'fair');
    } else if (current.visibility < 3) {
      visRating = 'yellow';
      visDetail = `Reduced visibility (~${current.visibility} mi) — stay aware of route`;
      overallRating = escalate(overallRating, 'fair');
    } else {
      visDetail = `Good visibility (${current.visibility} mi)`;
    }

    factors.push({ name: 'Visibility', rating: visRating, detail: visDetail });
  }

  // ─── Build summary ─────────────────────────────────────────

  const summaryParts = factors
    .filter((f) => f.rating !== 'green')
    .map((f) => f.detail);

  const summary =
    summaryParts.length > 0
      ? summaryParts.join('. ') + '.'
      : 'Conditions look good for backcountry travel. Standard precautions apply.';

  return {
    zoneId: weather.zoneId,
    generatedAt: new Date().toISOString(),
    overallRating,
    confidence: mwac ? 0.85 : 0.5, // Lower confidence without avy data
    summary,
    factors,
    gear,
  };
}

// ─── Helpers ─────────────────────────────────────────────────────

const SEVERITY_ORDER: OverallRating[] = [
  'excellent',
  'good',
  'fair',
  'poor',
  'dangerous',
];

function escalate(current: OverallRating, candidate: OverallRating): OverallRating {
  const currentIdx = SEVERITY_ORDER.indexOf(current);
  const candidateIdx = SEVERITY_ORDER.indexOf(candidate);
  return candidateIdx > currentIdx ? candidate : current;
}

function dangerLabel(level: number): string {
  const labels: Record<number, string> = {
    1: 'Low',
    2: 'Moderate',
    3: 'Considerable',
    4: 'High',
    5: 'Extreme',
  };
  return labels[level] ?? 'Unknown';
}
