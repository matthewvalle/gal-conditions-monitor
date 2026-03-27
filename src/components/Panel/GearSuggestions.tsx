interface Props {
  gear: any[];
}

const priorityOrder: Record<string, number> = {
  essential: 0,
  recommended: 1,
  optional: 2,
};

const priorityLabels: Record<string, string> = {
  essential: '🔴 Essential',
  recommended: '🟡 Recommended',
  optional: '🟢 Optional',
};

function getGearIcon(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('crampon')) return '🧊';
  if (lower.includes('goggle') || lower.includes('glass')) return '🕶️';
  if (lower.includes('skin') || lower.includes('ski')) return '⛷️';
  if (lower.includes('beacon') || lower.includes('avy') || lower.includes('avalanche')) return '🚨';
  if (lower.includes('layer') || lower.includes('jacket') || lower.includes('shell') || lower.includes('insul')) return '🧥';
  if (lower.includes('headlamp') || lower.includes('light')) return '🔦';
  if (lower.includes('sock') || lower.includes('warm')) return '🧦';
  if (lower.includes('navigation') || lower.includes('app')) return '📱';
  return '🎒';
}

export default function GearSuggestions({ gear }: Props) {
  if (!gear || !Array.isArray(gear) || gear.length === 0) {
    return (
      <div className="gear-card">
        <h3 className="card-title">Gear Suggestions</h3>
        <p className="gear-default">
          Standard touring setup.{' '}
          <a
            href="https://granitealpinelab.com/backcountry-gear-checklist/"
            target="_blank"
            rel="noopener noreferrer"
            className="gear-link"
          >
            Check our gear checklist →
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
          // Handle both API shapes: { text, reviewUrl } and { item, reason, reviewUrl }
          const displayText = g.text || g.item || '';
          const reviewUrl = g.reviewUrl || '';

          return (
            <li key={i} className="gear-item">
              {showHeader && (
                <div className={`gear-group-header gear-group--${g.priority}`}>
                  {priorityLabels[g.priority] ?? g.priority}
                </div>
              )}
              <div className="gear-item-content">
                <span className="gear-icon">{getGearIcon(displayText)}</span>
                <div className="gear-text">
                  {reviewUrl ? (
                    <a
                      href={`https://granitealpinelab.com${reviewUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gear-link"
                    >
                      {displayText}
                    </a>
                  ) : (
                    <span>{displayText}</span>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
