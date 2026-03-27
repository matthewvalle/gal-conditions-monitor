import { useSelectedZone } from '../../hooks/useSelectedZone';
import TripAssessment from './TripAssessment';
import WeatherCard from './WeatherCard';
import AvalancheCard from './AvalancheCard';
import ForecastTable from './ForecastTable';
import GearSuggestions from './GearSuggestions';
import WindRose from './WindRose';
import ZoneInfo from './ZoneInfo';
import type { ZoneDetailResponse } from '../../../lib/types';

interface Props {
  detail: ZoneDetailResponse | null;
  isLoading: boolean;
  zones?: any[];
  weather?: Record<string, any>;
  forecast?: any;
  assessments?: Record<string, any>;
}

const DANGER_LABELS: Record<number, string> = {
  1: 'Low',
  2: 'Moderate',
  3: 'Considerable',
  4: 'High',
  5: 'Extreme',
};

const DANGER_COLORS: Record<number, string> = {
  1: 'var(--danger-low)',
  2: 'var(--danger-moderate)',
  3: 'var(--danger-considerable)',
  4: 'var(--danger-high)',
  5: 'var(--danger-extreme)',
};

const RATING_COLORS: Record<string, string> = {
  good: 'var(--danger-low)',
  fair: 'var(--danger-moderate)',
  poor: 'var(--danger-considerable)',
  dangerous: 'var(--danger-high)',
};

export default function ZoneDetailPanel({ detail, isLoading, zones, weather, forecast, assessments }: Props) {
  const { selectedZoneId, selectZone } = useSelectedZone();

  if (!selectedZoneId) {
    // Compute summary data for the empty state dashboard
    const temps: number[] = [];
    if (weather) {
      Object.values(weather).forEach((w: any) => {
        if (w?.current?.tempF != null) temps.push(w.current.tempF);
      });
    }
    const minTemp = temps.length > 0 ? Math.min(...temps) : null;
    const maxTemp = temps.length > 0 ? Math.max(...temps) : null;

    const avyRating = forecast?.dangerRating ?? -1;
    const avyLabel = avyRating > 0 ? DANGER_LABELS[avyRating] || 'Unknown' : null;
    const avyColor = avyRating > 0 ? DANGER_COLORS[avyRating] || 'var(--stone-500)' : null;

    return (
      <div className="panel-dashboard">
        <div className="panel-dashboard-header">
          <div className="panel-dashboard-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <h3 className="panel-dashboard-title">{zones && zones.length > 8 ? 'Northeast Backcountry' : (zones?.[0] as any)?.subRegion || 'Conditions'}</h3>
            <p className="panel-dashboard-subtitle">{zones?.length || 0} Backcountry Zones</p>
          </div>
        </div>

        <div className="panel-dashboard-stats">
          {avyLabel && (
            <div className="panel-dashboard-stat">
              <span className="panel-dashboard-stat-label">Avy Danger</span>
              <span
                className="panel-dashboard-stat-badge"
                style={{ background: avyColor || undefined, color: avyRating === 2 ? 'var(--stone-900)' : 'var(--white)' }}
              >
                {avyRating} &mdash; {avyLabel}
              </span>
            </div>
          )}
          {minTemp !== null && maxTemp !== null && (
            <div className="panel-dashboard-stat">
              <span className="panel-dashboard-stat-label">Temperature Range</span>
              <span className="panel-dashboard-stat-value">{minTemp}&deg;F to {maxTemp}&deg;F</span>
            </div>
          )}
        </div>

        {zones && zones.length > 0 && (
          <div className="panel-dashboard-zones">
            <h4 className="panel-dashboard-zones-title">Select a zone to view conditions</h4>
            <ul className="panel-dashboard-zone-list">
              {zones.map((z: any) => {
                const zWeather = weather?.[z.id];
                const zTemp = zWeather?.current?.tempF;
                const zAssessment = assessments?.[z.id];
                const ratingColor = zAssessment?.rating
                  ? RATING_COLORS[zAssessment.rating] || 'var(--stone-400)'
                  : 'var(--stone-400)';

                return (
                  <li key={z.id} className="panel-dashboard-zone-item" onClick={() => selectZone(z.id)}>
                    <span className="panel-dashboard-zone-dot" style={{ background: ratingColor }} />
                    <span className="panel-dashboard-zone-name">{z.name}</span>
                    {zTemp != null && (
                      <span className="panel-dashboard-zone-temp">{zTemp}&deg;F</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <p className="panel-dashboard-footer">
          Real-time weather, avalanche forecasts, and trip assessments for {zones?.length || 0} backcountry ski zones across the Northeast.
        </p>
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

  // Handle both typed response and raw API response shapes
  const zone = detail.zone;
  const detailWeather = detail.weather;
  const detailForecast = detail.forecast ?? (detail as any).mwac ?? null;
  const assessment = detail.assessment ?? (detail as any).assessment ?? null;
  const gearSuggestions = (detail as any).gearSuggestions ?? assessment?.gear ?? null;

  if (!detailWeather) {
    return (
      <div className="panel-error">
        <p>Weather data unavailable for this zone.</p>
      </div>
    );
  }

  return (
    <div className="zone-panel">
      <div className="zone-panel-header">
        <div className="zone-panel-header-text">
          <h2 className="zone-panel-name">{zone.name}</h2>
          <p className="zone-panel-meta">
            {zone.elevation?.toLocaleString()} ft &middot; {zone.subRegion}
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
        <WeatherCard weather={detailWeather} />
        <WindRose
          direction={detailWeather.current.windDirection}
          speed={detailWeather.current.windMph}
          gust={detailWeather.current.windGustMph}
        />
      </div>

      {zone.zoneType === 'alpine' ? (
        <AvalancheCard forecast={detailForecast} />
      ) : (
        <div className="avy-card" style={{ background: 'var(--stone-100)', border: '1px solid var(--stone-300)', borderRadius: 'var(--radius)', padding: '14px' }}>
          <h3 className="card-title">Avalanche Info</h3>
          <p style={{ fontSize: '13px', color: 'var(--stone-700)', lineHeight: '1.6' }}>
            This zone is below typical avalanche terrain. MWAC forecasts cover the Presidential Range. Exercise caution if venturing above treeline.
          </p>
          <a
            href="https://www.mountwashingtonavalanchecenter.org/forecasts/"
            target="_blank"
            rel="noopener noreferrer"
            className="avy-link"
            style={{ display: 'inline-block', marginTop: '8px' }}
          >
            View MWAC Forecast &rarr;
          </a>
        </div>
      )}
      <ForecastTable daily={detailWeather.daily} />
      {gearSuggestions && <GearSuggestions gear={gearSuggestions} />}
      {(detail as any).zoneInfo && <ZoneInfo info={(detail as any).zoneInfo} />}
    </div>
  );
}
