"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../components/auth/AuthProvider";

const LS_FAV_KEY = "agrobee_demo_favorites_v1";

function readFavorites(): string[] {
  try {
    const raw = localStorage.getItem(LS_FAV_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeFavorites(ids: string[]) {
  localStorage.setItem(LS_FAV_KEY, JSON.stringify(ids));
}

export default function FavoriteButton({ farmId }: { farmId: string }) {
  const { isAuthenticated } = useAuth();
  const [favIds, setFavIds] = useState<string[]>([]);

  useEffect(() => {
    setFavIds(readFavorites());
  }, []);

  const isFav = useMemo(() => favIds.includes(farmId), [favIds, farmId]);

  const toggle = () => {
    if (!isAuthenticated) {
      // alert për hyrje/regjistrim u hoq
      return;
    }
    const next = isFav ? favIds.filter((id) => id !== farmId) : [...favIds, farmId];
    setFavIds(next);
    writeFavorites(next);
  };

  return (
    <button
      onClick={toggle}
      className="rounded-xl border bg-white/70 px-3 py-1.5 text-xs font-semibold hover:bg-white transition"
      title={isFav ? "Hiq nga favorites" : "Shto në favorites"}
      aria-label="Toggle favorite"
    >
      {isFav ? "♥" : "♡"}
    </button>
  );
}
