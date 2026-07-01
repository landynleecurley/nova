"use client";

import { useRef } from "react";
import PosterCard from "./PosterCard";

export default function Row({ title, items, wide = false }) {
  const ref = useRef(null);

  function scroll(dir) {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  }

  if (!items || items.length === 0) return null;

  return (
    <section className="group/row relative mb-8">
      <h2 className="px-6 md:px-12 mb-3 text-lg md:text-xl font-bold">{title}</h2>

      <button
        onClick={() => scroll(-1)}
        aria-label="Scroll left"
        className="hidden md:grid place-items-center absolute left-0 top-[calc(50%+8px)] -translate-y-1/2 z-20 h-24 w-12 bg-gradient-to-r from-black/80 to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity"
      >
        <span className="text-3xl">‹</span>
      </button>

      <div ref={ref} className="no-scrollbar flex gap-3 overflow-x-auto overflow-y-hidden px-6 md:px-12 py-6 scroll-px-12">
        {items.map((item) => (
          <PosterCard key={`${item.id}-${item.media_type || ""}`} item={item} wide={wide} />
        ))}
      </div>

      <button
        onClick={() => scroll(1)}
        aria-label="Scroll right"
        className="hidden md:grid place-items-center absolute right-0 top-[calc(50%+8px)] -translate-y-1/2 z-20 h-24 w-12 bg-gradient-to-l from-black/80 to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity"
      >
        <span className="text-3xl">›</span>
      </button>
    </section>
  );
}
