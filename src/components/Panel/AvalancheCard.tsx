import React from 'react';
import { getDangerLevel } from '../../utils/dangerScale';
import type { MwacForecast } from '../../../api/lib/types';

interface Props {
  forecast: MwacForecast | null;
}

export default function AvalancheCard({ forecast }: Props) {
  if (!forecast) {
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
          <a
            href="https://mountwashingtonavalanchecenter.org"
            target="_blank"
            rel="noopener noreferrer"
            className="avy-link"
          >
            Check MWAC directly
          </a>
        </div>
      </div>
    );
  }

  const alpineDanger = getDangerLevel(forecast.dangerLevel.alpine);
  const treelineDanger = getDangerLevel(forecast.dangerLevel.treeline);
  const belowTreelineDanger = getDangerLevel(forecast.dangerLevel.belowTreeline);

  const issuedDate = new Date(forecast.issuedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
  const expiresDate = new Date(forecast.expiresAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className="avy-card">
      <h3 className="card-title">Avalanche Forecast</h3>

      <div className="avy-danger-row">
        <div className="avy-danger-badge" style={{ backgroundColor: alpineDanger.color }}>
          <span className="avy-danger-num">{alpineDanger.level}</span>
        </div>
        <div className="avy-danger-info">
          <span className="avy-danger-label">{alpineDanger.label}</span>
          <span className="avy-danger-zone">Alpine</span>
        </div>
      </div>

      <div className="avy-elevations">
        <div className="avy-elevation">
          <span className="avy-elev-dot" style={{ backgroundColor: treelineDanger.color }} />
          <span>Treeline: {treelineDanger.label}</span>
        </div>
        <div className="avy-elevation">
          <span className="avy-elev-dot" style={{ backgroundColor: belowTreelineDanger.color }} />
          <span>Below treeline: {belowTreelineDanger.label}</span>
        </div>
      </div>

      {forecast.problems.length > 0 && (
        <div className="avy-problems">
          <h4 className="avy-problems-title">Problems</h4>
          <div className="avy-problem-tags">
            {forecast.problems.map((p, i) => (
              <span key={i} className="avy-problem-tag">
                {p.type}
                <span className="avy-problem-likelihood">{p.likelihood}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {forecast.bottomLine && (
        <div className="avy-bottomline">
          <h4 className="avy-bottomline-title">Bottom Line</h4>
          <p>{forecast.bottomLine}</p>
        </div>
      )}

      <div className="avy-meta">
        <span>Issued: {issuedDate}</span>
        <span>Expires: {expiresDate}</span>
      </div>

      <a
        href={forecast.detailUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="avy-link"
      >
        Full MWAC Forecast &rarr;
      </a>
    </div>
  );
}
