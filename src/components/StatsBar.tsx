import { useStore, getStats } from '../store/store';

export default function StatsBar() {
    const statuses = useStore((s) => s.statuses);

    const stats = getStats(statuses);

    const cards = [
        { label: 'Total', value: stats.total, icon: '🎬', color: '#4a9eff' },
        { label: 'Films', value: stats.films, icon: '🎥', color: '#4a9eff' },
        { label: 'Séries', value: stats.series, icon: '📺', color: '#a855f7' },
        { label: 'Spéciaux', value: stats.specials, icon: '⭐', color: '#22d3a0' },
    ];

    return (
        <div className="stats-bar">
            {cards.map((c) => (
                <div key={c.label} className="stat-card" style={{ borderColor: c.color }}>
                    <span className="stat-icon">{c.icon}</span>
                    <span className="stat-value">{c.value}</span>
                    <span className="stat-label">{c.label}</span>
                </div>
            ))}
        </div>
    );
}
