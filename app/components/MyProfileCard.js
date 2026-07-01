"use client";

import { useProfile } from "./useProfile";

// Active-profile card that mirrors the current name + avatar selection and
// opens the avatar picker (owned by AvatarPicker) when clicked.
export default function MyProfileCard() {
  const [profile] = useProfile();

  return (
    <button
      onClick={() => window.dispatchEvent(new Event("nova:open-picker"))}
      className="flex flex-col items-center gap-2 group"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={profile.avatar}
        alt={profile.name}
        className="w-20 h-20 rounded-lg ring-2 ring-nova-pink/60 group-hover:ring-nova-pink transition"
      />
      <span className="text-sm text-white group-hover:text-nova-pink">{profile.name}</span>
    </button>
  );
}
