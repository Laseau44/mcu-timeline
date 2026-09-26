const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY as string | undefined;

interface TMDBResult {
    poster_path: string | null;
}

const posterCache = new Map<string, string | null>();

export async function fetchPosterPath(
    tmdbId: number,
    tmdbType: 'movie' | 'tv'
): Promise<string | null> {
    const cacheKey = `${tmdbType}-${tmdbId}`;
    if (posterCache.has(cacheKey)) {
        return posterCache.get(cacheKey)!;
    }

    if (!TMDB_API_KEY) {
        posterCache.set(cacheKey, null);
        return null;
    }

    try {
        const res = await fetch(
            `https://api.themoviedb.org/3/${tmdbType}/${tmdbId}?api_key=${TMDB_API_KEY}&language=fr-FR`
        );
        if (!res.ok) {
            posterCache.set(cacheKey, null);
            return null;
        }
        const data: TMDBResult = await res.json();
        const path = data.poster_path ?? null;
        posterCache.set(cacheKey, path);
        return path;
    } catch {
        posterCache.set(cacheKey, null);
        return null;
    }
}

export function getPosterUrl(posterPath: string, size: 'w200' | 'w500' = 'w200'): string {
    return `https://image.tmdb.org/t/p/${size}/${posterPath}`;
}
