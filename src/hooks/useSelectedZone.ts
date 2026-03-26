import React, { createContext, useContext, useState, useCallback } from 'react';

interface SelectedZoneContextValue {
  selectedZoneId: string | null;
  selectZone: (id: string | null) => void;
}

const SelectedZoneContext = createContext<SelectedZoneContextValue>({
  selectedZoneId: null,
  selectZone: () => {},
});

export function SelectedZoneProvider({ children }: { children: React.ReactNode }) {
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

  const selectZone = useCallback((id: string | null) => {
    setSelectedZoneId(id);
  }, []);

  return React.createElement(
    SelectedZoneContext.Provider,
    { value: { selectedZoneId, selectZone } },
    children
  );
}

export function useSelectedZone() {
  return useContext(SelectedZoneContext);
}
