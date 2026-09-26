import { useEffect, useState } from 'react';
import { useStore } from './store/store';
import { allMovies, collections } from './data/catalogue';
import type { Collection } from './data/catalogue';
import CataloguePage from './components/CataloguePage';
import Icon from './components/Icon';
import ScrollToTop from './components/ScrollToTop';

const currentPage = (): Collection => window.location.hash === '#/multivers' ? 'multivers' : 'mcu';
export default function App() {
  const [page, setPage] = useState<Collection>(currentPage);
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
  useEffect(() => { document.title = page === 'mcu' ? 'Notre marathon · MCU Timeline' : 'Les autres univers · MCU Timeline'; }, [page]);
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
  return <div className="app-shell">
    <a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); document.getElementById('main-content')?.focus(); }}>Aller au contenu</a>
    <aside className="sidebar">
      <a className="brand" href="#/" aria-label="MCU Timeline, accueil"><img src="/marvel-logo.svg" alt="Marvel"/><span>NOTRE MARATHON</span></a>
      <span className="sidebar-label">VOTRE COLLECTION</span>
      <nav className="main-nav" aria-label="Collections"><a href="#/" aria-current={page === 'mcu' ? 'page' : undefined}><Icon name="film"/><span>Timeline MCU</span><small>{collections.mcu.movies.length}</small></a><a href="#/multivers" aria-current={page === 'multivers' ? 'page' : undefined}><Icon name="orbit"/><span>Le multivers</span><small>{collections.multivers.movies.length}</small></a></nav>
      <div className="sidebar-note"><span className="sidebar-note-line"/><Icon name="heart" size={21}/><p>Un film.<br/>Une soirée.<br/><strong>Votre histoire.</strong></p></div>
      <div className="sidebar-bottom"><div className="together-label"><span className="together-icon"><Icon name="heart" size={17}/></span><div><strong>Notre aventure</strong><span>{watched} souvenir{watched > 1 ? 's' : ''} de cinéma</span></div></div><progress value={watched} max={allMovies.length} aria-label="Progression des deux collections"/><button className="backup-button" onClick={downloadProgress}><Icon name="download" size={15}/>Exporter la progression</button><span className="backup-message" role="status">{backupMessage}</span></div>
    </aside>
    <div className="main-layout">
      <header className="topbar"><span className="topbar-path">NOTRE COLLECTION <span>/</span> <strong>{page === 'mcu' ? 'LA TIMELINE' : 'LE MULTIVERS'}</strong></span><span className="topbar-together"><Icon name="heart" size={14}/> À regarder ensemble</span></header>
      <main className="main-content" id="main-content" tabIndex={-1}><CataloguePage key={page} collection={page}/></main>
      <footer className="site-footer"><div className="mobile-backup"><button className="backup-button" onClick={downloadProgress}><Icon name="download" size={15}/>Exporter la progression</button><span role="status">{backupMessage}</span></div><span>MCU Timeline <i>·</i> Votre petit cinéma à deux.</span><span>Affiches : <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">TMDB</a>. Site non affilié à Marvel et non approuvé par TMDB.</span></footer>
    </div>
    <ScrollToTop/>
  </div>;
}
