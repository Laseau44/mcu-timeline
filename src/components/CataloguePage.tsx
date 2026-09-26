import { useMemo, useState } from 'react';
import type { Collection, Movie } from '../data/catalogue';
import { collections, normalizeSearch } from '../data/catalogue';
import type { MCUType, WatchStatus } from '../data/mcu';
import { useStore } from '../store/store';
import MovieCard from './MovieCard';
import MovieDialog from './MovieDialog';
import Poster from './Poster';
import Icon from './Icon';

function readView(): 'grid' | 'list' {
  try { return localStorage.getItem('marvel-display') === 'list' ? 'list' : 'grid'; } catch { return 'grid'; }
}

export default function CataloguePage({ collection }: { collection: Collection }) {
  const { movies, chapters } = collections[collection];
  const statuses = useStore(s => s.statuses);
  const isLoading = useStore(s => s.isLoading);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<WatchStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<MCUType | 'all'>('all');
  const [chapterFilter, setChapterFilter] = useState('all');
  const [view, setView] = useState(readView);
  const [hideUpcoming, setHideUpcoming] = useState(false);
  const [selected, setSelected] = useState<Movie | null>(null);
  const isMcu = collection === 'mcu';
  const watched = movies.filter(movie => statuses[movie.id] === 'watched').length;
  const watching = movies.filter(movie => statuses[movie.id] === 'watching').length;
  const percent = Math.round(watched / movies.length * 100);
  const nextMovie = movies.find(movie => statuses[movie.id] === 'watching' && !movie.upcoming) || movies.find(movie => statuses[movie.id] !== 'watched' && !movie.upcoming);
  const heroMovie = movies.find(movie => movie.id === (isMcu ? 'infinity-war' : 'alt-days-future-past'))!;
  const hasFilters = query.trim() !== '' || statusFilter !== 'all' || typeFilter !== 'all' || chapterFilter !== 'all' || hideUpcoming;
  const filtered = useMemo(() => movies.filter(movie => {
    if (statusFilter !== 'all' && (statuses[movie.id] || 'unwatched') !== statusFilter) return false;
    if (typeFilter !== 'all' && movie.type !== typeFilter) return false;
    if (chapterFilter !== 'all' && movie.group !== chapterFilter) return false;
    if (hideUpcoming && movie.upcoming) return false;
    return normalizeSearch(movie.title).includes(normalizeSearch(query));
  }), [movies, statuses, statusFilter, typeFilter, chapterFilter, hideUpcoming, query]);
  const resetFilters = () => { setQuery(''); setStatusFilter('all'); setTypeFilter('all'); setChapterFilter('all'); setHideUpcoming(false); };
  const changeView = (value: 'grid' | 'list') => { setView(value); try { localStorage.setItem('marvel-display', value); } catch { /* Display preference is optional. */ } };
  const explore = () => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
  const filterButtons: { value: WatchStatus | 'all'; label: string; count: number }[] = [
    { value: 'all', label: 'Tout', count: movies.length },
    { value: 'unwatched', label: 'À voir', count: movies.length - watched - watching },
    { value: 'watching', label: 'En cours', count: watching },
    { value: 'watched', label: 'Vus ensemble', count: watched },
  ];

  return <>
    <section className={`cinema-hero ${isMcu ? 'hero-mcu' : 'hero-multivers'}`} aria-labelledby="hero-title">
      {heroMovie.artwork?.backdrop && <img className="hero-backdrop" src={heroMovie.artwork.backdrop} alt="" fetchPriority="high"/>}
      <div className="hero-overlay"/>
      <div className="hero-content">
        <span className="eyebrow hero-eyebrow"><span className="live-dot"/>{isMcu ? 'VOTRE MARATHON MARVEL' : 'D’AUTRES UNIVERS. LA MÊME PASSION.'}</span>
        <h1 id="hero-title">{isMcu ? <>Une saga.<br/><span>Vos soirées.</span></> : <>L’aventure<br/><span>va plus loin.</span></>}</h1>
        <p>{isMcu ? 'Tous les héros, dans le bon ordre. Choisissez votre prochain film et écrivez la suite de votre marathon à deux.' : 'X-Men, Blade et les autres Spider-Man. Retrouvez vos héros au-delà de la timeline MCU, une soirée après l’autre.'}</p>
        <div className="hero-actions"><button className="button button-primary" disabled={isLoading} onClick={() => nextMovie ? setSelected(nextMovie) : explore()}><Icon name="play" size={17}/>{nextMovie ? 'Notre prochain film' : 'Explorer la collection'}</button><button className="button button-quiet" onClick={explore}>Voir la collection <Icon name="arrow" size={17}/></button></div>
        <div className="hero-facts"><span><Icon name="film" size={14}/>{movies.length} {isMcu ? 'films & séries' : 'films'}</span><i/><span>{chapters.length} {isMcu ? 'phases à explorer' : 'univers à retrouver'}</span><i/><span>{isMcu ? 'Ordre de l’histoire' : 'Ordre de sortie par saga'}</span></div>
      </div>
      <div className="hero-caption"><span>{isMcu ? 'LA SAGA DE L’INFINI' : 'L’UNIVERS DES MUTANTS'}</span><strong>{heroMovie.title}</strong></div>
    </section>

    <section className="marathon-strip" aria-label="Progression de la collection">
      <div className="marathon-count"><span className="eyebrow">NOTRE MARATHON</span><div><strong>{watched}<span>/{movies.length}</span></strong><span>titres vus ensemble</span></div></div>
      <div className="marathon-meter"><div><span>Chaque soirée compte.</span><strong>{percent}%</strong></div><progress value={watched} max={movies.length} aria-label="Progression de la collection"/><span>{watching > 0 ? `${watching} en cours · ` : ''}{movies.length - watched} {movies.length - watched === 1 ? 'titre à découvrir' : 'titres à découvrir'}</span></div>
      <button className="next-up" disabled={isLoading || !nextMovie} onClick={() => nextMovie && setSelected(nextMovie)}>
        {nextMovie ? <><div className="next-poster"><Poster movie={nextMovie} eager/></div><div><span className="eyebrow">{statuses[nextMovie.id] === 'watching' ? 'ON REPREND ?' : 'LE PROCHAIN RENDEZ-VOUS'}</span><strong>{nextMovie.title}</strong><small>{nextMovie.year} · {nextMovie.artwork?.runtime?.replace('m', 'min') || (nextMovie.type === 'series' ? 'Série' : 'Film')}</small></div><Icon name="arrow" size={19}/></> : <><Icon name="check" size={26}/><div><strong>Vous êtes à jour !</strong><small>Tous les titres disponibles sont vus.</small></div></>}
      </button>
    </section>

    <a className="journey-link" href="#/carte"><span><i aria-hidden="true">✧</i>Chaque histoire ouvre un autre monde.</span><strong>Explorer la carte ↗</strong></a>
    <section id="collection" className="catalogue-section" aria-labelledby="collection-title">
      <div className="collection-heading"><div><span className="eyebrow">{isMcu ? 'LE FIL DE L’HISTOIRE' : 'LES AUTRES UNIVERS'}</span><h2 id="collection-title">{isMcu ? 'La timeline MCU' : 'Le multivers Marvel'}<span>{movies.length}</span></h2><p>{isMcu ? 'Du premier Avenger aux prochaines aventures.' : 'Votre sélection : X-Men, Deadpool, Blade et les sagas Spider-Man.'}</p></div><div className="view-switch" role="group" aria-label="Mode d’affichage"><button className={view === 'grid' ? 'active' : ''} aria-label="Vue affiches" aria-pressed={view === 'grid'} onClick={() => changeView('grid')}><Icon name="grid" size={18}/></button><button className={view === 'list' ? 'active' : ''} aria-label="Vue liste" aria-pressed={view === 'list'} onClick={() => changeView('list')}><Icon name="list" size={20}/></button></div></div>
      <div className="catalogue-toolbar">
        <div className="status-tabs" role="group" aria-label="Filtrer par statut">{filterButtons.map(item => <button key={item.value} className={statusFilter === item.value ? 'active' : ''} aria-pressed={statusFilter === item.value} onClick={() => setStatusFilter(item.value)}>{item.label}<span>{item.count}</span></button>)}</div>
        <label className="search-field"><Icon name="search" size={18}/><input type="search" placeholder="Rechercher un titre…" aria-label="Rechercher un titre" value={query} onChange={event => setQuery(event.target.value)}/>{query && <button onClick={() => setQuery('')} aria-label="Effacer la recherche"><Icon name="close" size={15}/></button>}</label>
      </div>
      <div className="catalogue-subfilters">
        <label className="filter-select"><span className="sr-only">{isMcu ? 'Phase' : 'Univers'}</span><select aria-label={isMcu ? 'Phase' : 'Univers'} value={chapterFilter} onChange={event => setChapterFilter(event.target.value)}><option value="all">{isMcu ? 'Toutes les phases' : 'Tous les univers'}</option>{chapters.map(chapter => <option key={chapter.id} value={chapter.id}>{isMcu ? `Phase ${chapter.id} · ` : ''}{chapter.name}</option>)}</select><Icon name="chevron" size={14}/></label>
        {isMcu && <><label className="filter-select"><span className="sr-only">Format</span><select aria-label="Format" value={typeFilter} onChange={event => setTypeFilter(event.target.value as MCUType | 'all')}><option value="all">Films & séries</option><option value="film">Films</option><option value="series">Séries</option></select><Icon name="chevron" size={14}/></label><label className="upcoming-filter"><input type="checkbox" checked={hideUpcoming} onChange={event => setHideUpcoming(event.target.checked)}/>Masquer les titres à venir</label></>}
        <span className="result-count" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'titre' : 'titres'}</span>
        {hasFilters && <button className="reset-filters" onClick={resetFilters}>Effacer les filtres <Icon name="close" size={13}/></button>}
      </div>

      {isLoading ? <div className="catalogue-loading"><span className="loading-spinner"/>On retrouve votre progression…</div> :
        <div className={`catalogue catalogue-${view}`}>
          {chapters.map((chapter, chapterIndex) => {
            const entries = filtered.filter(movie => movie.group === chapter.id);
            if (!entries.length) return null;
            const allChapter = movies.filter(movie => movie.group === chapter.id);
            const chapterWatched = allChapter.filter(movie => statuses[movie.id] === 'watched').length;
            return <section className="chapter" key={chapter.id} aria-labelledby={`chapter-${chapter.id}`}>
              <div className="chapter-heading"><span className="chapter-number">{String(chapterIndex + 1).padStart(2, '0')}</span><div><h3 id={`chapter-${chapter.id}`}>{chapter.name}</h3><p>{chapter.subtitle}</p></div><div className="chapter-progress"><span>{chapterWatched}<i> / {allChapter.length} vus</i></span><progress value={chapterWatched} max={allChapter.length} aria-label={`Progression ${chapter.name}`}/></div></div>
              <div className="movie-grid">{entries.map((movie, index) => <MovieCard movie={movie} onOpen={setSelected} key={movie.id} eager={chapterIndex === 0 && index < 4}/>)}</div>
            </section>;
          })}
          {!filtered.length && <div className="empty-state"><Icon name={statusFilter === 'watched' ? 'heart' : 'search'} size={36}/><h3>{statusFilter === 'watched' && !query ? 'Votre histoire commence ici.' : 'Aucun titre ne correspond.'}</h3><p>{statusFilter === 'watched' && !query ? 'Marquez votre premier film comme vu : il vous attendra ici.' : 'Essayez un autre titre ou élargissez vos filtres.'}</p><button className="button button-secondary" onClick={resetFilters}>Afficher la collection</button></div>}
        </div>}
    </section>
    <div className="closing-note"><Icon name="heart" size={18}/><p>Le meilleur de l’histoire, c’est de la regarder ensemble.</p></div>
    {selected && <MovieDialog key={selected.id} movie={selected} onClose={() => setSelected(null)}/>}
  </>;
}
