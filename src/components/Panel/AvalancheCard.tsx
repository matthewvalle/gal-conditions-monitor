import { getDangerLevel } from '../../utils/dangerScale';

interface Props {
  forecast: any;
}

function formatDate(isoStr: string | null): string {
  if (!isoStr) return '';
  try {
    return new Date(isoStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
    });
  } catch { return ''; }
}

export default function AvalancheCard({ forecast }: Props) {
  // No forecast or failed fetch
  if (!forecast || forecast.dangerRating === -1 || forecast.dangerRating === undefined) {
    return (
      <div className="avy-card avy-card--unavailable">
        <h3 className="card-title">Avalanche Forecast</h3>
        <div className="avy-unavailable">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <p>Avalanche forecast data unavailable.</p>
          <a href="https://www.mountwashingtonavalanchecenter.org/forecasts/#/presidential-range" target="_blank" rel="noopener noreferrer" className="avy-link">
            Check MWAC directly →
          </a>
        </div>
      </div>
    );
  }

  // Parse danger levels from the API response
  const levels = forecast.dangerLevels || {};
  const tomorrowLevels = forecast.tomorrowLevels || {};
  const overallDanger = getDangerLevel(forecast.dangerRating);
  const alpineDanger = getDangerLevel(levels.alpine ?? forecast.dangerRating);
  const treelineDanger = getDangerLevel(levels.treeline ?? forecast.dangerRating);
  const belowTreelineDanger = getDangerLevel(levels.belowTreeline ?? 0);

  return (
    <div className="avy-card">
      <h3 className="card-title">Avalanche Forecast</h3>

      {/* Overall danger badge */}
      <div className="avy-danger-row">
        <div className="avy-danger-badge" style={{ backgroundColor: overallDanger.color }}>
          <span className="avy-danger-num">{overallDanger.level > 0 ? overallDanger.level : '—'}</span>
        </div>
        <div className="avy-danger-info">
          <span className="avy-danger-label">{overallDanger.label}</span>
          <span className="avy-danger-zone">Overall — Presidential Range</span>
        </div>
      </div>

      {/* Elevation band breakdown */}
      <div className="avy-elevations">
        <div className="avy-elevation">
          <span className="avy-elev-dot" style={{ backgroundColor: alpineDanger.color }} />
          <span>Alpine (above treeline): <strong>{alpineDanger.label}</strong></span>
        </div>
        <div className="avy-elevation">
          <span className="avy-elev-dot" style={{ backgroundColor: treelineDanger.color }} />
          <span>Treeline: <strong>{treelineDanger.label}</strong></span>
        </div>
        {levels.belowTreeline != null && (
          <div className="avy-elevation">
            <span className="avy-elev-dot" style={{ backgroundColor: belowTreelineDanger.color }} />
            <span>Below treeline: <strong>{belowTreelineDanger.label}</strong></span>
          </div>
        )}
      </div>

      {/* Tomorrow outlook */}
      {(tomorrowLevels.alpine != null || tomorrowLevels.treeline != null) && (
        <div className="avy-tomorrow">
          <h4 className="avy-section-title">Tomorrow</h4>
          <div className="avy-elevations">
            {tomorrowLevels.alpine != null && (
              <div className="avy-elevation">
                <span className="avy-elev-dot" style={{ backgroundColor: getDangerLevel(tomorrowLevels.alpine).color }} />
                <span>Alpine: <strong>{getDangerLevel(tomorrowLevels.alpine).label}</strong></span>
              </div>
            )}
            {tomorrowLevels.treeline != null && (
              <div className="avy-elevation">
                <span className="avy-elev-dot" style={{ backgroundColor: getDangerLevel(tomorrowLevels.treeline).color }} />
                <span>Treeline: <strong>{getDangerLevel(tomorrowLevels.treeline).label}</strong></span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom line / travel advice */}
      {forecast.bottomLine && (
        <div className="avy-bottomline">
          <h4 className="avy-section-title">Travel Advice</h4>
          <p>{forecast.bottomLine}</p>
        </div>
      )}

      {/* Metadata */}
      <div className="avy-meta">
        {forecast.author && <span>Forecaster: {forecast.author}</span>}
        {forecast.publishedAt && <span>Issued: {formatDate(forecast.publishedAt)}</span>}
        {forecast.expiresAt && <span>Expires: {formatDate(forecast.expiresAt)}</span>}
      </div>

      {/* Source attribution + disclaimer */}
      <div className="avy-attribution">
        <p className="avy-source">
          Source: <a href={forecast.sourceUrl || 'https://www.mountwashingtonavalanchecenter.org/forecasts/#/presidential-range'} target="_blank" rel="noopener noreferrer">
            {forecast.source || 'Mount Washington Avalanche Center (USDA Forest Service)'}
          </a>
        </p>
        <p className="avy-disclaimer">
          {forecast.disclaimer || 'Always check the official MWAC forecast before heading into avalanche terrain.'}
        </p>
      </div>

      <a
        href="https://www.mountwashingtonavalanchecenter.org/forecasts/#/presidential-range"
        target="_blank"
        rel="noopener noreferrer"
        className="avy-link avy-link--full"
      >
        View Full MWAC Forecast →
      </a>
    </div>
  );
}
