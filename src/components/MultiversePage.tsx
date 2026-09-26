import { useMemo, useState } from 'react';
import { MULTIVERSE_GROUPS, multiverseEntries } from '../data/multiverse';
import type { MultiverseEntry } from '../data/multiverse';
import type { WatchStatus } from '../data/mcu';
import { useStore } from '../store/store';
import StatusDropdown from './StatusDropdown';

type Relevance = MultiverseEntry['relevance'];
const relevanceLabels: Record<Relevance, string> = {
  direct: 'À voir en priorité',
  context: 'Pour approfondir',
  bonus: 'Bonus',
};

export default function MultiversePage() {
  const statuses = useStore((s) => s.statuses);
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState<Relevance | 'all'>('all');
  const [status, setStatus] = useState<WatchStatus | 'all'>('all');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const watched = multiverseEntries.filter((entry) => statuses[entry.id] === 'watched').length;
  const watching = multiverseEntries.filter((entry) => statuses[entry.id] === 'watching').length;
  const progress = Math.round((watched / multiverseEntries.length) * 100);
  const visible = useMemo(() => multiverseEntries.filter((entry) => {
    if (level !== 'all' && entry.relevance !== level) return false;
    if (status !== 'all' && (statuses[entry.id] || 'unwatched') !== status) return false;
    return entry.title.toLocaleLowerCase('fr').includes(query.trim().toLocaleLowerCase('fr'));
  }), [level, status, statuses, query]);

  return (
    <main className="multiverse-page">
      <div className="multiverse-hero">
        <span className="multiverse-kicker">AU-DELÀ DE LA TIMELINE</span>
        <h2>Les autres univers Marvel</h2>
        <p>Une checklist pour les films X-Men et Wolverine, Deadpool, Blade et les trois sagas Spider-Man hors de la timeline MCU. Chaque saga suit son ordre de sortie : il n’existe pas de chronologie commune à tous ces univers.</p>
        <div className="multiverse-guide">
          <span><b>À voir en priorité</b> · origines de personnages croisés dans le MCU</span>
          <span><b>Pour approfondir</b> · contexte et sagas complètes</span>
          <span><b>Bonus</b> · adaptations plus indépendantes</span>
        </div>
      </div>

      <div className="multiverse-progress" aria-label={`Progression : ${watched} sur ${multiverseEntries.length} vus`}>
        <div className="multiverse-progress-head">
          <strong>Votre progression hors MCU</strong>
          <span>{watched}/{multiverseEntries.length} vus · {watching} en cours</span>
        </div>
        <div className="progress-track"><div className="progress-fill watched" style={{ width: `${progress}%` }} /></div>
      </div>

      <div className="multiverse-filters">
        <label className="multiverse-search">
          <span className="sr-only">Rechercher un titre</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un film…" type="search" />
        </label>
        <label>Importance <select value={level} onChange={(event) => setLevel(event.target.value as Relevance | 'all')}>
          <option value="all">Toutes</option><option value="direct">À voir en priorité</option><option value="context">Pour approfondir</option><option value="bonus">Bonus</option>
        </select></label>
        <label>Statut <select value={status} onChange={(event) => setStatus(event.target.value as WatchStatus | 'all')}>
          <option value="all">Tous</option><option value="unwatched">Pas vus</option><option value="watching">En cours</option><option value="watched">Vus</option>
        </select></label>
      </div>

      <div className="multiverse-groups">
        {MULTIVERSE_GROUPS.map((group) => {
          const entries = visible.filter((entry) => entry.group === group.id);
          if (entries.length === 0) return null;
          const groupTotal = multiverseEntries.filter((entry) => entry.group === group.id).length;
          const groupWatched = multiverseEntries.filter((entry) => entry.group === group.id && statuses[entry.id] === 'watched').length;
          const isCollapsed = collapsed[group.id] ?? false;
          return <section className="multiverse-group" key={group.id}>
            <button className="multiverse-group-head" aria-expanded={!isCollapsed} onClick={() => setCollapsed((current) => ({ ...current, [group.id]: !isCollapsed }))}>
              <span className="multiverse-group-icon" aria-hidden="true">{group.icon}</span>
              <span className="multiverse-group-heading"><strong>{group.name}</strong><small>{group.intro}</small></span>
              <span className="multiverse-group-count">{groupWatched}/{groupTotal}</span>
              <span aria-hidden="true">{isCollapsed ? '▸' : '▾'}</span>
            </button>
            {!isCollapsed && <div className="multiverse-list">{entries.map((entry) => <MultiverseCard key={entry.id} entry={entry} icon={group.icon} />)}</div>}
          </section>;
        })}
        {visible.length === 0 && <div className="no-results">Aucun titre trouvé.</div>}
      </div>
      <p className="multiverse-footnote">Les niveaux indiquent l’intérêt de visionnage, pas une confirmation de présence dans un futur film Avengers. Les films déjà présents dans la timeline MCU restent sur la première page.</p>
    </main>
  );
}

function MultiverseCard({ entry, icon }: { entry: MultiverseEntry; icon: string }) {
  const status = useStore((s) => s.statuses[entry.id] || 'unwatched');
  return <article className={`multiverse-card status-card-${status}`}>
    <span className="multiverse-card-icon" aria-hidden="true">{icon}</span>
    <div className="multiverse-card-copy">
      <div className="multiverse-card-title"><h3>{entry.title}</h3><span>{entry.year} · Film</span></div>
      <p>{entry.note}</p>
      <span className={`multiverse-relevance relevance-${entry.relevance}`}>{relevanceLabels[entry.relevance]}</span>
    </div>
    <div className="multiverse-card-status"><StatusDropdown entryId={entry.id} /></div>
  </article>;
}
