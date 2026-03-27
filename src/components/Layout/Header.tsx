
export default function Header() {
  // When embedded in WordPress, the site header already shows the GAL brand.
  // This header is a slim contextual toolbar — not a full brand header.
  const isEmbedded = !window.location.hostname.includes('vercel.app');

  if (isEmbedded) {
    // Slim toolbar for WordPress embed
    return (
      <header className="app-header app-header--embedded">
        <div className="app-header-inner">
          <div className="app-header-context">
            <span className="app-header-live-badge">Live</span>
            <h1 className="app-header-title">Conditions Monitor</h1>
            <span className="app-header-divider">&middot;</span>
            <span className="app-header-subtitle">Presidential Range</span>
          </div>
          <span className="app-header-source">Weather &amp; Avalanche Data</span>
        </div>
      </header>
    );
  }

  // Full header for standalone Vercel deployment
  return (
    <header className="app-header">
      <div className="app-header-inner">
        <a
          href="https://granitealpinelab.com"
          target="_blank"
          rel="noopener noreferrer"
          className="app-header-brand"
        >
          <img
            src="https://granitealpinelab.com/wp-content/uploads/2026/03/gal-logo-v2.png"
            alt="Granite Alpine Lab"
            className="app-header-logo-img"
          />
          <span className="app-header-site-name">Granite Alpine Lab</span>
        </a>
        <div className="app-header-text">
          <h1 className="app-header-title">Conditions Monitor</h1>
          <span className="app-header-subtitle">Presidential Range &middot; Live Weather &amp; Avalanche Data</span>
        </div>
      </div>
    </header>
  );
}
