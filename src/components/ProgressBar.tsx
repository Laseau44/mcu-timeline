import { useStore, getStats, getPhaseStats } from '../store/store';

export default function ProgressBar() {
    const statuses = useStore((s) => s.statuses);
    const stats = getStats(statuses);

    const watchedPct = (stats.watched / stats.total) * 100;
    const watchingPct = (stats.watching / stats.total) * 100;

    return (
        <div className="progress-section">
            <div className="progress-main">
                <div className="progress-header">
                    <span className="progress-title">Progression globale</span>
                    <span className="progress-pct">{Math.round(watchedPct)}%</span>
                </div>
                <div className="progress-track">
                    <div
                        className="progress-fill watched"
                        style={{ width: `${watchedPct}%` }}
                    />
                    <div
                        className="progress-fill watching"
                        style={{ width: `${watchingPct}%`, left: `${watchedPct}%` }}
                    />
                </div>
                <div className="progress-counters">
                    <span className="counter-watched">✅ {stats.watched} vus</span>
                    <span className="counter-watching">▶ {stats.watching} en cours</span>
                    <span className="counter-unwatched">⬜ {stats.unwatched} restants</span>
                </div>
            </div>

            <div className="progress-phases">
                {[1, 2, 3, 4, 5, 6].map((phase) => {
                    const ps = getPhaseStats(phase, statuses);
                    if (ps.total === 0) return null;
                    const wPct = (ps.watched / ps.total) * 100;
                    const iPct = (ps.watching / ps.total) * 100;
                    return (
                        <div key={phase} className="progress-phase-row">
                            <span className="phase-label-mini">P{phase}</span>
                            <div className="progress-track mini">
                                <div className="progress-fill watched" style={{ width: `${wPct}%` }} />
                                <div className="progress-fill watching" style={{ width: `${iPct}%`, left: `${wPct}%` }} />
                            </div>
                            <span className="phase-count-mini">{ps.watched}/{ps.total}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
