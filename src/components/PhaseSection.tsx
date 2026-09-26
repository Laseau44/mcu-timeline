import type { MCUEntry } from '../data/mcu';
import { PHASE_NAMES, PHASE_SAGA } from '../data/mcu';
import { useStore, getPhaseStats } from '../store/store';
import EntryCard from './EntryCard';

interface Props {
    phase: number;
    entries: MCUEntry[];
}

export default function PhaseSection({ phase, entries }: Props) {
    const collapsed = useStore((s) => s.collapsedPhases[phase] ?? false);
    const togglePhase = useStore((s) => s.togglePhase);
    const statuses = useStore((s) => s.statuses);
    const ps = getPhaseStats(phase, statuses);

    const wPct = ps.total > 0 ? (ps.watched / ps.total) * 100 : 0;
    const iPct = ps.total > 0 ? (ps.watching / ps.total) * 100 : 0;

    const phaseClass = phase <= 3 ? 'phase-infinity' : phase <= 5 ? 'phase-multiverse' : 'phase-secret';

    if (entries.length === 0) return null;

    return (
        <section className={`phase-section ${phaseClass}`}>
            <button className="phase-header" onClick={() => togglePhase(phase)}>
                <div className="phase-header-left">
                    <span className={`phase-chevron ${collapsed ? '' : 'open'}`}>▶</span>
                    <div>
                        <h2 className="phase-title">{PHASE_NAMES[phase]}</h2>
                        <span className="phase-saga">{PHASE_SAGA[phase]}</span>
                    </div>
                </div>
                <div className="phase-header-right">
                    <div className="phase-progress-mini">
                        <div className="progress-track mini">
                            <div className="progress-fill watched" style={{ width: `${wPct}%` }} />
                            <div className="progress-fill watching" style={{ width: `${iPct}%`, left: `${wPct}%` }} />
                        </div>
                    </div>
                    <span className="phase-count">{ps.watched}/{ps.total}</span>
                </div>
            </button>

            {!collapsed && (
                <div className="phase-entries">
                    {entries.map((entry) => (
                        <EntryCard key={entry.id} entry={entry} />
                    ))}
                </div>
            )}
        </section>
    );
}
