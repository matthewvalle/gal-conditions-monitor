import { useRef } from 'react';
import { useAllZones } from './hooks/useConditions';
import { useSelectedZone } from './hooks/useSelectedZone';
import { useZoneDetail } from './hooks/useConditions';
import Header from './components/Layout/Header';
import LastUpdated from './components/Layout/LastUpdated';
import AlertBanner from './components/Layout/AlertBanner';
import ConditionsMap from './components/Map/ConditionsMap';
import RegionFilter from './components/Sidebar/RegionFilter';
import ZoneList from './components/Sidebar/ZoneList';
import ZoneDetailPanel from './components/Panel/ZoneDetailPanel';
import Attribution from './components/Layout/Attribution';

export default function App() {
  const { data, isLoading, error } = useAllZones();
  const { selectedZoneId } = useSelectedZone();
  const detailQuery = useZoneDetail(selectedZoneId);
  const panelRef = useRef<HTMLDivElement>(null);

  // Server-side assessments (includes avy danger in rating)
  const assessments: Record<string, { rating: string; reasons: string[] }> =
    (data as any)?.assessments ?? {};

  return (
    <div className="app">
      <Header />

      {data?.alerts && data.alerts.length > 0 && (
        <AlertBanner alerts={data.alerts} />
      )}

      <LastUpdated updatedAt={data?.updatedAt ?? null} />

      <div className="app-body">
        <div className="app-map-col">
          <ConditionsMap
            zones={data?.zones ?? []}
            weather={data?.weather ?? {}}
            forecast={data?.forecast ?? null}
            assessments={assessments}
            isLoading={isLoading}
            panelRef={panelRef}
          />
          <div className="app-zone-controls">
            <RegionFilter />
            <ZoneList
              zones={data?.zones ?? []}
              weather={data?.weather ?? {}}
              assessments={assessments}
            />
          </div>
        </div>

        <div className="app-panel-col" ref={panelRef}>
          {isLoading ? (
            <div className="panel-skeleton">
              <div className="skeleton-block skeleton-lg" />
              <div className="skeleton-block skeleton-md" />
              <div className="skeleton-block skeleton-md" />
              <div className="skeleton-block skeleton-sm" />
            </div>
          ) : error ? (
            <div className="panel-error">
              <p>Failed to load conditions data.</p>
              <p className="panel-error-detail">{(error as Error).message}</p>
            </div>
          ) : (
            <ZoneDetailPanel
              detail={detailQuery.data ?? null}
              isLoading={detailQuery.isLoading && !!selectedZoneId}
              zones={data?.zones}
              weather={data?.weather}
              forecast={data?.forecast}
              assessments={assessments}
            />
          )}
          <Attribution />
        </div>
      </div>
    </div>
  );
}
