import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { useSelectedZone } from '../../hooks/useSelectedZone';
import ZoneMarker from './ZoneMarker';
import type { Zone, ZoneWeather, MwacForecast } from '../../../lib/types';

interface Props {
  zones: Zone[];
  weather: Record<string, ZoneWeather>;
  forecast: MwacForecast | null;
  isLoading: boolean;
  panelRef: React.RefObject<HTMLDivElement | null>;
}

const MAP_STYLES = {
  standard: {
    label: 'Standard',
    url: 'https://tiles.openfreemap.org/styles/liberty',
  },
  terrain: {
    label: 'Terrain',
    url: 'https://tiles.openfreemap.org/styles/liberty', // base style
    // We'll add terrain layer on top
  },
  satellite: {
    label: 'Satellite',
    url: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
  },
};

// Compute a quick condition rating from weather data
export function getConditionRating(weather: ZoneWeather | undefined): 'good' | 'fair' | 'poor' | 'dangerous' {
  if (!weather?.current) return 'good';
  const { windGustMph, tempF, visibility } = weather.current;

  if (windGustMph > 70 || tempF < -15) return 'dangerous';
  if (windGustMph > 50 || tempF < 0) return 'poor';
  if (windGustMph > 35 || tempF < 15 || visibility < 1) return 'fair';
  return 'good';
}

export const CONDITION_COLORS: Record<string, string> = {
  good: '#4CAF50',
  fair: '#FFC107',
  poor: '#FF9800',
  dangerous: '#F44336',
};

export default function ConditionsMap({ zones, weather, forecast, isLoading, panelRef }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const { selectedZoneId, selectZone } = useSelectedZone();
  const [mapStyle, setMapStyle] = useState<'standard' | 'terrain' | 'satellite'>('standard');

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLES[mapStyle].url,
      center: [-71.30, 44.27],
      zoom: 11,
      attributionControl: false,
      pitch: mapStyle === 'terrain' ? 45 : 0,
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      'bottom-right'
    );

    // Add terrain if available
    map.on('load', () => {
      if (!map.getSource('terrain-source')) {
        map.addSource('terrain-source', {
          type: 'raster-dem',
          tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
          encoding: 'terrarium',
          tileSize: 256,
          maxzoom: 15,
        });
      }
      if (mapStyle === 'terrain') {
        map.setTerrain({ source: 'terrain-source', exaggeration: 1.5 });
      }
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle style changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.setStyle(MAP_STYLES[mapStyle].url);

    map.once('styledata', () => {
      // Re-add terrain source after style change
      if (!map.getSource('terrain-source')) {
        map.addSource('terrain-source', {
          type: 'raster-dem',
          tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
          encoding: 'terrarium',
          tileSize: 256,
          maxzoom: 15,
        });
      }

      if (mapStyle === 'terrain') {
        map.setTerrain({ source: 'terrain-source', exaggeration: 1.5 });
        map.setPitch(45);
      } else {
        map.setTerrain(undefined as any);
        map.setPitch(0);
      }
    });
  }, [mapStyle]);

  // Render markers when zones/weather change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    zones.forEach((zone) => {
      const zoneWeather = weather[zone.id];
      const conditionRating = getConditionRating(zoneWeather);

      const marker = ZoneMarker({
        zone,
        conditionRating,
        isSelected: zone.id === selectedZoneId,
        onClick: () => {
          selectZone(zone.id);
          if (window.innerWidth < 768 && panelRef.current) {
            panelRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        },
        map,
      });

      markersRef.current.push(marker);
    });
  }, [zones, weather, forecast, selectedZoneId, selectZone, panelRef]);

  // Fly to selected zone
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedZoneId) return;

    const zone = zones.find((z) => z.id === selectedZoneId);
    if (zone) {
      map.flyTo({
        center: [zone.lon, zone.lat],
        zoom: 13,
        duration: 1000,
      });
    }
  }, [selectedZoneId, zones]);

  return (
    <div className="map-container">
      <div ref={containerRef} className="map-canvas" />

      {/* Map style toggle */}
      <div className="map-style-toggle">
        {(Object.keys(MAP_STYLES) as Array<keyof typeof MAP_STYLES>).map((key) => (
          <button
            key={key}
            className={`map-style-btn${mapStyle === key ? ' map-style-btn--active' : ''}`}
            onClick={() => setMapStyle(key)}
          >
            {MAP_STYLES[key].label}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="map-loading">
          <div className="map-loading-spinner" />
        </div>
      )}
    </div>
  );
}
