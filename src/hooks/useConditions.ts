/// <reference types="vite/client" />
import { useQuery } from '@tanstack/react-query';
import type { ZonesResponse, ZoneDetailResponse } from '../../api/lib/types';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

/** Fetch all zones with weather, forecast, and alerts. Refetches every 5 min. */
export function useAllZones() {
  return useQuery<ZonesResponse>({
    queryKey: ['zones'],
    queryFn: () => fetchJson<ZonesResponse>('/api/zones'),
    refetchInterval: 5 * 60 * 1000,
  });
}

/** Fetch detail for a single zone (weather + assessment). */
export function useZoneDetail(zoneId: string | null) {
  return useQuery<ZoneDetailResponse>({
    queryKey: ['zone', zoneId],
    queryFn: () => fetchJson<ZoneDetailResponse>(`/api/zones/${zoneId}`),
    enabled: !!zoneId,
    refetchInterval: 5 * 60 * 1000,
  });
}
