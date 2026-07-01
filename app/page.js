import Hero from "./components/Hero";
import Row from "./components/Row";
import { getHero, getRows, hasApiKey } from "../lib/tmdb";

export const revalidate = 3600;

export default async function HomePage() {
  const [hero, rows] = await Promise.all([getHero(), getRows()]);

  return (
    <div className="pb-10">
      <Hero item={hero} />

      {!hasApiKey && (
        <div className="mx-6 md:mx-12 -mt-8 mb-8 relative z-10 rounded-lg border border-nova-pink/30 bg-nova-panel/80 px-4 py-3 text-sm text-nova-gray">
          Running in <span className="text-nova-pink font-semibold">demo mode</span> with sample
          data. Add a <code className="text-white">TMDB_API_KEY</code> to <code className="text-white">.env.local</code> for real posters and titles.
        </div>
      )}

      <div className="-mt-4 md:-mt-6 relative z-10">
        {rows.map((row, i) => (
          <Row
            key={row.key}
            title={row.title}
            items={row.items}
            wide={i === 0}
            original={row.key === "originals"}
          />
        ))}
      </div>
    </div>
  );
}
