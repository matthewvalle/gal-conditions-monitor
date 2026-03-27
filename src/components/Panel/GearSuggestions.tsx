import React from 'react';
import type { GearSuggestion } from '../../../lib/types';

interface Props {
  gear: GearSuggestion[];
}

const priorityOrder: Record<string, number> = {
  essential: 0,
  recommended: 1,
  optional: 2,
};

const priorityLabels: Record<string, string> = {
  essential: 'Essential',
  recommended: 'Recommended',
  optional: 'Optional',
};

function getGearIcon(item: string): string {
  const lower = item.toLowerCase();
  if (lower.includes('crampon')) return '\u{1F9CA}'; // ice
  if (lower.includes('goggle') || lower.includes('glass')) return '\u{1F576}'; // sunglasses
  if (lower.includes('skin')) return '\u{1F3BF}'; // skis
  if (lower.includes('beacon') || lower.includes('avy') || lower.includes('probe') || lower.includes('shovel')) return '\u{1F6A8}'; // rotating light
  if (lower.includes('layer') || lower.includes('jacket') || lower.includes('shell')) return '\u{1F9E5}'; // coat
  if (lower.includes('headlamp') || lower.includes('light')) return '\u{1F526}'; // flashlight
  if (lower.includes('water') || lower.includes('thermos')) return '\u{1F4A7}'; // drop
  return '\u{1F392}'; // backpack
}

export default function GearSuggestions({ gear }: Props) {
  if (!gear || gear.length === 0) {
    return (
      <div className="gear-card">
        <h3 className="card-title">Gear Suggestions</h3>
        <p className="gear-default">
          Standard touring setup.{' '}
          <a
            href="https://granitealpinelab.com/guides/backcountry-ski-gear-checklist/"
            target="_blank"
            rel="noopener noreferrer"
            className="gear-link"
          >
            Check our gear checklist
          </a>
        </p>
      </div>
    );
  }

  const sorted = [...gear].sort(
    (a, b) => (priorityOrder[a.priority] ?? 2) - (priorityOrder[b.priority] ?? 2)
  );

  let currentPriority = '';

  return (
    <div className="gear-card">
      <h3 className="card-title">Gear Suggestions</h3>
      <ul className="gear-list">
        {sorted.map((g, i) => {
          const showHeader = g.priority !== currentPriority;
          currentPriority = g.priority;
          return (
            <React.Fragment key={i}>
              {showHeader && (
                <li className={`gear-group-header gear-group--${g.priority}`}>
                  {priorityLabels[g.priority]}
                </li>
              )}
              <li className="gear-item">
                <span className="gear-icon">{getGearIcon(g.item)}</span>
                <div className="gear-text">
                  <span className="gear-name">{g.item}</span>
                  <span className="gear-reason">{g.reason}</span>
                </div>
              </li>
            </React.Fragment>
          );
        })}
      </ul>
    </div>
  );
}
