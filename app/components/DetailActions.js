"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { IconPlay, IconPlus, IconCheck } from "./icons";

const KEY = "nova_my_stuff";

function readList() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export default function DetailActions({ id, title, mediaType }) {
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState("");

  const uid = `${mediaType}:${id}`;

  useEffect(() => {
    setSaved(readList().some((x) => x.uid === uid));
  }, [uid]);

  function toggle() {
    const list = readList();
    let next;
    if (list.some((x) => x.uid === uid)) {
      next = list.filter((x) => x.uid !== uid);
      setSaved(false);
      setToast("Removed from My Stuff");
    } else {
      next = [...list, { uid, id, title, mediaType }];
      setSaved(true);
      setToast("Added to My Stuff");
    }
    localStorage.setItem(KEY, JSON.stringify(next));
    setTimeout(() => setToast(""), 2200);
  }

  return (
    <div className="relative flex items-center gap-3">
      <Link
        href={`/watch/${mediaType}/${id}`}
        aria-label={`Play ${title}`}
        title="Play"
        className="w-12 h-12 md:w-14 md:h-14 rounded-full nova-gradient hover:opacity-90 text-white grid place-items-center transition-opacity shadow-lg"
      >
        <IconPlay className="w-6 h-6 md:w-7 md:h-7" />
      </Link>
      <button
        onClick={toggle}
        aria-label={saved ? "Remove from My Stuff" : "Add to My Stuff"}
        title={saved ? "In My Stuff" : "Add to My Stuff"}
        className={`w-12 h-12 md:w-14 md:h-14 rounded-full grid place-items-center transition-colors ${
          saved
            ? "bg-nova-pink/20 text-nova-pink ring-2 ring-nova-pink"
            : "bg-white/15 hover:bg-white/25 backdrop-blur text-white"
        }`}
      >
        {saved ? <IconCheck className="w-6 h-6" /> : <IconPlus className="w-6 h-6" />}
      </button>

      {toast && (
        <span className="absolute left-0 top-full mt-2 text-sm bg-nova-panel border border-white/15 rounded-full px-4 py-1.5 text-white/90 whitespace-nowrap z-10">
          {toast}
        </span>
      )}
    </div>
  );
}
