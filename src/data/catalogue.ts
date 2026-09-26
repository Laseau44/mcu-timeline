import { mcuEntries, PHASE_NAMES } from './mcu';
import type { MCUType } from './mcu';
import { multiverseEntries, MULTIVERSE_GROUPS } from './multiverse';
import artworkData from './artwork.json';

export type Collection = 'mcu' | 'multivers';
export interface Artwork {
  poster: string;
  backdrop: string | null;
  title: string;
  runtime: string | null;
  source: string;
  tmdb: number;
  mediaType: 'movie' | 'tv';
}
export interface Movie {
  id: string;
  title: string;
  year: number;
  type: MCUType;
  group: string;
  order: number;
  description: string;
  narrativeYear?: string;
  upcoming: boolean;
  artwork?: Artwork;
}
export interface Chapter { id: string; name: string; subtitle: string; }
const artwork = artworkData as Record<string, Artwork>;
export const collections: Record<Collection, { movies: Movie[]; chapters: Chapter[] }> = {
  mcu: {
    movies: mcuEntries.map(entry => ({
      id: entry.id, title: entry.title, year: Number(entry.release_date.slice(0, 4)),
      type: entry.type, group: String(entry.phase), order: entry.number,
      description: entry.description, narrativeYear: entry.narrative_year,
      upcoming: entry.upcoming, artwork: entry.upcoming ? { ...artwork[entry.id], runtime: null } : artwork[entry.id],
    })),
    chapters: [1, 2, 3, 4, 5, 6].map(phase => ({
      id: String(phase), name: PHASE_NAMES[phase].split(' — ')[1],
      subtitle: `Phase ${phase} · ${phase <= 3 ? 'La saga de l’Infini' : 'La saga du Multivers'}`,
    })),
  },
  multivers: {
    movies: MULTIVERSE_GROUPS.flatMap(group => multiverseEntries.filter(entry => entry.group === group.id))
      .map((entry, index) => ({
        id: entry.id, title: entry.title, year: entry.year, type: 'film', group: entry.group,
        order: index + 1, description: entry.note, upcoming: false, artwork: artwork[entry.id],
      })),
    chapters: MULTIVERSE_GROUPS.map(group => ({
      id: group.id,
      name: ({ xmen: 'X-Men & Wolverine', deadpool: 'Deadpool', blade: 'Blade', 'spider-raimi': 'Spider-Man · Sam Raimi', 'spider-webb': 'The Amazing Spider-Man', spiderverse: 'Spider-Verse' } as Record<string, string>)[group.id],
      subtitle: group.intro,
    })),
  },
};
export const allMovies = [...collections.mcu.movies, ...collections.multivers.movies];
export const typeLabels = { film: 'Film', series: 'Série', special: 'Spécial' };
export const statusLabels = { unwatched: 'À voir', watching: 'En cours', watched: 'Vu ensemble' };
export const normalizeSearch = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr').replace(/[^a-z0-9]+/g, ' ').trim();
