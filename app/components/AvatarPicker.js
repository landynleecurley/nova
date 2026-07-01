"use client";

import { useEffect, useState } from "react";
import { AVATARS } from "../../lib/avatars";
import { useProfile } from "./useProfile";

export default function AvatarPicker({ size = "lg" }) {
  const [profile, setProfile] = useProfile();
  const avatar = profile.avatar;
  const [open, setOpen] = useState(false);

  // Let other components (e.g. a profile card) open this picker.
  useEffect(() => {
    const openIt = () => setOpen(true);
    window.addEventListener("nova:open-picker", openIt);
    return () => window.removeEventListener("nova:open-picker", openIt);
  }, []);

  // Lock body scroll while the modal is open.
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = prev);
    }
  }, [open]);

  const dim = size === "lg" ? "w-16 h-16" : "w-9 h-9";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative group rounded-lg"
        aria-label="Change avatar"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={avatar} alt="Your avatar" className={`${dim} rounded-lg`} />
        <span className="absolute inset-0 rounded-lg bg-black/50 opacity-0 group-hover:opacity-100 transition grid place-items-center">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20h9" strokeLinecap="round" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm grid place-items-center p-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-nova-panel rounded-2xl border border-white/10 shadow-2xl w-full max-w-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-black">Choose your avatar</h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="w-8 h-8 grid place-items-center rounded-full hover:bg-white/10 text-white/70 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
              {AVATARS.map((a) => {
                const active = avatar === a.src;
                return (
                  <button
                    key={a.id}
                    onClick={() => {
                      setProfile({ avatar: a.src });
                      setOpen(false);
                    }}
                    className="flex flex-col items-center gap-1.5 group"
                    title={a.label}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={a.src}
                      alt={a.label}
                      className={`w-full aspect-square rounded-lg ring-2 transition ${
                        active ? "ring-nova-pink scale-105" : "ring-transparent group-hover:ring-white"
                      }`}
                    />
                    <span className={`text-xs ${active ? "text-nova-pink" : "text-nova-gray group-hover:text-white"}`}>
                      {a.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
