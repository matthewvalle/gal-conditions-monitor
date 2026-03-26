import React from 'react';
import type { ZoneWeather } from '../../../api/lib/types';

type DailyForecast = ZoneWeather['daily'][number];

interface Props {
  daily: DailyForecast[];
}

function getDayName(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

function getBestDayIndex(days: DailyForecast[]): number {
  if (days.length === 0) return -1;

  // Score: lower wind + warmer temps + more snow = better
  // Simple heuristic: lowest wind is most important for the Presidentials
  let bestIdx = 0;
  let bestScore = Infinity;
  days.forEach((d, i) => {
    const score = d.windMph * 2 - d.totalSnowInches * 3 - d.highF;
    if (score < bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  });
  return bestIdx;
}

export default function ForecastTable({ daily }: Props) {
  const days = daily.slice(0, 5);
  const bestIdx = getBestDayIndex(days);

  if (days.length === 0) {
    return null;
  }

  return (
    <div className="forecast-table">
      <h3 className="card-title">5-Day Forecast</h3>
      <div className="forecast-grid">
        {days.map((day, i) => (
          <div
            key={day.date}
            className={`forecast-day${i === bestIdx ? ' forecast-day--best' : ''}`}
          >
            {i === bestIdx && <span className="forecast-best-badge">Best</span>}
            <span className="forecast-day-name">{getDayName(day.date)}</span>
            <span className="forecast-condition">{day.condition}</span>
            <div className="forecast-temps">
              <span className="forecast-high">{Math.round(day.highF)}&deg;</span>
              <span className="forecast-low">{Math.round(day.lowF)}&deg;</span>
            </div>
            <div className="forecast-detail">
              <span title="Wind">{day.windMph} mph</span>
              {day.totalSnowInches > 0 && (
                <span className="forecast-snow" title="Snow">
                  {day.totalSnowInches.toFixed(1)}"
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
