import maplibregl from 'maplibre-gl';
import type { Zone } from '../../../lib/types';
import { CONDITION_COLORS } from './ConditionsMap';

interface ZoneMarkerProps {
  zone: Zone;
  conditionRating: 'good' | 'fair' | 'poor' | 'dangerous';
  isSelected: boolean;
  onClick: () => void;
  map: maplibregl.Map;
}

/** Build rich popup HTML from zone data — automatically adapts to whatever fields exist. */
function buildPopupHTML(zone: Zone): string {
  const rows: string[] = [];

  rows.push(`<div class="zone-popup-row"><span class="zone-popup-label">Elev.</span><span class="zone-popup-value">${zone.elevation.toLocaleString()} ft</span></div>`);

  if (zone.aspect) {
    rows.push(`<div class="zone-popup-row"><span class="zone-popup-label">Aspect</span><span class="zone-popup-value">${zone.aspect}</span></div>`);
  }

  rows.push(`<div class="zone-popup-row"><span class="zone-popup-label">Approach</span><span class="zone-popup-value">${zone.approachMiles} mi</span></div>`);

  return `<div class="zone-popup-name">${zone.name}</div><div class="zone-popup-details">${rows.join('')}</div>`;
}

/** Creates a MapLibre marker for a zone colored by condition rating. */
export default function ZoneMarker({
  zone,
  conditionRating,
  isSelected,
  onClick,
  map,
}: ZoneMarkerProps): maplibregl.Marker {
  const color = CONDITION_COLORS[conditionRating] || CONDITION_COLORS.good;
  const size = isSelected ? 32 : 24;
  const textColor = conditionRating === 'dangerous' ? '#fff' : '#1C1917';

  const el = document.createElement('div');
  el.className = `zone-marker${isSelected ? ' zone-marker--selected' : ''}`;
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.borderRadius = '50%';
  el.style.backgroundColor = color;
  el.style.border = `2px solid ${isSelected ? '#fff' : 'rgba(255,255,255,0.6)'}`;
  el.style.cursor = 'pointer';
  el.style.display = 'flex';
  el.style.alignItems = 'center';
  el.style.justifyContent = 'center';
  el.style.fontSize = isSelected ? '11px' : '9px';
  el.style.fontWeight = '700';
  el.style.color = textColor;
  el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
  el.style.transition = 'all 0.2s ease';
  el.style.zIndex = isSelected ? '10' : '1';
  el.style.fontFamily = 'Inter, sans-serif';

  if (isSelected) {
    el.style.animation = 'markerPulse 1.5s ease-in-out infinite';
  }

  // Short abbreviation
  const abbr = zone.name
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();
  el.textContent = abbr;

  el.addEventListener('click', (e) => {
    e.stopPropagation();
    onClick();
  });

  // Rich hover popover — built from Zone data so it scales automatically
  const popupHTML = buildPopupHTML(zone);
  const popup = new maplibregl.Popup({
    offset: 16,
    closeButton: false,
    closeOnClick: false,
    className: 'zone-marker-popup',
  }).setHTML(popupHTML);

  el.addEventListener('mouseenter', () => popup.addTo(map));
  el.addEventListener('mouseleave', () => popup.remove());

  const marker = new maplibregl.Marker({ element: el })
    .setLngLat([zone.lon, zone.lat])
    .setPopup(popup)
    .addTo(map);

  return marker;
}
