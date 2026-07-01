"use client";

import { useProfile } from "./useProfile";

export default function ProfileName({ className }) {
  const [profile] = useProfile();
  return <span className={className}>{profile.name}</span>;
}
