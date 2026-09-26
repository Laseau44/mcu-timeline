import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { allMovies } from '../data/catalogue';
import type { Movie } from '../data/catalogue';
import { passages, universes } from '../data/universes';
import { useStore } from '../store/store';
import MovieDialog from './MovieDialog';
import Poster from './Poster';
import type { SceneHandle } from './SpectralScene';
import './SpectralMap.css';

const SpectralScene = lazy(() => import('./SpectralScene'));
const names: Record<string, string> = { mcu: 'Avengers', xmen: 'X-Men', raimi: 'Raimi', webb: 'Amazing', blade: 'Blade', miles: 'Miles', gwen: 'Gwen', '838': 'Terre 838', tva: 'TVA' };

export default function UniverseMap() {
  const [selectedId, setSelectedId] = useState('mcu');
  const [mode, setMode] = useState<'orbit' | 'pan'>('orbit');
  const [links, setLinks] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [moving, setMoving] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const scene = useRef<SceneHandle>(null);
  const expandButton = useRef<HTMLButtonElement>(null);
  const statuses = useStore(s => s.statuses);
  const selected = universes.find(u => u.id === selectedId)!;
  const movies = selected.movies.map(id => allMovies.find(m => m.id === id)).filter((m): m is Movie => !!m);
  const visited = movies.filter(m => statuses[m.id] === 'watched').length;

  useEffect(() => {
    if (!expanded) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape' && !document.querySelector('dialog[open]')) { setExpanded(false); expandButton.current?.focus(); } };
    window.addEventListener('keydown', escape);
    return () => { document.body.style.overflow = overflow; window.removeEventListener('keydown', escape); };
  }, [expanded]);

  return <section className={`spectral-page ${expanded ? 'spectral-expanded' : ''}`} aria-labelledby="map-title">
    <header className="spectral-heading">
      <div><p className="spectral-kicker">MARVEL / ATLAS DES RÉALITÉS</p><h1 id="map-title">MULTIVERS</h1></div>
      <div className="spectral-intro"><p>Un monde n’est que le début.<br/>Explorez les autres.</p><button ref={expandButton} onClick={() => setExpanded(!expanded)}>{expanded ? 'Quitter l’immersion ↙' : 'Explorer en immersion ↗'}</button></div>
    </header>
    <div className="spectral-layout">
      <div className="spectral-view">
        <div className="spectral-caption"><span>01 — ESPACE MULTIVERSAL</span><button aria-pressed={moving} onClick={() => setMoving(!moving)}>{moving ? 'Ⅱ Suspendre le mouvement' : '▷ Animer la sculpture'}</button></div>
        <Suspense fallback={<div className="spectral-scene scene-loading">Construction de l’espace…</div>}><SpectralScene selected={selectedId} onSelect={setSelectedId} moving={moving} links={links} mode={mode} sceneRef={scene}/></Suspense>
        <div className="spectral-controls" role="group" aria-label="Commandes de la carte"><div><button aria-pressed={mode === 'orbit'} onClick={() => setMode('orbit')}>Pivoter</button><button aria-pressed={mode === 'pan'} onClick={() => setMode('pan')}>Déplacer</button></div><span>Glisser · Molette / pincer</span><div><button aria-label="Dézoomer" onClick={() => scene.current?.zoom(1.2)}>−</button><button aria-label="Zoomer" onClick={() => scene.current?.zoom(1 / 1.2)}>+</button><button aria-label="Recentrer la carte" onClick={() => scene.current?.reset()}>↺</button></div></div>
        <nav className="spectral-index" aria-label="Accès direct aux univers">{universes.map((u, i) => <button key={u.id} aria-pressed={selectedId === u.id} onClick={() => setSelectedId(u.id)}><small>{String(i + 1).padStart(2, '0')}</small><span>{names[u.id]}</span></button>)}</nav>
        <div className="spectral-legend"><span>09 repères · Une infinité de possibles</span><label><input type="checkbox" checked={links} onChange={event => setLinks(event.target.checked)}/>Révéler les passages <small>spoilers</small></label></div>
      </div>
      <aside className="spectral-detail" aria-labelledby="universe-name">
        <p className="spectral-kicker">RÉALITÉ SÉLECTIONNÉE / {String(universes.indexOf(selected) + 1).padStart(2, '0')}</p>
        <p className="spectral-earth">{selected.id === 'tva' ? 'HORS DU TEMPS' : 'TERRE'}</p><p className="spectral-code" aria-live="polite">{selected.id === 'tva' ? 'TVA' : selected.code.replace('TERRE-', '')}</p>
        <h2 id="universe-name">{selected.name}</h2><p className="spectral-hero">{selected.hero}</p><p className="spectral-description">{selected.description}</p>
        <div className="spectral-progress"><span>VOTRE EXPLORATION</span><span>{visited} / {movies.length} vus</span><progress value={visited} max={movies.length} aria-label={`Progression ${selected.name}`}/></div>
        <div className="spectral-films">{movies.map(item => <button key={item.id} onClick={() => setMovie(item)}><div><Poster movie={item}/></div><span><strong>{item.title}</strong><small>{item.year} · {statuses[item.id] === 'watched' ? 'Vu ensemble ✓' : statuses[item.id] === 'watching' ? 'En cours' : 'À voir'}</small></span><i aria-hidden="true">↗</i></button>)}</div>
        {links && <div className="spectral-passages"><h3>Passages à l’écran</h3>{passages.filter(p => p.from === selectedId || p.to === selectedId).map(p => { const other = universes.find(u => u.id === (p.from === selectedId ? p.to : p.from))!; return <button key={`${p.from}-${p.to}`} onClick={() => setSelectedId(other.id)}>{other.code} ↗ <span>{p.film}</span></button>; })}{!passages.some(p => p.from === selectedId || p.to === selectedId) && <p>Aucun passage représenté pour ce repère.</p>}</div>}
        <details className="spectral-reference"><summary>À propos de cette réalité</summary><p>{selected.note}</p><a href={selected.source.url} target="_blank" rel="noreferrer">{selected.source.title} ↗</a></details>
      </aside>
    </div>
    <p className="spectral-footnote">Une interprétation visuelle de votre collection. Les positions sont imaginaires et les branches X-Men regroupées. Les passages révélés correspondent aux films indiqués ; aucun futur crossover n’est supposé.</p>
    {movie && <MovieDialog key={movie.id} movie={movie} onClose={() => setMovie(null)}/>}
  </section>;
}
