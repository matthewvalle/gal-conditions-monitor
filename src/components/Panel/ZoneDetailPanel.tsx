import { useSelectedZone } from '../../hooks/useSelectedZone';
import TripAssessment from './TripAssessment';
import WeatherCard from './WeatherCard';
import AvalancheCard from './AvalancheCard';
import ForecastTable from './ForecastTable';
import GearSuggestions from './GearSuggestions';
import WindRose from './WindRose';
import type { ZoneDetailResponse } from '../../../lib/types';

interface Props {
  detail: ZoneDetailResponse | null;
  isLoading: boolean;
}

export default function ZoneDetailPanel({ detail, isLoading }: Props) {
  const { selectedZoneId, selectZone } = useSelectedZone();

  if (!selectedZoneId) {
    return (
      <div className="panel-empty">
        <div className="panel-empty-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <h3>Select a zone to view conditions</h3>
        <p>Click a marker on the map or choose a zone from the list below.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="panel-skeleton">
        <div className="skeleton-block skeleton-lg" />
        <div className="skeleton-block skeleton-md" />
        <div className="skeleton-block skeleton-md" />
        <div className="skeleton-block skeleton-sm" />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="panel-error">
        <p>Could not load zone data. Try again later.</p>
      </div>
    );
  }

  const { zone, weather, forecast, assessment } = detail;

  return (
    <div className="zone-panel">
      <div className="zone-panel-header">
        <div className="zone-panel-header-text">
          <h2 className="zone-panel-name">{zone.name}</h2>
          <p className="zone-panel-meta">
            {zone.elevation.toLocaleString()} ft &middot; {zone.subRegion}
            {zone.aspect && <> &middot; {zone.aspect} aspect</>}
          </p>
        </div>
        <button
          className="zone-panel-close"
          onClick={() => selectZone(null)}
          aria-label="Close panel"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {assessment && <TripAssessment assessment={assessment} />}

      <div className="zone-panel-weather-row">
        <WeatherCard weather={weather} />
        <WindRose
          direction={weather.current.windDirection}
          speed={weather.current.windMph}
          gust={weather.current.windGustMph}
        />
      </div>

      <AvalancheCard forecast={forecast} />
      <ForecastTable daily={weather.daily} />
      {assessment && <GearSuggestions gear={assessment.gear} />}
    </div>
  );
}
