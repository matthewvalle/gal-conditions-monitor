import React, { useState } from 'react';
import type { NwsAlert } from '../../../api/lib/types';

interface Props {
  alerts: NwsAlert[];
}

const severityColors: Record<string, string> = {
  Extreme: '#b71c1c',
  Severe: '#d32f2f',
  Moderate: '#e65100',
  Minor: '#f57c00',
  Unknown: '#78716C',
};

export default function AlertBanner({ alerts }: Props) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visible = alerts.filter((a) => !dismissed.has(a.id));
  if (visible.length === 0) return null;

  const dismiss = (id: string) => {
    setDismissed((prev) => new Set(prev).add(id));
  };

  return (
    <div className="alert-banner-stack">
      {visible.map((alert) => (
        <div
          key={alert.id}
          className="alert-banner"
          style={{
            backgroundColor: severityColors[alert.severity] ?? severityColors.Unknown,
          }}
        >
          <div className="alert-banner-content">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="alert-banner-icon"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span className="alert-banner-text">
              <strong>{alert.event}:</strong> {alert.headline}
            </span>
          </div>
          <button
            className="alert-banner-dismiss"
            onClick={() => dismiss(alert.id)}
            aria-label="Dismiss alert"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
