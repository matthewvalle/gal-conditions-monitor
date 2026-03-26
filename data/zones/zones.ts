import type { Zone } from '../../api/lib/types';
import zoneMetadata from '../zone-metadata.json';

/**
 * All zones loaded from the canonical zone-metadata.json file.
 * Use helper functions to filter by MVP status, state, etc.
 */
export const zones: Zone[] = zoneMetadata as Zone[];

export function getMvpZones(): Zone[] {
  return zones.filter((z) => z.isMvp);
}

export function getZoneById(id: string): Zone | undefined {
  return zones.find((z) => z.id === id);
}

export function getZonesByRegion(region: string): Zone[] {
  return zones.filter((z) => z.region === region);
}

export function getZonesBySubRegion(subRegion: string): Zone[] {
  return zones.filter((z) => z.subRegion === subRegion);
}
