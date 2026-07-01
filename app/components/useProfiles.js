"use client";

import { useEffect, useState } from "react";
import { DEFAULT_AVATAR } from "../../lib/avatars";

const KEY = "nova_profiles_v1";
export const MAX_PROFILES = 5;

const DEFAULT_STATE = {
  profiles: [{ id: "owner", name: "Landyn", avatar: DEFAULT_AVATAR, owner: true }],
  activeId: "owner",
};

function read() {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const v = JSON.parse(localStorage.getItem(KEY));
    if (v && Array.isArray(v.profiles) && v.profiles.length) return v;
  } catch {
    /* ignore */
  }
  return DEFAULT_STATE;
}

function write(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent("nova:profiles", { detail: state }));
}

// Household profile store: a list of profiles (max 5) with one active. The
// first profile is the head of household (owner) and cannot be removed.
export function useProfiles() {
  const [state, setState] = useState(DEFAULT_STATE);

  useEffect(() => {
    setState(read());
    const onChange = (e) => setState(e.detail || read());
    const onStorage = (e) => {
      if (e.key === KEY) setState(read());
    };
    window.addEventListener("nova:profiles", onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("nova:profiles", onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const active = state.profiles.find((p) => p.id === state.activeId) || state.profiles[0];

  const addProfile = ({ name, avatar }) => {
    const cur = read();
    if (cur.profiles.length >= MAX_PROFILES) return null;
    const id = `p_${Date.now()}`;
    write({
      profiles: [...cur.profiles, { id, name: name.trim() || "New Profile", avatar, owner: false }],
      activeId: cur.activeId,
    });
    return id;
  };

  const removeProfile = (id) => {
    const cur = read();
    const target = cur.profiles.find((p) => p.id === id);
    if (!target || target.owner) return; // head of household is protected
    const profiles = cur.profiles.filter((p) => p.id !== id);
    const activeId =
      cur.activeId === id ? profiles.find((p) => p.owner)?.id || profiles[0].id : cur.activeId;
    write({ profiles, activeId });
  };

  const switchProfile = (id) => {
    const cur = read();
    if (cur.profiles.some((p) => p.id === id)) write({ ...cur, activeId: id });
  };

  const updateActive = (patch) => {
    const cur = read();
    write({
      ...cur,
      profiles: cur.profiles.map((p) => (p.id === cur.activeId ? { ...p, ...patch } : p)),
    });
  };

  return {
    profiles: state.profiles,
    activeId: state.activeId,
    active,
    canAdd: state.profiles.length < MAX_PROFILES,
    addProfile,
    removeProfile,
    switchProfile,
    updateActive,
  };
}

// Backward-compatible accessor for just the active profile.
export function useProfile() {
  const { active, updateActive } = useProfiles();
  return [active, updateActive];
}
