interface Props {
  gear: any[];
}

const priorityOrder: Record<string, number> = {
  essential: 0,
  recommended: 1,
  optional: 2,
};

const priorityConfig: Record<string, { label: string; color: string; bg: string }> = {
  essential: { label: 'Essential', color: 'var(--danger-high)', bg: 'rgba(244, 67, 54, 0.08)' },
  recommended: { label: 'Recommended', color: 'var(--danger-moderate)', bg: 'rgba(255, 193, 7, 0.08)' },
  optional: { label: 'Optional', color: 'var(--danger-low)', bg: 'rgba(76, 175, 80, 0.08)' },
};

export default function GearSuggestions({ gear }: Props) {
  if (!gear || !Array.isArray(gear) || gear.length === 0) {
    return (
      <div className="gear-card">
        <h3 className="card-title">Gear Suggestions</h3>
        <p style={{ fontSize: '13px', color: 'var(--stone-600)', margin: 0, lineHeight: 1.5 }}>
          Standard touring setup.{' '}
          <a href="https://granitealpinelab.com/backcountry-gear-checklist/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--link-color)' }}>
            View our gear checklist →
          </a>
        </p>
      </div>
    );
  }

  const sorted = [...gear].sort(
    (a, b) => (priorityOrder[a.priority] ?? 2) - (priorityOrder[b.priority] ?? 2)
  );

  // Group by priority
  const groups: Record<string, any[]> = {};
  sorted.forEach((g) => {
    const p = g.priority || 'recommended';
    if (!groups[p]) groups[p] = [];
    groups[p].push(g);
  });

  return (
    <div className="gear-card">
      <h3 className="card-title">Gear Suggestions</h3>
      <div className="gear-groups">
        {Object.entries(groups).map(([priority, items]) => {
          const config = priorityConfig[priority] || priorityConfig.recommended;
          return (
            <div key={priority} className="gear-priority-group">
              <div className="gear-priority-badge" style={{ color: config.color, background: config.bg }}>
                {config.label}
              </div>
              <div className="gear-items">
                {items.map((g: any, i: number) => {
                  const text = g.text || g.item || '';
                  const url = g.reviewUrl || '';
                  return (
                    <div key={i} className="gear-suggestion-row">
                      {url ? (
                        <a
                          href={`https://granitealpinelab.com${url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="gear-suggestion-link"
                        >
                          {text}
                          <span className="gear-suggestion-arrow">→</span>
                        </a>
                      ) : (
                        <span className="gear-suggestion-text">{text}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
