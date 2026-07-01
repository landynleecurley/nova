"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { IconPlay } from "./icons";

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
    <div className="relative flex flex-wrap items-center gap-3">
      <Link
        href={`/watch/${mediaType}/${id}`}
        className="nova-gradient hover:opacity-90 text-white font-bold px-8 py-3 rounded-full transition-opacity flex items-center gap-2"
      >
        <IconPlay className="w-5 h-5" /> Play
      </Link>
      <button
        onClick={toggle}
        className={`font-bold px-6 py-3 rounded-full transition-colors ${
          saved
            ? "bg-nova-pink/20 text-nova-pink ring-1 ring-nova-pink"
            : "bg-white/15 hover:bg-white/25 backdrop-blur text-white"
        }`}
      >
        {saved ? "✓ In My Stuff" : "+ My Stuff"}
      </button>

      {toast && (
        <span className="absolute left-0 -bottom-9 text-sm bg-nova-panel border border-white/15 rounded-full px-4 py-1.5 text-white/90 whitespace-nowrap">
          {toast}
        </span>
      )}
    </div>
  );
}
