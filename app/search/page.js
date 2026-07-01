import PosterCard from "../components/PosterCard";
import { search } from "../../lib/tmdb";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }) {
  const q = searchParams?.q || "";
  const results = await search(q);

  return (
    <div className="pt-24 px-6 md:px-12 min-h-screen">
      <h1 className="text-2xl font-bold mb-1">
        {q ? <>Results for “{q}”</> : "Search"}
      </h1>
      <p className="text-nova-gray mb-6">{results.length} title{results.length !== 1 ? "s" : ""}</p>

      {results.length === 0 ? (
        <p className="text-nova-gray">No matches. Try another title.</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {results.map((item) => (
            <PosterCard key={`${item.id}-${item.media_type || ""}`} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
