
export default function Header() {
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
