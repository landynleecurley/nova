import Link from "next/link";
import Row from "./Row";
import DetailActions from "./DetailActions";
import { IMG_ORIGINAL, titleOf, yearOf } from "../../lib/tmdb";

export default function DetailView({ item, mediaType }) {
  if (!item) {
    return (
      <div className="pt-32 px-12 text-center text-nova-gray">
        Not found. <Link href="/" className="text-nova-pink underline">Go home</Link>
      </div>
    );
  }

  const bg = item.backdrop_path ? `${IMG_ORIGINAL}${item.backdrop_path}` : null;
  const cast = item.credits?.cast?.slice(0, 6) || [];
  const genres = item.genres || [];
  const similar = item.similar?.results || [];
  const runtime = item.runtime
    ? `${Math.floor(item.runtime / 60)}h ${item.runtime % 60}m`
    : item.number_of_seasons
    ? `${item.number_of_seasons} Season${item.number_of_seasons > 1 ? "s" : ""}`
    : "";

  return (
    <div className="pb-10">
      <section className="relative h-[65vh] min-h-[420px] max-w-full overflow-hidden">
        {bg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bg} alt={titleOf(item)} className="absolute inset-0 w-full h-full object-cover object-center" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-nova-pink/40 via-nova-panel to-nova-dark" />
        )}
        <div className="absolute inset-0 hero-fade" />

        <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-12 pb-10 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-black mb-4 drop-shadow-lg">{titleOf(item)}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-white/80 mb-5">
            {yearOf(item) && <span>{yearOf(item)}</span>}
            {runtime && <span>{runtime}</span>}
            <span className="uppercase border border-white/40 px-1.5 rounded text-xs">{mediaType}</span>
            {genres[0] && (
              <Link
                href={`/browse?genre=${genres[0].id}&type=${mediaType}&name=${encodeURIComponent(genres[0].name)}`}
                className="uppercase border border-nova-pink/60 text-nova-pink px-1.5 rounded text-xs hover:bg-nova-pink hover:text-nova-dark transition-colors"
              >
                {genres[0].name}
              </Link>
            )}
            {item.vote_average ? <span className="text-nova-pink">★ {item.vote_average.toFixed(1)}</span> : null}
          </div>
          <DetailActions id={item.id} title={titleOf(item)} mediaType={mediaType} />
        </div>
      </section>

      <div className="relative z-10 px-6 md:px-12 mt-6 grid md:grid-cols-3 gap-8 mb-10">
        <div className="md:col-span-2">
          <p className="text-white/85 text-lg leading-relaxed">{item.overview}</p>
        </div>
        <div className="text-sm space-y-3">
          {genres.length > 0 && (
            <div>
              <span className="text-nova-gray">Genres: </span>
              {genres.map((g) => g.name).join(", ")}
            </div>
          )}
          {cast.length > 0 && (
            <div>
              <span className="text-nova-gray">Cast: </span>
              {cast.map((c) => c.name).join(", ")}
            </div>
          )}
        </div>
      </div>

      {similar.length > 0 && <Row title="You May Also Like" items={similar} />}
    </div>
  );
}
