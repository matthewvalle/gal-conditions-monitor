import React from 'react';

export default function Header() {
  return (
    <header className="app-header">
      <div className="app-header-inner">
        <a
          href="https://granitealpinelab.com"
          target="_blank"
          rel="noopener noreferrer"
          className="app-header-logo"
        >
          GAL
        </a>
        <div className="app-header-text">
          <h1 className="app-header-title">Northeast Backcountry Conditions</h1>
          <span className="app-header-subtitle">Presidential Range</span>
        </div>
      </div>
    </header>
  );
}
