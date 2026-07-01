import PosterCard from "../components/PosterCard";
import { getRows } from "../../lib/tmdb";

export const revalidate = 3600;

export default async function BrowsePage({ searchParams }) {
  const type = searchParams?.type; // "movie" | "tv" | undefined
  const rows = await getRows();

  // Flatten, de-dupe, and optionally filter by media type.
  const seen = new Set();
  const items = [];
  for (const row of rows) {
    for (const item of row.items) {
      const mt = item.media_type || (item.title ? "movie" : "tv");
      if (type && mt !== type) continue;
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      items.push(item);
    }
  }

  const label = type === "tv" ? "TV Shows" : type === "movie" ? "Movies" : "Browse All";

  return (
    <div className="pt-24 px-6 md:px-12 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">{label}</h1>
      <div className="flex flex-wrap gap-4">
        {items.map((item) => (
          <PosterCard key={`${item.id}-${item.media_type || ""}`} item={item} />
        ))}
      </div>
    </div>
  );
}
