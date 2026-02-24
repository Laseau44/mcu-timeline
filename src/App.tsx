import { useEffect, useMemo } from 'react';
import { useStore, getFilteredEntries } from './store/store';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import ProgressBar from './components/ProgressBar';
import FilterBar from './components/FilterBar';
import PhaseSection from './components/PhaseSection';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  const loadStatuses = useStore((s) => s.loadStatuses);
  const isLoading = useStore((s) => s.isLoading);

  const typeFilter = useStore((s) => s.typeFilter);
  const statusFilter = useStore((s) => s.statusFilter);
  const searchQuery = useStore((s) => s.searchQuery);
  const statuses = useStore((s) => s.statuses);

  useEffect(() => {
    loadStatuses();
  }, [loadStatuses]);

  const filtered = useMemo(
    () => getFilteredEntries({ typeFilter, statusFilter, searchQuery, statuses } as any),
    [typeFilter, statusFilter, searchQuery, statuses]
  );

  const phases = [1, 2, 3, 4, 5, 6];

  // Generate starfield
  useEffect(() => {
    const container = document.getElementById('starfield');
    if (!container || container.children.length > 0) return;
    for (let i = 0; i < 150; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.width = star.style.height = `${Math.random() * 2 + 1}px`;
      star.style.animationDelay = `${Math.random() * 4}s`;
      star.style.animationDuration = `${2 + Math.random() * 3}s`;
      container.appendChild(star);
    }
  }, []);

  return (
    <div className="app">
      <div id="starfield" className="starfield" />
      <div className="app-container">
        <Header />
        <StatsBar />
        <ProgressBar />
        <FilterBar />

        {isLoading ? (
          <div className="loading">
            <div className="loading-spinner" />
            <p>Chargement de la progression...</p>
          </div>
        ) : (
          <div className="timeline">
            {phases.map((phase) => {
              const phaseEntries = filtered.filter((e) => e.phase === phase);
              return (
                <PhaseSection
                  key={phase}
                  phase={phase}
                  entries={phaseEntries}
                />
              );
            })}
            {filtered.length === 0 && (
              <div className="no-results">
                <p>🔍 Aucun résultat trouvé</p>
              </div>
            )}
          </div>
        )}
      </div>
      <ScrollToTop />
    </div>
  );
}
