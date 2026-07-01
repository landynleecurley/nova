import Link from "next/link";
import { IMG_ORIGINAL, titleOf, yearOf, mediaTypeOf, genreOf } from "../../lib/tmdb";
import { IconPlay } from "./icons";

export default function Hero({ item }) {
  if (!item) return null;
  const type = mediaTypeOf(item);
  const bg = item.backdrop_path ? `${IMG_ORIGINAL}${item.backdrop_path}` : null;

  return (
    <section className="relative h-[70vh] min-h-[460px] w-full max-w-full overflow-hidden">
      {bg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={bg} alt={titleOf(item)} className="absolute inset-0 w-full h-full object-cover object-center" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-nova-pink/40 via-nova-panel to-nova-dark" />
      )}
      <div className="absolute inset-0 hero-fade" />

      <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-12 pb-16 max-w-3xl">
        <span className="text-nova-pink font-black text-sm tracking-widest uppercase mb-3">
          Featured
        </span>
        <h1 className="text-4xl md:text-6xl font-black leading-none mb-4 drop-shadow-lg">
          {titleOf(item)}
        </h1>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/80 mb-4">
          {yearOf(item) && <span>{yearOf(item)}</span>}
          <span className="uppercase border border-white/40 px-1.5 rounded text-xs">{type}</span>
          {genreOf(item) && (
            <span className="uppercase border border-nova-pink/60 text-nova-pink px-1.5 rounded text-xs">
              {genreOf(item)}
            </span>
          )}
          {item.vote_average ? <span className="text-nova-pink">★ {item.vote_average.toFixed(1)}</span> : null}
        </div>
        <p className="text-white/85 text-sm md:text-lg line-clamp-3 mb-6">{item.overview}</p>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/watch/${type}/${item.id}`}
            className="nova-gradient hover:opacity-90 text-white font-bold px-7 py-3 rounded-full transition-opacity flex items-center gap-2"
          >
            <IconPlay className="w-5 h-5" /> Play
          </Link>
          <Link
            href={`/${type}/${item.id}`}
            className="bg-white/15 hover:bg-white/25 backdrop-blur text-white font-bold px-7 py-3 rounded-full transition-colors"
          >
            More Info
          </Link>
        </div>
      </div>
    </section>
  );
}
