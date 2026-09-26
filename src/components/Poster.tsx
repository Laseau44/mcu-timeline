import { useEffect, useState } from 'react';
import type { Movie } from '../data/catalogue';
import { fetchPosterPath, getPosterUrl } from '../lib/tmdb';
import Icon from './Icon';

export default function Poster({ movie, eager = false }: { movie: Movie; eager?: boolean }) {
  const [resolved, setResolved] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  // The curated URL works without credentials. Configured TMDB can refresh a failed image.
  useEffect(() => {
    if (!failed || !movie.artwork) return;
    let active = true;
    fetchPosterPath(movie.artwork.tmdb, movie.artwork.mediaType).then(path => {
      if (active && path) setResolved(getPosterUrl(path, 'w500'));
    });
    return () => { active = false; };
  }, [failed, movie.artwork]);
  const source = resolved || (!failed ? movie.artwork?.poster : null);
  return source ? <img src={source} alt={`Affiche de ${movie.title}`} loading={eager ? 'eager' : 'lazy'} decoding="async" width="500" height="750" onError={() => { setFailed(true); setResolved(null); }} /> :
    <div className="poster-placeholder"><Icon name="film" size={32}/><span>{movie.title}</span><small>{movie.upcoming ? 'Affiche à venir' : 'Affiche indisponible'}</small></div>;
}
