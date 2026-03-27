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
    // Compute summary data
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

    // Group zones by subRegion for compact summary
    const regionGroups: Record<string, { count: number; conditions: Record<string, number> }> = {};
    (zones || []).forEach((z: any) => {
      const sr = z.subRegion || 'Other';
      if (!regionGroups[sr]) regionGroups[sr] = { count: 0, conditions: {} };
      regionGroups[sr].count++;
      const rating = assessments?.[z.id]?.rating || 'unknown';
      regionGroups[sr].conditions[rating] = (regionGroups[sr].conditions[rating] || 0) + 1;
    });

    // Find the dominant condition for each region
    const getDominantCondition = (conditions: Record<string, number>) => {
      const priority = ['dangerous', 'poor', 'fair', 'good'];
      for (const p of priority) {
        if (conditions[p]) return p;
      }
      return 'unknown';
    };

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
            <h3 className="panel-dashboard-title">Northeast Backcountry</h3>
            <p className="panel-dashboard-subtitle">{zones?.length || 0} zones across 5 states</p>
          </div>
        </div>

        <div className="panel-dashboard-stats">
          {avyLabel && (
            <div className="panel-dashboard-stat">
              <span className="panel-dashboard-stat-label">Presidential Range Avy Danger</span>
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
              <span className="panel-dashboard-stat-value">{minTemp}&deg;F &ndash; {maxTemp}&deg;F</span>
            </div>
          )}
        </div>

        {/* Compact region summary — NOT individual zone list */}
        <div className="panel-dashboard-regions">
          <h4 className="panel-dashboard-section-title">Regions at a Glance</h4>
          {Object.entries(regionGroups).map(([region, data]) => {
            const dominant = getDominantCondition(data.conditions);
            const color = RATING_COLORS[dominant] || 'var(--stone-400)';
            return (
              <div key={region} className="panel-dashboard-region-row">
                <span className="panel-dashboard-region-dot" style={{ background: color }} />
                <span className="panel-dashboard-region-name">{region}</span>
                <span className="panel-dashboard-region-count">{data.count} zones</span>
              </div>
            );
          })}
        </div>

        <div className="panel-dashboard-cta">
          <p>Click a marker on the map or select a zone from the list below to view detailed conditions, forecasts, and trip assessments.</p>
        </div>

        <div className="panel-dashboard-sources">
          <span className="panel-dashboard-source-label">Data from</span>
          <span>MWAC &middot; Open-Meteo &middot; NWS &middot; GBA</span>
        </div>
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

      {/* About This Zone — moved up for prominence */}
      {(detail as any).zoneInfo && <ZoneInfo info={(detail as any).zoneInfo} />}

      <div className="zone-panel-weather-row">
        <WeatherCard weather={detailWeather} />
        <WindRose
          direction={detailWeather.current.windDirection}
          speed={detailWeather.current.windMph}
          gust={detailWeather.current.windGustMph}
        />
      </div>

      <ForecastTable daily={detailWeather.daily} />

      {zone.zoneType === 'alpine' && <AvalancheCard forecast={detailForecast} />}

      {zone.zoneType !== 'alpine' && (
        <div className="glade-avy-note" style={{ background: 'var(--stone-100)', border: '1px solid var(--stone-300)', borderRadius: 'var(--radius)', padding: '12px 14px', fontSize: '12px', color: 'var(--stone-600)', lineHeight: '1.5' }}>
          ⚠️ MWAC avalanche forecasts cover the Presidential Range only. Exercise caution above treeline.{' '}
          <a href="https://www.mountwashingtonavalanchecenter.org/forecasts/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--link-color)' }}>View MWAC Forecast →</a>
        </div>
      )}

      {gearSuggestions && <GearSuggestions gear={gearSuggestions} />}
    </div>
  );
}
