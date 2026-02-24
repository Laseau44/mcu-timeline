import { useState, useRef, useEffect } from 'react';
import type { WatchStatus } from '../data/mcu';
import { useStore } from '../store/store';

interface Props {
    entryId: string;
}

const OPTIONS: { value: WatchStatus; label: string; icon: string }[] = [
    { value: 'unwatched', label: 'Pas vu', icon: '⬜' },
    { value: 'watching', label: 'En cours', icon: '▶️' },
    { value: 'watched', label: 'Vu', icon: '✅' },
];

export default function StatusDropdown({ entryId }: Props) {
    const status = useStore((s) => s.statuses[entryId] || 'unwatched');
    const setStatus = useStore((s) => s.setStatus);
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        // Use 'click' instead of 'mousedown' so option onClick fires first
        document.addEventListener('click', handler);
        return () => document.removeEventListener('click', handler);
    }, [open]);

    const current = OPTIONS.find((o) => o.value === status)!;

    return (
        <div className="status-dropdown" ref={ref}>
            <button
                className={`status-btn status-${status}`}
                onClick={(e) => {
                    e.stopPropagation();
                    setOpen(!open);
                }}
            >
                <span>{current.icon}</span>
                <span>{current.label}</span>
                <span className="chevron">{open ? '▲' : '▼'}</span>
            </button>
            {open && (
                <div className="status-menu">
                    {OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            className={`status-option status-opt-${opt.value}${opt.value === status ? ' selected' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setStatus(entryId, opt.value);
                                setOpen(false);
                            }}
                        >
                            <span>{opt.icon}</span>
                            <span>{opt.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
