"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import DashboardTabs from "@/components/DashboardTabs";
import { demoFarms } from "@/constants/demoData";

export default function FavoritesPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/login");
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return <div className="mx-auto max-w-6xl px-4 py-10">Loading...</div>;
  if (!isAuthenticated) return null;

  // demo: featured = favorites
  const favorites = demoFarms.filter((f) => f.isFeatured);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <DashboardTabs />
      <h1 className="mt-6 text-2xl font-semibold text-[color:var(--primary-dark)]">Favorites (Demo)</h1>
      <p className="mt-2 text-sm text-black/70">Këtu do jenë fermat që përdoruesi ka ruajtur.</p>

      <div className="mt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((farm) => (
            <div key={farm.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <h3 className="font-semibold text-lg text-[color:var(--primary-dark)]">{farm.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{farm.location.qarku}, {farm.location.qyteti}</p>
              <p className="text-sm text-gray-600 mt-2">{farm.tags?.join(", ")}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
