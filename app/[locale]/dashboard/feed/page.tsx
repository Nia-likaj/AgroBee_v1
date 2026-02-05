"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import DashboardTabs from "@/components/DashboardTabs";
import FeedItem from "@/components/FeedItem";
import { demoPosts } from "@/constants/demoData";

export default function FeedPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/login");
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return <div className="mx-auto max-w-6xl px-4 py-10">Loading...</div>;
  if (!isAuthenticated) return null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <DashboardTabs />
      <h1 className="mt-6 text-2xl font-semibold text-[color:var(--primary-dark)]">Feed (Demo)</h1>
      <p className="mt-2 text-sm text-black/70">Artikuj nga fermerë/agronomë/specialistë.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {demoPosts.map((p) => (
          <FeedItem key={p.id} post={p} />
        ))}
      </div>
    </main>
  );
}
