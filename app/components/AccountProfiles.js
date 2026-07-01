"use client";

import { useProfiles } from "./useProfiles";
import { IconPlus, IconTrash, IconCheck } from "./icons";

// Profiles management for the account page.
// - Head of household ("owner") sees a Manage Profiles grid + Add Profile.
// - To remove a profile you must switch to it, then use "Remove user account".
export default function AccountProfiles() {
  const { profiles, active, canAdd, switchProfile, removeProfile } = useProfiles();
  const isOwner = active?.owner;

  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold mb-1">{isOwner ? "Manage Profiles" : "Profiles"}</h2>
      <p className="text-sm text-nova-gray mb-5">
        {profiles.length} of {5} profiles · You&rsquo;re watching as{" "}
        <span className="text-white font-semibold">{active?.name}</span>
      </p>

      <div className="flex flex-wrap gap-6 mb-6">
        {profiles.map((p) => {
          const isActive = p.id === active.id;
          return (
            <button
              key={p.id}
              onClick={() => switchProfile(p.id)}
              className="flex flex-col items-center gap-2 group w-24"
            >
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.avatar}
                  alt={p.name}
                  className={`w-20 h-20 rounded-lg ring-2 transition ${
                    isActive ? "ring-nova-pink" : "ring-transparent group-hover:ring-white"
                  }`}
                />
                {isActive && (
                  <span className="absolute -top-1.5 -right-1.5 bg-nova-pink rounded-full p-1">
                    <IconCheck className="w-3.5 h-3.5 text-white" />
                  </span>
                )}
              </div>
              <span
                className={`text-sm truncate max-w-full ${
                  isActive ? "text-white font-semibold" : "text-nova-gray group-hover:text-white"
                }`}
              >
                {p.name}
              </span>
              {p.owner && <span className="text-[10px] uppercase tracking-wide text-nova-pink">Main</span>}
            </button>
          );
        })}

        {isOwner && canAdd && (
          <button
            onClick={() => window.dispatchEvent(new Event("nova:switcher-add"))}
            className="flex flex-col items-center gap-2 group w-24"
          >
            <span className="w-20 h-20 rounded-lg grid place-items-center text-white/40 border-2 border-dashed border-white/20 group-hover:border-white/50 group-hover:text-white/70 transition">
              <IconPlus className="w-8 h-8" />
            </span>
            <span className="text-sm text-nova-gray group-hover:text-white">Add Profile</span>
          </button>
        )}
      </div>

      {isOwner ? (
        <p className="text-sm text-nova-gray">
          As the main account you can add profiles here (up to 5). To remove a profile, switch to it and
          choose <span className="text-white font-medium">Remove user account</span>.
        </p>
      ) : (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-semibold">Remove this profile</p>
            <p className="text-sm text-nova-gray">
              Permanently delete &ldquo;{active.name}&rdquo; and return to the main account.
            </p>
          </div>
          <button
            onClick={() => {
              if (confirm(`Remove the profile "${active.name}"? This can't be undone.`)) removeProfile(active.id);
            }}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-2.5 rounded-full transition-colors"
          >
            <IconTrash className="w-5 h-5" /> Remove user account
          </button>
        </div>
      )}
    </section>
  );
}
