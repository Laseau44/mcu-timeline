import { useEffect, useState } from 'react';
import { useStore } from './store/store';
import { allMovies, collections } from './data/catalogue';
import type { Collection } from './data/catalogue';
import CataloguePage from './components/CataloguePage';
import Icon from './components/Icon';
import ScrollToTop from './components/ScrollToTop';
import UniverseMap from './components/UniverseMap';
import AmbientField from './components/AmbientField';
import './experience.css';

type Page = Collection | 'carte';
const currentPage = (): Page => window.location.hash === '#/carte' ? 'carte' : window.location.hash === '#/multivers' ? 'multivers' : 'mcu';
export default function App() {
  const [page, setPage] = useState<Page>(currentPage);
  const [ambience, setAmbience] = useState(() => {
    try {
      const saved = localStorage.getItem('marvel-ambience');
      if (saved !== null) return saved === 'on';
    } catch { /* Fall back to the system preference. */ }
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const toggleAmbience = () => setAmbience(value => {
    try { localStorage.setItem('marvel-ambience', value ? 'off' : 'on'); } catch { /* Optional preference. */ }
    return !value;
  });
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => { if (preference.matches) setAmbience(false); };
    preference.addEventListener('change', change);
    return () => preference.removeEventListener('change', change);
  }, []);
  const loadStatuses = useStore(s => s.loadStatuses);
  const statuses = useStore(s => s.statuses);
  const [backupMessage, setBackupMessage] = useState('');
  const watched = allMovies.filter(movie => statuses[movie.id] === 'watched').length;
  useEffect(() => {
    const navigate = () => { setPage(currentPage()); window.scrollTo({ top: 0, behavior: 'instant' }); };
    window.addEventListener('hashchange', navigate);
    return () => window.removeEventListener('hashchange', navigate);
  }, []);
  useEffect(() => { void loadStatuses(); }, [loadStatuses]);
  useEffect(() => { document.title = page === 'carte' ? 'Carte du multivers · MCU Timeline' : page === 'mcu' ? 'Notre marathon · MCU Timeline' : 'Les autres univers · MCU Timeline'; }, [page]);
  const downloadProgress = () => {
    const file = new Blob([JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), statuses }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = `marvel-progression-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setBackupMessage('Export demandé');
  };
  return <div className={`app-shell experience-shell ${ambience ? 'ambience-on' : 'ambience-off'} ${page === 'carte' ? 'atlas-mode' : ''}`}>
    <AmbientField enabled={ambience}/>
    <a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); document.getElementById('main-content')?.focus(); }}>Aller au contenu</a>
    <aside className="sidebar">
      <a className="brand" href="#/" aria-label="MCU Timeline, accueil"><img src="/marvel-logo.svg" alt="Marvel"/><span>NOTRE MARATHON</span></a>
      <button className="ambience-toggle" aria-pressed={ambience} onClick={toggleAmbience} title="Activer ou figer les lumières et le fond interactif"><span aria-hidden="true">{ambience ? '◌' : '○'}</span>{ambience ? 'Ambiance animée' : 'Ambiance figée'}</button>
      <nav className="main-nav" aria-label="Collections"><a href="#/" aria-current={page === 'mcu' ? 'page' : undefined}><Icon name="film"/><span>Timeline MCU</span><small>{collections.mcu.movies.length}</small></a><a href="#/multivers" aria-current={page === 'multivers' ? 'page' : undefined}><Icon name="orbit"/><span>Le multivers</span><small>{collections.multivers.movies.length}</small></a><a href="#/carte" aria-current={page === 'carte' ? 'page' : undefined}><Icon name="spark"/><span>Carte des univers</span><small>9</small></a></nav>
      <div className="sidebar-note"><span className="sidebar-note-line"/><Icon name="heart" size={21}/><p>Un film.<br/>Une soirée.<br/><strong>Votre histoire.</strong></p></div>
      <div className="sidebar-bottom"><div className="together-label"><span className="together-icon"><Icon name="heart" size={17}/></span><div><strong>Notre aventure</strong><span>{watched} souvenir{watched > 1 ? 's' : ''} de cinéma</span></div></div><progress value={watched} max={allMovies.length} aria-label="Progression des deux collections"/><button className="backup-button" onClick={downloadProgress}><Icon name="download" size={15}/>Exporter la progression</button><span className="backup-message" role="status">{backupMessage}</span></div>
    </aside>
    <div className="main-layout">
      <header className="topbar"><span className="topbar-path">NOTRE COLLECTION <span>/</span> <strong>{page === 'carte' ? 'LA CARTE' : page === 'mcu' ? 'LA TIMELINE' : 'LE MULTIVERS'}</strong></span><span className="topbar-together"><Icon name="heart" size={14}/> À regarder ensemble</span></header>
      <main className="main-content" id="main-content" tabIndex={-1}><div key={page} className="page-arrival">{page === 'carte' ? <UniverseMap/> : <CataloguePage collection={page}/>}</div></main>
      <footer className="site-footer"><div className="mobile-backup"><button className="backup-button" onClick={downloadProgress}><Icon name="download" size={15}/>Exporter la progression</button><span role="status">{backupMessage}</span></div><span>MCU Timeline <i>·</i> Votre petit cinéma à deux.</span><span>Affiches : <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">TMDB</a>. Site non affilié à Marvel et non approuvé par TMDB.</span></footer>
    </div>
    <ScrollToTop/>
  </div>;
}
