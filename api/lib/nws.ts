import type { NwsAlert } from './types';

const NWS_BASE = 'https://api.weather.gov';
const USER_AGENT = 'GraniteAlpineLab/1.0 (conditions-monitor)';

// States supported by the monitor
export type SupportedState = 'NH' | 'VT' | 'ME' | 'NY' | 'MA';

// ─── Raw NWS response shapes ────────────────────────────────────

interface NwsAlertFeature {
  id: string;
  properties: {
    event: string;
    severity: 'Extreme' | 'Severe' | 'Moderate' | 'Minor' | 'Unknown';
    urgency: 'Immediate' | 'Expected' | 'Future' | 'Past' | 'Unknown';
    headline: string | null;
    description: string;
    instruction: string | null;
    onset: string;
    expires: string;
    areaDesc: string;
  };
}

interface NwsAlertsResponse {
  features: NwsAlertFeature[];
}

// ─── Public API ──────────────────────────────────────────────────

export async function fetchAlerts(state: SupportedState): Promise<NwsAlert[]> {
  const url = `${NWS_BASE}/alerts/active?area=${state}`;

  const res = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'application/geo+json',
    },
  });

  if (!res.ok) {
    throw new Error(
      `NWS API error for state ${state}: ${res.status} ${res.statusText}`
    );
  }

  const data: NwsAlertsResponse = await res.json();

  return data.features.map((feature) => ({
    id: feature.id,
    zoneId: '', // Will be matched to zones by areaDesc in the route layer
    event: feature.properties.event,
    severity: feature.properties.severity,
    urgency: feature.properties.urgency,
    headline: feature.properties.headline ?? '',
    description: feature.properties.description ?? '',
    instruction: feature.properties.instruction,
    onset: feature.properties.onset ?? '',
    expires: feature.properties.expires ?? '',
    fetchedAt: new Date().toISOString(),
  }));
}

/**
 * Fetch alerts for multiple states and deduplicate by alert ID.
 */
export async function fetchAlertsMultiState(
  states: SupportedState[]
): Promise<NwsAlert[]> {
  const results = await Promise.allSettled(states.map(fetchAlerts));

  const alerts: NwsAlert[] = [];
  const seen = new Set<string>();

  for (const result of results) {
    if (result.status === 'fulfilled') {
      for (const alert of result.value) {
        if (!seen.has(alert.id)) {
          seen.add(alert.id);
          alerts.push(alert);
        }
      }
    } else {
      console.error('[NWS] Failed to fetch alerts for a state:', result.reason);
    }
  }

  return alerts;
}
