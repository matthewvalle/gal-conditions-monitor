import type { ZoneWeather } from '../../../api/lib/types';

interface Props {
  weather: ZoneWeather;
}

export default function WeatherCard({ weather }: Props) {
  const c = weather.current;

  // Compute snowfall totals from hourly data
  const now = Date.now();
  const h24 = weather.hourly
    .filter((h) => now - new Date(h.time).getTime() <= 24 * 3600_000)
    .reduce((sum, h) => sum + h.snowInches, 0);
  const h48 = weather.hourly
    .filter((h) => now - new Date(h.time).getTime() <= 48 * 3600_000)
    .reduce((sum, h) => sum + h.snowInches, 0);
  const h72 = weather.hourly
    .filter((h) => now - new Date(h.time).getTime() <= 72 * 3600_000)
    .reduce((sum, h) => sum + h.snowInches, 0);

  return (
    <div className="weather-card">
      <h3 className="card-title">Current Conditions</h3>

      <div className="weather-card-main">
        <div className="weather-temp-block">
          <span className="weather-temp">{Math.round(c.tempF)}&deg;F</span>
          <span className="weather-feels">Feels like {Math.round(c.feelsLikeF)}&deg;</span>
        </div>
        <div className="weather-condition">
          <span className="weather-condition-text">{c.condition}</span>
        </div>
      </div>

      <div className="weather-stats">
        <div className="weather-stat">
          <span className="weather-stat-label">Wind</span>
          <span className="weather-stat-value">{c.windMph} mph {c.windDirection}</span>
        </div>
        <div className="weather-stat">
          <span className="weather-stat-label">Gusts</span>
          <span className="weather-stat-value">{c.windGustMph} mph</span>
        </div>
        <div className="weather-stat">
          <span className="weather-stat-label">Visibility</span>
          <span className="weather-stat-value">{c.visibility} mi</span>
        </div>
        <div className="weather-stat">
          <span className="weather-stat-label">Humidity</span>
          <span className="weather-stat-value">{c.humidity}%</span>
        </div>
      </div>

      <div className="weather-snow">
        <h4 className="weather-snow-title">Snowfall</h4>
        <div className="weather-snow-row">
          <div className="weather-snow-cell">
            <span className="weather-snow-value">{h24.toFixed(1)}"</span>
            <span className="weather-snow-label">24h</span>
          </div>
          <div className="weather-snow-cell">
            <span className="weather-snow-value">{h48.toFixed(1)}"</span>
            <span className="weather-snow-label">48h</span>
          </div>
          <div className="weather-snow-cell">
            <span className="weather-snow-value">{h72.toFixed(1)}"</span>
            <span className="weather-snow-label">72h</span>
          </div>
        </div>
      </div>
    </div>
  );
}
