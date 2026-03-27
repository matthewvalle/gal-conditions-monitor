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

  if (zones.length === 0) {
    return (
      <div className="zone-list zone-list--empty">
        <p>No zones loaded.</p>
      </div>
    );
  }

  // Group by subRegion
  const groups = new Map<string, Zone[]>();
  zones.forEach((z) => {
    const list = groups.get(z.subRegion) ?? [];
    list.push(z);
    groups.set(z.subRegion, list);
  });

  return (
    <div className="zone-list">
      {Array.from(groups.entries()).map(([subRegion, groupZones]) => (
        <div key={subRegion} className="zone-list-group">
          <h4 className="zone-list-group-title">{subRegion}</h4>
          <div className="zone-list-items">
            {groupZones.map((zone) => {
              const zw = weather[zone.id];
              const isSelected = zone.id === selectedZoneId;
              // Use server assessment, fall back to client computation
              const serverRating = assessments[zone.id]?.rating;
              const rating = (serverRating as any) || getConditionRating(zw);
              const dotColor = CONDITION_COLORS[rating];

              return (
                <button
                  key={zone.id}
                  className={`zone-pill${isSelected ? ' zone-pill--selected' : ''}`}
                  onClick={() => selectZone(zone.id)}
                >
                  <span
                    className="zone-pill-dot"
                    style={{ backgroundColor: dotColor }}
                  />
                  <span className="zone-pill-name">{zone.name}</span>
                  {zw && (
                    <span className="zone-pill-temp">
                      {Math.round(zw.current.tempF)}&deg;
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
