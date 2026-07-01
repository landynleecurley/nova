import { MOCK } from "./mockData";

const API_KEY = process.env.TMDB_API_KEY;
const BASE = "https://api.themoviedb.org/3";

export const IMG = "https://image.tmdb.org/t/p/w500";
export const IMG_ORIGINAL = "https://image.tmdb.org/t/p/original";

export const hasApiKey = Boolean(API_KEY);

async function tmdb(path, params = {}) {
  const url = new URL(BASE + path);
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("language", "en-US");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`TMDB ${res.status}`);
  return res.json();
}

// Homepage rows. Each row = { title, query }
export const ROWS = [
  { key: "trending", title: "Trending Now", path: "/trending/all/week" },
  { key: "originals", title: "Nova Originals", path: "/discover/tv", params: { with_networks: 453 } },
  { key: "top_movies", title: "Top Rated Movies", path: "/movie/top_rated" },
  { key: "action", title: "Action & Adventure", path: "/discover/movie", params: { with_genres: 28 } },
  { key: "comedy", title: "Comedies", path: "/discover/movie", params: { with_genres: 35 } },
  { key: "horror", title: "Scary Movies", path: "/discover/movie", params: { with_genres: 27 } },
  { key: "romance", title: "Romance", path: "/discover/movie", params: { with_genres: 10749 } },
  { key: "documentaries", title: "Documentaries", path: "/discover/movie", params: { with_genres: 99 } },
];

export async function getRows() {
  if (!hasApiKey) return MOCK.rows;
  try {
    const rows = await Promise.all(
      ROWS.map(async (row) => {
        const data = await tmdb(row.path, row.params || {});
        return { key: row.key, title: row.title, items: (data.results || []).filter((i) => i.poster_path || i.backdrop_path) };
      })
    );
    return rows;
  } catch (e) {
    return MOCK.rows;
  }
}

export async function getHero() {
  if (!hasApiKey) return MOCK.hero;
  try {
    const data = await tmdb("/trending/all/week");
    const withBackdrop = (data.results || []).filter((i) => i.backdrop_path && i.overview);
    return withBackdrop[Math.floor(withBackdrop.length / 3)] || withBackdrop[0];
  } catch (e) {
    return MOCK.hero;
  }
}

export async function getDetails(mediaType, id) {
  if (!hasApiKey) return MOCK.details(mediaType, id);
  try {
    const data = await tmdb(`/${mediaType}/${id}`, { append_to_response: "credits,videos,similar" });
    return data;
  } catch (e) {
    return MOCK.details(mediaType, id);
  }
}

export async function search(query) {
  if (!query) return [];
  if (!hasApiKey) return MOCK.search(query);
  try {
    const data = await tmdb("/search/multi", { query, include_adult: "false" });
    return (data.results || []).filter((i) => (i.media_type === "movie" || i.media_type === "tv") && (i.poster_path || i.backdrop_path));
  } catch (e) {
    return MOCK.search(query);
  }
}

export async function getByGenre(mediaType, genreId) {
  const type = mediaType === "tv" ? "tv" : "movie";
  if (!hasApiKey) {
    const all = MOCK.rows.flatMap((r) => r.items);
    return all.filter((i) => (i.media_type || (i.title ? "movie" : "tv")) === type);
  }
  try {
    const data = await tmdb(`/discover/${type}`, {
      with_genres: genreId,
      sort_by: "popularity.desc",
      include_adult: "false",
    });
    return (data.results || [])
      .filter((i) => i.poster_path || i.backdrop_path)
      .map((i) => ({ ...i, media_type: type }));
  } catch (e) {
    return [];
  }
}

export function titleOf(item) {
  return item.title || item.name || "Untitled";
}

export function yearOf(item) {
  const d = item.release_date || item.first_air_date;
  return d ? d.slice(0, 4) : "";
}

export function mediaTypeOf(item) {
  return item.media_type || (item.title ? "movie" : "tv");
}

// TMDB genre id → name (combined movie + TV) for items that only carry genre_ids.
const GENRE_MAP = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance",
  878: "Science Fiction", 10770: "TV Movie", 53: "Thriller", 10752: "War",
  37: "Western", 10759: "Action & Adventure", 10762: "Kids", 10763: "News",
  10764: "Reality", 10765: "Sci-Fi & Fantasy", 10766: "Soap", 10767: "Talk",
  10768: "War & Politics",
};

// Primary genre name from full genres, mock genre, or genre_ids.
export function genreOf(item) {
  if (item.genres?.length) return item.genres[0].name;
  if (item.genre) return item.genre;
  const id = item.genre_ids?.[0];
  return id ? GENRE_MAP[id] || null : null;
}
