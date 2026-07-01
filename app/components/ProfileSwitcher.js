"use client";

import { useEffect, useState } from "react";
import { useProfiles, MAX_PROFILES } from "./useProfiles";
import { AVATARS } from "../../lib/avatars";
import { IconPlus, IconChevronLeft, IconCheck } from "./icons";

// Self-managed modal. Open it from anywhere:
//   window.dispatchEvent(new Event("nova:switcher"))      -> switch list
//   window.dispatchEvent(new Event("nova:switcher-add"))  -> add form
export default function ProfileSwitcher() {
  const { profiles, active, canAdd, switchProfile, addProfile } = useProfiles();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("list");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0].src);

  useEffect(() => {
    const openList = () => {
      setMode("list");
      setOpen(true);
    };
    const openAdd = () => {
      setName("");
      setAvatar(AVATARS[0].src);
      setMode("add");
      setOpen(true);
    };
    window.addEventListener("nova:switcher", openList);
    window.addEventListener("nova:switcher-add", openAdd);
    return () => {
      window.removeEventListener("nova:switcher", openList);
      window.removeEventListener("nova:switcher-add", openAdd);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!open) return null;

  const close = () => {
    setOpen(false);
    setMode("list");
  };

  const create = () => {
    if (!name.trim()) return;
    addProfile({ name, avatar });
    setMode("list");
  };

  return (
    <div
      className="fixed inset-0 z-[80] bg-nova-dark/95 backdrop-blur-sm grid place-items-center p-6 overflow-y-auto"
      onClick={close}
    >
      <div className="text-center w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        {mode === "list" ? (
          <>
            <h2 className="text-3xl md:text-4xl font-black mb-8">Who&rsquo;s watching?</h2>
            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
              {profiles.map((p) => {
                const isActive = p.id === active.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      switchProfile(p.id);
                      close();
                    }}
                    className="flex flex-col items-center gap-3 group"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className={`w-24 h-24 md:w-32 md:h-32 rounded-lg ring-4 transition ${
                        isActive ? "ring-nova-pink" : "ring-transparent group-hover:ring-white"
                      }`}
                    />
                    <span
                      className={`text-lg ${
                        isActive ? "text-white font-semibold" : "text-nova-gray group-hover:text-white"
                      }`}
                    >
                      {p.name}
                    </span>
                  </button>
                );
              })}

              {canAdd && (
                <button
                  onClick={() => {
                    setName("");
                    setAvatar(AVATARS[0].src);
                    setMode("add");
                  }}
                  className="flex flex-col items-center gap-3 group"
                >
                  <span className="w-24 h-24 md:w-32 md:h-32 rounded-lg grid place-items-center text-white/40 border-2 border-dashed border-white/20 group-hover:border-white/50 group-hover:text-white/70 transition">
                    <IconPlus className="w-10 h-10" />
                  </span>
                  <span className="text-lg text-nova-gray group-hover:text-white">Add Profile</span>
                </button>
              )}
            </div>

            <button
              onClick={close}
              className="mt-10 border border-white/30 text-white/80 hover:text-white hover:border-white rounded-full px-8 py-2.5 font-semibold transition-colors"
            >
              Done
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setMode("list")}
              className="flex items-center gap-1 text-white/70 hover:text-white mb-4 mx-auto font-semibold"
            >
              <IconChevronLeft className="w-5 h-5" /> Back
            </button>
            <h2 className="text-3xl font-black mb-6">Add Profile</h2>

            <div className="flex flex-col items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={avatar} alt="New profile" className="w-24 h-24 rounded-lg ring-4 ring-nova-pink" />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && create()}
                maxLength={20}
                placeholder="Profile name"
                autoFocus
                className="bg-white/10 border border-white/20 focus:border-nova-pink/60 rounded-lg px-4 py-2.5 text-center outline-none w-64"
              />
            </div>

            <p className="text-sm text-nova-gray mt-6 mb-3">Choose an icon</p>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 max-w-md mx-auto">
              {AVATARS.map((a) => {
                const sel = avatar === a.src;
                return (
                  <button key={a.id} onClick={() => setAvatar(a.src)} className="relative" title={a.label}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={a.src}
                      alt={a.label}
                      className={`w-full aspect-square rounded-lg ring-2 transition ${
                        sel ? "ring-nova-pink scale-105" : "ring-transparent hover:ring-white"
                      }`}
                    />
                    {sel && (
                      <span className="absolute -top-1 -right-1 bg-nova-pink rounded-full p-0.5">
                        <IconCheck className="w-3 h-3 text-white" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                onClick={create}
                disabled={!name.trim()}
                className="nova-gradient text-white font-bold px-8 py-2.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                Create Profile
              </button>
              <button
                onClick={() => setMode("list")}
                className="border border-white/30 text-white/80 hover:text-white hover:border-white rounded-full px-6 py-2.5 font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
