import { useState, useEffect } from 'react';
import type { MCUEntry } from '../data/mcu';
import { useStore } from '../store/store';
import { fetchPosterPath, getPosterUrl } from '../lib/tmdb';
import StatusDropdown from './StatusDropdown';

interface Props {
    entry: MCUEntry;
}

const TYPE_LABELS: Record<string, string> = {
    film: 'Film',
    series: 'Série',
    special: 'Spécial',
};

export default function EntryCard({ entry }: Props) {
    const status = useStore((s) => s.statuses[entry.id] || 'unwatched');
    const [expanded, setExpanded] = useState(false);
    const [posterPath, setPosterPath] = useState<string | null>(null);
    const [posterError, setPosterError] = useState(false);

    useEffect(() => {
        fetchPosterPath(entry.tmdb_id, entry.tmdb_type).then(setPosterPath);
    }, [entry.tmdb_id, entry.tmdb_type]);

    const releaseYear = new Date(entry.release_date).getFullYear();

    return (
        <div
            className={`entry-card status-card-${status}`}
            onClick={() => setExpanded(!expanded)}
        >
            <div className="entry-row">
                {/* Timeline dot */}
                <div className="timeline-connector">
                    <div className={`timeline-dot type-${entry.type}`} />
                    <div className="timeline-line" />
                </div>

                {/* Poster thumb */}
                <div className="entry-poster-thumb">
                    {posterPath && !posterError ? (
                        <img
                            src={getPosterUrl(posterPath, 'w200')}
                            alt={entry.title}
                            loading="lazy"
                            width={52}
                            height={78}
                            onError={() => setPosterError(true)}
                        />
                    ) : (
                        <div className="poster-fallback">🎬</div>
                    )}
                </div>

                {/* Content */}
                <div className="entry-content">
                    <div className="entry-top">
                        <span className="entry-number">#{entry.number}</span>
                        <h3 className="entry-title">{entry.title}</h3>
                    </div>
                    <div className="entry-meta">
                        <span className="entry-year">{entry.narrative_year}</span>
                        <span className={`badge type-badge type-${entry.type}`}>
                            {TYPE_LABELS[entry.type]}
                        </span>
                        <span className="entry-release">({releaseYear})</span>
                        {entry.upcoming && <span className="badge upcoming-badge">À venir</span>}
                    </div>
                </div>

                {/* Status */}
                <div className="entry-actions" onClick={(e) => e.stopPropagation()}>
                    <StatusDropdown entryId={entry.id} />
                </div>
            </div>

            {/* Expanded details */}
            {expanded && (
                <div className="entry-expanded">
                    <div className="entry-expanded-inner">
                        {posterPath && !posterError && (
                            <img
                                className="entry-poster-large"
                                src={getPosterUrl(posterPath, 'w500')}
                                alt={entry.title}
                                loading="lazy"
                            />
                        )}
                        <p className="entry-description">{entry.description}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
