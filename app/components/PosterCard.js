"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { IMG, titleOf, yearOf, mediaTypeOf } from "../../lib/tmdb";
import { IconPlay } from "./icons";

const GRADIENTS = [
  ["#1ce783", "#0b6b3f"],
  ["#7c3aed", "#312e81"],
  ["#ef4444", "#7f1d1d"],
  ["#f59e0b", "#7c2d12"],
  ["#3b82f6", "#1e3a8a"],
  ["#ec4899", "#831843"],
  ["#06b6d4", "#164e63"],
  ["#a3e635", "#3f6212"],
];

function gradientFor(id) {
  const [a, b] = GRADIENTS[Math.abs(Number(id)) % GRADIENTS.length];
  return `linear-gradient(145deg, ${a}, ${b})`;
}

export default function PosterCard({ item, wide = false }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const imgRef = useRef(null);
  const type = mediaTypeOf(item);
  const href = `/${type}/${item.id}`;
  const img = item.poster_path
    ? `${IMG}${item.poster_path}`
    : item.backdrop_path
    ? `${IMG}${item.backdrop_path}`
    : null;

  // If the image finished loading before React attached onLoad (cache / SSR
  // hydration), the load event is missed — reconcile from the DOM on mount.
  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    if (el.complete) {
      if (el.naturalWidth > 0) setLoaded(true);
      else setErrored(true);
    }
  }, [img]);

  return (
    <Link
      href={href}
      className={`group relative shrink-0 ${
        wide ? "w-64 aspect-video" : "w-40 md:w-44 aspect-[2/3]"
      } rounded-lg overflow-hidden bg-nova-panel ring-1 ring-white/10 transition-all duration-200 hover:ring-2 hover:ring-nova-pink hover:scale-[1.05] hover:z-10`}
    >
      {img && !errored ? (
        <>
          {!loaded && <div className="absolute inset-0 animate-pulse bg-white/5" />}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={img}
            alt={titleOf(item)}
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
            className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
            loading="lazy"
          />
        </>
      ) : (
        <div className="w-full h-full flex flex-col justify-end p-3" style={{ background: gradientFor(item.id) }}>
          <span className="text-lg font-black leading-tight drop-shadow">{titleOf(item)}</span>
          <span className="text-xs text-white/80 mt-1 uppercase tracking-wide">{type}</span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
        <p className="font-bold text-sm leading-tight line-clamp-2">{titleOf(item)}</p>
        <div className="flex items-center gap-2 text-xs text-white/70 mt-1">
          {yearOf(item) && <span>{yearOf(item)}</span>}
          {item.vote_average ? <span className="text-nova-pink">★ {item.vote_average.toFixed(1)}</span> : null}
        </div>
        <span className="mt-2 inline-flex w-fit items-center gap-1.5 bg-nova-pink text-nova-dark text-xs font-bold px-2.5 py-1 rounded">
          <IconPlay className="w-3 h-3" /> Play
        </span>
      </div>
    </Link>
  );
}
