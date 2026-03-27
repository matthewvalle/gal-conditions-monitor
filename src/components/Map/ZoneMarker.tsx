import maplibregl from 'maplibre-gl';
import { getDangerLevel } from '../../utils/dangerScale';
import type { Zone } from '../../../lib/types';

interface ZoneMarkerProps {
  zone: Zone;
  dangerLevel: number;
  isSelected: boolean;
  onClick: () => void;
  map: maplibregl.Map;
}

/** Creates a MapLibre marker for a zone. Returns the Marker instance. */
export default function ZoneMarker({
  zone,
  dangerLevel,
  isSelected,
  onClick,
  map,
}: ZoneMarkerProps): maplibregl.Marker {
  const danger = getDangerLevel(dangerLevel || 1);
  const size = isSelected ? 32 : 24;

  // Build the marker DOM element
  const el = document.createElement('div');
  el.className = `zone-marker${isSelected ? ' zone-marker--selected' : ''}`;
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.borderRadius = '50%';
  el.style.backgroundColor = danger.color;
  el.style.border = `2px solid ${isSelected ? '#fff' : 'rgba(255,255,255,0.6)'}`;
  el.style.cursor = 'pointer';
  el.style.display = 'flex';
  el.style.alignItems = 'center';
  el.style.justifyContent = 'center';
  el.style.fontSize = isSelected ? '11px' : '9px';
  el.style.fontWeight = '700';
  el.style.color = dangerLevel >= 5 ? '#fff' : '#1C1917';
  el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
  el.style.transition = 'all 0.2s ease';
  el.style.zIndex = isSelected ? '10' : '1';

  if (isSelected) {
    el.style.animation = 'markerPulse 1.5s ease-in-out infinite';
  }

  // Short abbreviation
  const abbr = zone.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();
  el.textContent = abbr;

  el.addEventListener('click', (e) => {
    e.stopPropagation();
    onClick();
  });

  // Tooltip
  const popup = new maplibregl.Popup({
    offset: 16,
    closeButton: false,
    closeOnClick: false,
    className: 'zone-marker-popup',
  }).setText(zone.name);

  el.addEventListener('mouseenter', () => popup.addTo(map));
  el.addEventListener('mouseleave', () => popup.remove());

  const marker = new maplibregl.Marker({ element: el })
    .setLngLat([zone.lon, zone.lat])
    .setPopup(popup)
    .addTo(map);

  return marker;
}
