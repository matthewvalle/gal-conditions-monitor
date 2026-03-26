import React, { useState } from 'react';

const regionTabs = [
  { id: 'all', label: 'All', active: true },
  { id: 'nh', label: 'NH', active: true },
  { id: 'vt', label: 'VT', active: false },
  { id: 'me', label: 'ME', active: false },
  { id: 'ny', label: 'NY', active: false },
  { id: 'ma', label: 'MA', active: false },
];

export default function RegionFilter() {
  const [selected, setSelected] = useState('all');

  return (
    <div className="region-filter">
      {regionTabs.map((tab) => (
        <button
          key={tab.id}
          className={`region-tab${selected === tab.id ? ' region-tab--active' : ''}${!tab.active ? ' region-tab--disabled' : ''}`}
          onClick={() => tab.active && setSelected(tab.id)}
          disabled={!tab.active}
          title={!tab.active ? 'Coming soon' : undefined}
        >
          {tab.label}
          {!tab.active && <span className="region-tab-soon">Soon</span>}
        </button>
      ))}
    </div>
  );
}
