import React from 'react';

interface Props {
  direction: string; // cardinal e.g. "NW"
  speed: number;     // mph
  gust: number;      // mph
}

const cardinalToDegrees: Record<string, number> = {
  N: 0, NNE: 22.5, NE: 45, ENE: 67.5,
  E: 90, ESE: 112.5, SE: 135, SSE: 157.5,
  S: 180, SSW: 202.5, SW: 225, WSW: 247.5,
  W: 270, WNW: 292.5, NW: 315, NNW: 337.5,
};

export default function WindRose({ direction, speed, gust }: Props) {
  const degrees = cardinalToDegrees[direction] ?? 0;
  // Arrow points INTO the wind direction (where wind comes FROM)
  // So rotate the arrow by degrees (wind from N = arrow points down / south)
  const arrowRotation = degrees + 180;

  return (
    <div className="wind-rose">
      <svg width="80" height="80" viewBox="0 0 80 80" className="wind-rose-svg">
        {/* Outer circle */}
        <circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke="var(--stone-300)"
          strokeWidth="1.5"
        />
        {/* Cardinal marks */}
        {['N', 'E', 'S', 'W'].map((card, i) => {
          const angle = i * 90;
          const rad = (angle - 90) * (Math.PI / 180);
          const x = 40 + 30 * Math.cos(rad);
          const y = 40 + 30 * Math.sin(rad);
          return (
            <text
              key={card}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="8"
              fill="var(--stone-600)"
              fontWeight="600"
              fontFamily="Inter, sans-serif"
            >
              {card}
            </text>
          );
        })}
        {/* Wind arrow */}
        <g transform={`rotate(${arrowRotation}, 40, 40)`}>
          <line
            x1="40"
            y1="55"
            x2="40"
            y2="18"
            stroke="var(--ember)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <polygon
            points="40,14 35,22 45,22"
            fill="var(--ember)"
          />
        </g>
      </svg>
      <div className="wind-rose-label">
        <span className="wind-rose-speed">{speed}</span>
        <span className="wind-rose-unit">mph</span>
        {gust > speed && (
          <span className="wind-rose-gust">G {gust}</span>
        )}
        <span className="wind-rose-dir">{direction}</span>
      </div>
    </div>
  );
}
