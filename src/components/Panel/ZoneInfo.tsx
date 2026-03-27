interface ParkingData {
  name: string;
  lat: number;
  lon: number;
  googleMapsUrl: string;
  notes: string;
}

interface ZoneInfoData {
  overview: string;
  stats: {
    verticalDrop: string;
    maxPitch: string;
    difficulty: string;
    bestMonths: string[];
    approachTime: string;
    baseElevation: number;
    topElevation: number;
    aspect: string;
  };
  parking?: ParkingData;
  sources: Array<{
    title: string;
    url: string;
    description: string;
  }>;
}

interface Props {
  info: ZoneInfoData;
}

export default function ZoneInfo({ info }: Props) {
  const { overview, stats, parking, sources } = info;

  return (
    <div className="zone-info-card">
      <h3 className="card-title">About This Zone</h3>
      <p className="zone-info-overview">{overview}</p>

      <div className="zone-info-stats">
        <div className="zone-info-stat">
          <span className="zone-info-stat-label">Vertical</span>
          <span className="zone-info-stat-value">{stats.verticalDrop}</span>
        </div>
        <div className="zone-info-stat">
          <span className="zone-info-stat-label">Max Pitch</span>
          <span className="zone-info-stat-value">{stats.maxPitch}</span>
        </div>
        <div className="zone-info-stat">
          <span className="zone-info-stat-label">Difficulty</span>
          <span className="zone-info-stat-value">{stats.difficulty}</span>
        </div>
        <div className="zone-info-stat">
          <span className="zone-info-stat-label">Best Months</span>
          <span className="zone-info-stat-value">{stats.bestMonths.join(', ')}</span>
        </div>
        <div className="zone-info-stat">
          <span className="zone-info-stat-label">Approach</span>
          <span className="zone-info-stat-value">{stats.approachTime}</span>
        </div>
        <div className="zone-info-stat">
          <span className="zone-info-stat-label">Aspect</span>
          <span className="zone-info-stat-value">{stats.aspect}</span>
        </div>
      </div>

      {parking && (
        <div className="zone-info-parking-section">
          <h4 className="zone-info-parking-title">Where to Park</h4>
          <div className="zone-info-parking">
            <span className="zone-info-parking-name">{parking.name}</span>
            {parking.notes && (
              <span className="zone-info-parking-notes">{parking.notes}</span>
            )}
            <a
              href={parking.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="zone-info-parking-btn"
            >
              Get Directions
            </a>
          </div>
        </div>
      )}

      {sources && sources.length > 0 && (
        <div className="zone-info-sources-section">
          <h4 className="zone-info-sources-title">Resources &amp; Trip Reports</h4>
          <ul className="zone-info-sources">
            {sources.map((s, i) => (
              <li key={i} className="zone-info-source">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="zone-info-source-link"
                >
                  {s.title}
                </a>
                <span className="zone-info-source-desc">{s.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
