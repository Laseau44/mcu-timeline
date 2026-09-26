import { useStore } from '../store/store';
import type { MCUType, WatchStatus } from '../data/mcu';

export default function FilterBar() {
    const typeFilter = useStore((s) => s.typeFilter);
    const statusFilter = useStore((s) => s.statusFilter);
    const searchQuery = useStore((s) => s.searchQuery);
    const setTypeFilter = useStore((s) => s.setTypeFilter);
    const setStatusFilter = useStore((s) => s.setStatusFilter);
    const setSearchQuery = useStore((s) => s.setSearchQuery);
    const resetAll = useStore((s) => s.resetAll);

    const typeButtons: { label: string; value: MCUType | 'all'; icon: string }[] = [
        { label: 'Tout', value: 'all', icon: '🌐' },
        { label: 'Films', value: 'film', icon: '🎥' },
        { label: 'Séries', value: 'series', icon: '📺' },
        { label: 'Spéciaux', value: 'special', icon: '⭐' },
    ];

    const statusButtons: { label: string; value: WatchStatus | 'all'; icon: string }[] = [
        { label: 'Tous', value: 'all', icon: '📋' },
        { label: 'Vus', value: 'watched', icon: '✅' },
        { label: 'En cours', value: 'watching', icon: '▶' },
        { label: 'Pas vus', value: 'unwatched', icon: '⬜' },
    ];

    const handleReset = () => {
        if (window.confirm('Réinitialiser toute la progression ? Cette action est irréversible.')) {
            resetAll();
        }
    };

    return (
        <div className="filter-bar">
            <div className="filter-row">
                <div className="filter-group">
                    <span className="filter-group-label">Type</span>
                    <div className="filter-buttons">
                        {typeButtons.map((b) => (
                            <button
                                key={b.value}
                                className={`filter-btn${typeFilter === b.value ? ' active' : ''} type-${b.value}`}
                                onClick={() => setTypeFilter(b.value)}
                            >
                                <span className="filter-icon">{b.icon}</span>
                                {b.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="filter-group">
                    <span className="filter-group-label">Statut</span>
                    <div className="filter-buttons">
                        {statusButtons.map((b) => (
                            <button
                                key={b.value}
                                className={`filter-btn${statusFilter === b.value ? ' active' : ''} status-${b.value}`}
                                onClick={() => setStatusFilter(b.value)}
                            >
                                <span className="filter-icon">{b.icon}</span>
                                {b.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="filter-row search-row">
                <div className="search-wrapper">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Rechercher un titre..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button className="search-clear" onClick={() => setSearchQuery('')}>
                            ✕
                        </button>
                    )}
                </div>
                <button className="reset-btn" onClick={handleReset}>
                    🗑️ Reset
                </button>
            </div>
        </div>
    );
}
