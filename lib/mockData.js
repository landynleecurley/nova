// Fallback data used when no TMDB_API_KEY is set, so the clone runs standalone.
// Posters render as generated gradient tiles (no external images required).

let _id = 1000;
function make(title, mediaType, genre, overview) {
  const id = _id++;
  return {
    id,
    _mock: true,
    media_type: mediaType,
    [mediaType === "movie" ? "title" : "name"]: title,
    [mediaType === "movie" ? "release_date" : "first_air_date"]:
      `${1990 + (id % 34)}-0${1 + (id % 9)}-15`,
    vote_average: 6 + (id % 40) / 10,
    genre,
    overview,
    poster_path: null,
    backdrop_path: null,
  };
}

const OVERVIEW =
  "A gripping story that keeps you on the edge of your seat, streaming now. Follow unforgettable characters through twists, heart, and high stakes.";

function row(title, key, names, mediaType = "movie") {
  return {
    key,
    title,
    items: names.map((n) => make(n, mediaType, title, OVERVIEW)),
  };
}

const rows = [
  row("Trending Now", "trending", [
    "Midnight Signal", "The Last Harbor", "Neon City", "Paper Kingdom",
    "Cold Static", "Wildfire", "The Understudy", "Glass Horizon",
    "Ember & Ash", "Static Bloom",
  ], "tv"),
  row("Nova Originals", "originals", [
    "The Bear Necessities", "Only Rivals", "Dopesick Days", "The Handmaiden's Tale",
    "Reservation Road", "Little Fires", "Pam & Tommy Show", "The Dropout Club",
    "Nine Perfect Nights", "Castle Rockers",
  ], "tv"),
  row("Top Rated Movies", "top_movies", [
    "The Silent Order", "Rain on Cedar", "A Quiet Fortune", "Verdict",
    "The Long Goodbye", "Northern Light", "Echoes of Us", "The Inheritance",
    "Solstice", "After the Storm",
  ]),
  row("Action & Adventure", "action", [
    "Ironclad", "Velocity", "The Last Extraction", "Rogue Protocol",
    "Blacksite", "Firewall", "Overdrive", "Kill Switch",
    "Deadzone", "Nightfall Ops",
  ]),
  row("Comedies", "comedy", [
    "Office Hours", "The Roommate Situation", "Best Man Down", "Splitsville",
    "Awkward Family Photo", "The Intern Games", "Road Trip Redux", "Two Left Feet",
    "Meet the Neighbors", "Group Chat",
  ]),
  row("Scary Movies", "horror", [
    "The Hollow House", "Whisper", "Basement", "The Feeding",
    "Grave Shift", "Static", "The Cabin Below", "Nightlight",
    "The Attic", "Don't Look Down",
  ]),
  row("Romance", "romance", [
    "Letters to Nowhere", "Summer of Maybe", "The Wedding Plan", "Slow Dance",
    "One More Weekend", "Postcards", "The Long Way Home", "Second Chances",
    "Paris in April", "Golden Hour",
  ]),
  row("Documentaries", "documentaries", [
    "The Deep", "Built to Last", "Wild Frontier", "The Money Machine",
    "Ocean Blue", "Rise & Fall", "Uncharted Earth", "The Innovators",
    "Frozen Planet", "City Lights",
  ]),
];

const hero = {
  ...rows[1].items[3],
  overview:
    "Set in 17th-century Korea, a story of loyalty, betrayal, and the price of ambition. Now streaming — start watching the acclaimed original series today.",
};

const all = rows.flatMap((r) => r.items);

function details(mediaType, id) {
  const found = all.find((i) => String(i.id) === String(id)) || hero;
  return {
    ...found,
    runtime: 118,
    number_of_seasons: 3,
    genres: [{ id: 1, name: found.genre || "Drama" }, { id: 2, name: "Thriller" }],
    credits: {
      cast: ["Jordan Reyes", "Alex Monroe", "Sam Carter", "Riley Quinn", "Casey Lane"].map((name, i) => ({
        id: i,
        name,
        character: ["Lead", "Detective", "The Rival", "Best Friend", "The Boss"][i],
      })),
    },
    videos: { results: [] },
    similar: { results: all.filter((i) => i.id !== found.id).slice(0, 12) },
  };
}

function searchMock(query) {
  const q = query.toLowerCase();
  return all.filter((i) => (i.title || i.name).toLowerCase().includes(q));
}

export const MOCK = { rows, hero, details, search: searchMock };
