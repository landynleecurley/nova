import { NextResponse } from "next/server";
import { search, titleOf, yearOf, mediaTypeOf, IMG } from "../../../lib/tmdb";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const q = request.nextUrl.searchParams.get("q") || "";
  if (!q.trim()) return NextResponse.json({ results: [] });

  const raw = await search(q.trim());
  const results = raw.slice(0, 8).map((item) => ({
    id: item.id,
    title: titleOf(item),
    year: yearOf(item),
    type: mediaTypeOf(item),
    rating: item.vote_average ? Number(item.vote_average.toFixed(1)) : null,
    poster: item.poster_path
      ? `${IMG}${item.poster_path}`
      : item.backdrop_path
      ? `${IMG}${item.backdrop_path}`
      : null,
  }));

  return NextResponse.json({ results });
}
