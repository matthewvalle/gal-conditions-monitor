import { useState } from 'react';
import { useSelectedZone } from '../../hooks/useSelectedZone';
import { getConditionRating, CONDITION_COLORS } from '../Map/ConditionsMap';
import type { Zone, ZoneWeather } from '../../../lib/types';

interface Props {
  zones: Zone[];
  weather: Record<string, ZoneWeather>;
  assessments: Record<string, { rating: string; reasons: string[] }>;
}

export default function ZoneList({ zones, weather, assessments }: Props) {
  const { selectedZoneId, selectZone } = useSelectedZone();

  // Group by subRegion
  const groups = new Map<string, Zone[]>();
  zones.forEach((z) => {
    const list = groups.get(z.subRegion) ?? [];
    list.push(z);
    groups.set(z.subRegion, list);
  });

  // Default: Presidential Range expanded, others collapsed
  const defaultExpanded = new Set<string>();
  groups.forEach((_, key) => {
    if (key === 'Presidential Range') defaultExpanded.add(key);
  });
  const [expanded, setExpanded] = useState<Set<string>>(defaultExpanded);

  if (zones.length === 0) {
    return (
      <div className="zone-selector zone-selector--empty">
        <p>No zones loaded.</p>
      </div>
    );
  }

  const toggleGroup = (groupName: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(groupName)) {
        next.delete(groupName);
      } else {
        next.add(groupName);
      }
      return next;
    });
  };

  return (
    <div className="zone-selector">
      {Array.from(groups.entries()).map(([subRegion, groupZones]) => {
        const isExpanded = expanded.has(subRegion);
        return (
          <div key={subRegion} className="zone-group">
            <button
              className="zone-group-header"
              onClick={() => toggleGroup(subRegion)}
              aria-expanded={isExpanded}
            >
              <span className="zone-group-name">{subRegion}</span>
              <span className="zone-group-count">{groupZones.length}</span>
              <svg
                className={`zone-group-chevron${isExpanded ? ' zone-group-chevron--open' : ''}`}
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {isExpanded && (
              <div className="zone-group-list">
                {groupZones.map((zone) => {
                  const zw = weather[zone.id];
                  const isSelected = zone.id === selectedZoneId;
                  const serverRating = assessments[zone.id]?.rating;
                  const rating = (serverRating as any) || getConditionRating(zw);
                  const dotColor = CONDITION_COLORS[rating];

                  return (
                    <button
                      key={zone.id}
                      className={`zone-row${isSelected ? ' zone-row--selected' : ''}`}
                      onClick={() => selectZone(zone.id)}
                    >
                      <span
                        className="zone-row-dot"
                        style={{ backgroundColor: dotColor }}
                      />
                      <span className="zone-row-name">{zone.name}</span>
                      {zw && (
                        <span className="zone-row-temp">
                          {Math.round(zw.current.tempF)}&deg;
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
