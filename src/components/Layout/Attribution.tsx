export default function Attribution() {
  return (
    <footer className="app-attribution">
      <div className="app-attribution-inner">
        <p className="app-attribution-heading">Data Sources</p>
        <div className="app-attribution-sources">
          <a href="https://www.mountwashingtonavalanchecenter.org/" target="_blank" rel="noopener noreferrer">
            MWAC / USDA Forest Service
          </a>
          <span className="app-attribution-sep">&middot;</span>
          <a href="https://avalanche.org/" target="_blank" rel="noopener noreferrer">
            Avalanche.org
          </a>
          <span className="app-attribution-sep">&middot;</span>
          <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">
            Open-Meteo
          </a>
          <span className="app-attribution-sep">&middot;</span>
          <a href="https://www.weather.gov/" target="_blank" rel="noopener noreferrer">
            National Weather Service
          </a>
        </div>
        <p className="app-attribution-disclaimer">
          Conditions data is provided for informational purposes only. Always verify conditions with official sources
          and exercise your own judgment before entering avalanche terrain. This tool does not replace avalanche
          education, proper equipment, or sound decision-making.
        </p>
        <p className="app-attribution-credit">
          Built by <a href="https://granitealpinelab.com/about/" target="_blank" rel="noopener noreferrer">Granite Alpine Lab</a>
        </p>
      </div>
    </footer>
  );
}
