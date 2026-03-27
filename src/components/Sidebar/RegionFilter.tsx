const regionTabs = [
  { id: 'all', label: 'All', active: true },
  { id: 'nh', label: 'NH', active: true },
  { id: 'vt', label: 'VT', active: true },
  { id: 'ny', label: 'NY', active: true },
  { id: 'ma', label: 'MA', active: true },
  { id: 'me', label: 'ME', active: false },
];

interface Props {
  selected: string;
  onChange: (regionId: string) => void;
}

export default function RegionFilter({ selected, onChange }: Props) {
  return (
    <div className="region-filter">
      {regionTabs.map((tab) => (
        <button
          key={tab.id}
          className={`region-tab${selected === tab.id ? ' region-tab--active' : ''}${!tab.active ? ' region-tab--disabled' : ''}`}
          onClick={() => tab.active && onChange(tab.id)}
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
