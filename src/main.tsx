import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SelectedZoneProvider } from './hooks/useSelectedZone';
import App from './App';
import './styles/tokens.css';
import './styles/app.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000, // 2 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const rootEl = document.getElementById('gal-conditions-root')!;

// Detect embedded context (WordPress) by measuring top offset from viewport.
// If there's a header above the root, set a CSS variable so the app can
// subtract it from 100vh — keeping everything viewport-locked without overflow.
const topOffset = Math.round(rootEl.getBoundingClientRect().top);
if (topOffset > 0) {
  rootEl.style.setProperty('--header-offset', `${topOffset}px`);
  rootEl.classList.add('gal-embedded');
}

const root = createRoot(rootEl);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SelectedZoneProvider>
        <App />
      </SelectedZoneProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
