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
