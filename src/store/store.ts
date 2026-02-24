import { create } from 'zustand';
import type { WatchStatus, MCUType } from '../data/mcu';
import { mcuEntries } from '../data/mcu';
import { supabase } from '../lib/supabaseClient';
import { getSessionId } from '../lib/session';

const LOCAL_KEY = 'mcu-timeline-statuses';

interface StoreState {
    // Watch statuses
    statuses: Record<string, WatchStatus>;
    setStatus: (entryId: string, status: WatchStatus) => void;
    loadStatuses: () => Promise<void>;
    resetAll: () => void;

    // Filters
    typeFilter: MCUType | 'all';
    statusFilter: WatchStatus | 'all';
    searchQuery: string;
    setTypeFilter: (t: MCUType | 'all') => void;
    setStatusFilter: (s: WatchStatus | 'all') => void;
    setSearchQuery: (q: string) => void;

    // Collapsibles
    collapsedPhases: Record<number, boolean>;
    togglePhase: (phase: number) => void;

    // Loading
    isLoading: boolean;
}

function saveLocal(statuses: Record<string, WatchStatus>) {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(statuses));
}

function loadLocal(): Record<string, WatchStatus> {
    try {
        const raw = localStorage.getItem(LOCAL_KEY);
        if (raw) return JSON.parse(raw);
    } catch { /* ignore */ }
    return {};
}

async function syncToSupabase(entryId: string, status: WatchStatus) {
    if (!supabase) return;
    const sessionId = getSessionId();
    try {
        await supabase.from('watch_status').upsert(
            {
                session_id: sessionId,
                entry_id: entryId,
                status,
                updated_at: new Date().toISOString(),
            },
            { onConflict: 'session_id,entry_id' }
        );
    } catch (err) {
        console.warn('Supabase sync failed:', err);
    }
}

async function loadFromSupabase(): Promise<Record<string, WatchStatus> | null> {
    if (!supabase) return null;
    const sessionId = getSessionId();
    try {
        const { data, error } = await supabase
            .from('watch_status')
            .select('entry_id, status')
            .eq('session_id', sessionId);
        if (error) throw error;
        const result: Record<string, WatchStatus> = {};
        for (const row of data ?? []) {
            result[row.entry_id] = row.status as WatchStatus;
        }
        return result;
    } catch (err) {
        console.warn('Supabase load failed:', err);
        return null;
    }
}

export const useStore = create<StoreState>((set, get) => ({
    statuses: {},
    isLoading: true,

    setStatus: (entryId, status) => {
        const newStatuses = { ...get().statuses, [entryId]: status };
        set({ statuses: newStatuses });
        saveLocal(newStatuses);
        syncToSupabase(entryId, status);
    },

    loadStatuses: async () => {
        set({ isLoading: true });
        // Try Supabase first, fall back to local
        const remote = await loadFromSupabase();
        if (remote && Object.keys(remote).length > 0) {
            set({ statuses: remote, isLoading: false });
            saveLocal(remote);
        } else {
            set({ statuses: loadLocal(), isLoading: false });
        }
    },

    resetAll: () => {
        const empty: Record<string, WatchStatus> = {};
        set({ statuses: empty });
        saveLocal(empty);
        // Also clear supabase
        if (supabase) {
            const sessionId = getSessionId();
            supabase.from('watch_status').delete().eq('session_id', sessionId).then();
        }
    },

    typeFilter: 'all',
    statusFilter: 'all',
    searchQuery: '',
    setTypeFilter: (t) => set({ typeFilter: t }),
    setStatusFilter: (s) => set({ statusFilter: s }),
    setSearchQuery: (q) => set({ searchQuery: q }),

    collapsedPhases: {},
    togglePhase: (phase) =>
        set((s) => ({
            collapsedPhases: {
                ...s.collapsedPhases,
                [phase]: !s.collapsedPhases[phase],
            },
        })),
}));

// Derived helpers
export function getFilteredEntries(state: StoreState) {
    return mcuEntries.filter((entry) => {
        if (state.typeFilter !== 'all' && entry.type !== state.typeFilter) return false;
        if (state.statusFilter !== 'all') {
            const s = state.statuses[entry.id] || 'unwatched';
            if (s !== state.statusFilter) return false;
        }
        if (state.searchQuery) {
            const q = state.searchQuery.toLowerCase();
            if (!entry.title.toLowerCase().includes(q)) return false;
        }
        return true;
    });
}

export function getStats(statuses: Record<string, WatchStatus>) {
    const total = mcuEntries.length;
    const films = mcuEntries.filter((e) => e.type === 'film').length;
    const series = mcuEntries.filter((e) => e.type === 'series').length;
    const specials = mcuEntries.filter((e) => e.type === 'special').length;

    let watched = 0;
    let watching = 0;
    for (const entry of mcuEntries) {
        const s = statuses[entry.id] || 'unwatched';
        if (s === 'watched') watched++;
        else if (s === 'watching') watching++;
    }

    return { total, films, series, specials, watched, watching, unwatched: total - watched - watching };
}

export function getPhaseStats(phase: number, statuses: Record<string, WatchStatus>) {
    const entries = mcuEntries.filter((e) => e.phase === phase);
    const total = entries.length;
    let watched = 0;
    let watching = 0;
    for (const entry of entries) {
        const s = statuses[entry.id] || 'unwatched';
        if (s === 'watched') watched++;
        else if (s === 'watching') watching++;
    }
    return { total, watched, watching };
}
