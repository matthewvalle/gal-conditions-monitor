
interface Props {
  updatedAt: string | null;
}

function formatTimeAgo(dateStr: string): { text: string; isStale: boolean } {
  const updated = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - updated.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);

  const isStale = diffHours >= 4;

  if (diffMin < 1) return { text: 'Updated just now', isStale };
  if (diffMin < 60) return { text: `Updated ${diffMin} minute${diffMin === 1 ? '' : 's'} ago`, isStale };
  if (diffHours < 24) return { text: `Updated ${diffHours} hour${diffHours === 1 ? '' : 's'} ago`, isStale };
  return { text: `Updated ${updated.toLocaleDateString()}`, isStale };
}

export default function LastUpdated({ updatedAt }: Props) {
  if (!updatedAt) {
    return (
      <div className="last-updated">
        <span className="last-updated-text">Loading...</span>
      </div>
    );
  }

  const { text, isStale } = formatTimeAgo(updatedAt);

  return (
    <div className={`last-updated${isStale ? ' last-updated--stale' : ''}`}>
      <span className="last-updated-text">
        {isStale && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="last-updated-icon"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        )}
        {text}
      </span>
    </div>
  );
}
