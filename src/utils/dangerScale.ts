export interface DangerLevel {
  level: number;
  label: string;
  color: string;
  description: string;
  cssClass: string;
}

const dangerLevels: Record<number, DangerLevel> = {
  1: {
    level: 1,
    label: 'Low',
    color: '#4CAF50',
    description: 'Generally safe avalanche conditions. Watch for unstable snow on isolated terrain features.',
    cssClass: 'danger-low',
  },
  2: {
    level: 2,
    label: 'Moderate',
    color: '#FFC107',
    description: 'Heightened avalanche conditions on specific terrain features. Evaluate snow and terrain carefully.',
    cssClass: 'danger-moderate',
  },
  3: {
    level: 3,
    label: 'Considerable',
    color: '#FF9800',
    description: 'Dangerous avalanche conditions. Careful snowpack evaluation, cautious route-finding, and conservative decision-making essential.',
    cssClass: 'danger-considerable',
  },
  4: {
    level: 4,
    label: 'High',
    color: '#F44336',
    description: 'Very dangerous avalanche conditions. Travel in avalanche terrain not recommended.',
    cssClass: 'danger-high',
  },
  5: {
    level: 5,
    label: 'Extreme',
    color: '#212121',
    description: 'Avoid all avalanche terrain. Natural and human-triggered avalanches certain.',
    cssClass: 'danger-extreme',
  },
};

/**
 * Get danger level metadata by numeric rating (1-5).
 * Returns level 1 (Low) for out-of-range values.
 */
export function getDangerLevel(rating: number): DangerLevel {
  return dangerLevels[rating] ?? dangerLevels[1];
}

/**
 * Get the CSS custom property name for a danger level color.
 */
export function getDangerCssVar(rating: number): string {
  const level = getDangerLevel(rating);
  return `var(--${level.cssClass})`;
}

export { dangerLevels };
