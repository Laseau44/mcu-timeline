import { useEffect, useRef } from 'react';
import type { Movie } from '../data/catalogue';
import { statusLabels, typeLabels } from '../data/catalogue';
import type { WatchStatus } from '../data/mcu';
import { useStore } from '../store/store';
import Poster from './Poster';
import Icon from './Icon';

export default function MovieDialog({ movie, onClose }: { movie: Movie; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const status = useStore(s => s.statuses[movie.id] || 'unwatched');
  const setStatus = useStore(s => s.setStatus);
  useEffect(() => {
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = 'hidden';
    return () => { element?.close(); document.body.style.overflow = previousOverflow; };
  }, []);
  return <dialog ref={dialog} className="movie-dialog" aria-labelledby="movie-dialog-title" onClose={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="dialog-content">
      <button className="dialog-close icon-button" onClick={onClose} aria-label="Fermer la fiche" autoFocus><Icon name="close"/></button>
      <div className="dialog-poster"><Poster movie={movie} eager/></div>
      <div className="dialog-copy">
        <span className="eyebrow">VOTRE PROCHAINE SOIRÉE</span>
        <h2 id="movie-dialog-title">{movie.title}</h2>
        <p className="dialog-meta">{movie.year} <span>·</span> {typeLabels[movie.type]} {movie.artwork?.runtime && <> <span>·</span> {movie.artwork.runtime.replace('m', 'min')}</>}</p>
        {movie.upcoming && <span className="detail-upcoming">À venir dans votre liste</span>}
        <p className="dialog-description">{movie.description}</p>
        {movie.narrativeYear && <p className="narrative"><Icon name="clock" size={16}/> Dans l’histoire : {movie.narrativeYear}</p>}
        <label className="dialog-status-label" htmlFor="dialog-status">Notre visionnage</label>
        <div className={`watch-select watch-${status}`}><Icon name={status === 'watched' ? 'check' : 'clock'} size={17}/><select id="dialog-status" value={status} onChange={event => setStatus(movie.id, event.target.value as WatchStatus)}>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><Icon name="chevron" size={16}/></div>
        <button className="button button-primary dialog-action" onClick={() => { setStatus(movie.id, status === 'watched' ? 'unwatched' : 'watched'); }}>{status === 'watched' ? <><Icon name="clock" size={18}/> Remettre à voir</> : <><Icon name="check" size={18}/> On l’a vu !</>}</button>
      </div>
    </div>
  </dialog>;
}
