"use client";

import { useEffect, useState } from "react";
import { DEFAULT_AVATAR, AVATAR_KEY } from "../../lib/avatars";

// Reads the saved avatar and stays in sync across every component/tab.
export function useAvatar() {
  const [avatar, setAvatarState] = useState(DEFAULT_AVATAR);

  useEffect(() => {
    const stored = typeof window !== "undefined" && localStorage.getItem(AVATAR_KEY);
    if (stored) setAvatarState(stored);

    const onChange = (e) => setAvatarState(e.detail || localStorage.getItem(AVATAR_KEY) || DEFAULT_AVATAR);
    const onStorage = (e) => {
      if (e.key === AVATAR_KEY) setAvatarState(e.newValue || DEFAULT_AVATAR);
    };
    window.addEventListener("nova:avatar", onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("nova:avatar", onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const setAvatar = (src) => {
    localStorage.setItem(AVATAR_KEY, src);
    window.dispatchEvent(new CustomEvent("nova:avatar", { detail: src }));
  };

  return [avatar, setAvatar];
}
