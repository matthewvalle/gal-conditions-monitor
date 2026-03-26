import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { useSelectedZone } from '../../hooks/useSelectedZone';
import ZoneMarker from './ZoneMarker';
import type { Zone, ZoneWeather, MwacForecast } from '../../../api/lib/types';

interface Props {
  zones: Zone[];
  weather: Record<string, ZoneWeather>;
  forecast: MwacForecast | null;
  isLoading: boolean;
  panelRef: React.RefObject<HTMLDivElement | null>;
}

export default function ConditionsMap({ zones, weather, forecast, isLoading, panelRef }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const { selectedZoneId, selectZone } = useSelectedZone();

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [-71.30, 44.27],
      zoom: 11,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      'bottom-right'
    );

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Render markers when zones change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear previous markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    zones.forEach((zone) => {
      const zoneWeather = weather[zone.id];
      const dangerLevel = forecast?.dangerLevel?.alpine ?? 0;

      const marker = ZoneMarker({
        zone,
        dangerLevel,
        isSelected: zone.id === selectedZoneId,
        onClick: () => {
          selectZone(zone.id);
          // On mobile, scroll to detail panel
          if (window.innerWidth < 768 && panelRef.current) {
            panelRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        },
        map,
      });

      markersRef.current.push(marker);
    });
  }, [zones, weather, forecast, selectedZoneId, selectZone, panelRef]);

  return (
    <div className="map-container">
      <div ref={containerRef} className="map-canvas" />
      {isLoading && (
        <div className="map-loading">
          <div className="map-loading-spinner" />
        </div>
      )}
    </div>
  );
}
