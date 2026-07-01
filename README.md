# ✦ Nova

**Endless stories, one place.**

Nova is a full-featured streaming-service web app built with **Next.js 14 (App Router)**,
**React**, and **Tailwind CSS** — featuring a signature pink→violet gradient identity,
a cinematic hero, horizontally scrolling category rows, live search, detail pages,
customizable profile avatars, and a browse experience. Powered by the TMDB API
(with a built-in demo mode).

## Features

- ✦ **Original Nova brand** — pink→violet gradient wordmark, dark cinematic theme
- 🎬 **Hero banner** with a rotating featured title and gradient Play CTA
- ↔️ **Scrollable category rows** (Trending, Nova Originals, Top Rated, Action, Comedy, Horror, Romance, Documentaries)
- 🔎 **Live search** — instant dropdown with poster thumbnails as you type, plus a full results page
- 📄 **Detail pages** for movies and TV with cast, genres, a working "My Stuff" watchlist, and "You May Also Like"
- 🗂️ **Browse** pages filtered by TV / Movies
- 👤 **Account page** with a Netflix-style avatar picker — choose from 12 avatars, synced live across the app
- 📱 Responsive layout with a sticky translucent nav
- ⚡ **Demo mode** — runs with rich sample data when no API key is set

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

### Real content (optional)

Nova runs in **demo mode** out of the box. For real posters and titles:

1. Get a free API key at https://www.themoviedb.org/settings/api
2. Copy `.env.local.example` to `.env.local` and set `TMDB_API_KEY`
3. Restart the dev server

## Tech stack

- Next.js 14 (App Router, Server Components)
- React 18
- Tailwind CSS 3
- TMDB API · DiceBear avatars

## Notes

Nova is an original demo/portfolio project. Movie & show metadata provided by
[TMDB](https://www.themoviedb.org/). Avatar art from [DiceBear](https://www.dicebear.com/) (open-licensed).
