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

const root = createRoot(document.getElementById('gal-conditions-root')!);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SelectedZoneProvider>
        <App />
      </SelectedZoneProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
