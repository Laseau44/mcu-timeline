import type { Movie } from '../data/catalogue';
import { typeLabels, statusLabels } from '../data/catalogue';
import type { WatchStatus } from '../data/mcu';
import { useStore } from '../store/store';
import Poster from './Poster';
import Icon from './Icon';

export default function MovieCard({ movie, onOpen, eager }: { movie: Movie; onOpen: (movie: Movie) => void; eager?: boolean }) {
  const status = useStore(s => s.statuses[movie.id] || 'unwatched');
  const setStatus = useStore(s => s.setStatus);
  return <article className={`movie-card movie-${status}`}>
    <div className="movie-art">
      <button className="poster-button" onClick={() => onOpen(movie)} aria-label={`Voir la fiche de ${movie.title}`}>
        <Poster movie={movie} eager={eager}/>
        <span className="poster-shade"/>
        <span className="poster-peek">Voir la fiche <Icon name="arrow" size={16}/></span>
      </button>
      <span className="movie-order">{String(movie.order).padStart(2, '0')}</span>
      <button className={`quick-check ${status === 'watched' ? 'is-checked' : ''}`} aria-label={status === 'watched' ? `Marquer ${movie.title} comme à voir` : `Marquer ${movie.title} comme vu`} aria-pressed={status === 'watched'} onClick={() => setStatus(movie.id, status === 'watched' ? 'unwatched' : 'watched')}><Icon name="check" size={19}/></button>
      {movie.upcoming && <span className="poster-tag upcoming-tag">À venir</span>}
      {!movie.upcoming && status === 'watching' && <span className="poster-tag watching-tag"><span/> En cours</span>}
      {!movie.upcoming && status === 'watched' && <span className="poster-tag watched-tag"><Icon name="check" size={12}/> Vu ensemble</span>}
    </div>
    <div className="movie-copy">
      <button className="movie-title" onClick={() => onOpen(movie)}>{movie.title}</button>
      <p className="movie-meta"><span>{movie.year}</span><span>{typeLabels[movie.type]}</span>{movie.artwork?.runtime && <span>{movie.artwork.runtime.replace('m', 'min')}</span>}</p>
      <p className="movie-list-description">{movie.description}</p>
      <div className={`watch-select watch-${status}`}>
        <Icon name={status === 'watched' ? 'check' : status === 'watching' ? 'play' : 'clock'} size={15}/>
        <select aria-label={`Statut de ${movie.title}`} value={status} onChange={event => setStatus(movie.id, event.target.value as WatchStatus)}>
          {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <Icon name="chevron" size={14}/>
      </div>
    </div>
  </article>;
}
