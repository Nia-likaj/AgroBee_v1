"use client";

import { ReactNode, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RequireAuth } from "@/components/auth/guards";
import { useAuth } from "@/components/auth/AuthProvider";

type NavItem = {
  label: string;
  href: string;
  roles: Array<"user" | "farmer" | "agronomist" | "specialist" | "admin">;
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, signOutUser } = useAuth();
  const pathname = usePathname();

  const nav = useMemo<NavItem[]>(
    () => [
      {
        label: "Përmbledhje",
        href: "/dashboard",
        roles: ["user", "farmer", "agronomist", "specialist", "admin"],
      },
      {
        label: "Feed & Favorites",
        href: "/dashboard/feed",
        roles: ["user", "farmer", "agronomist", "specialist", "admin"],
      },
      {
        label: "Shkruaj artikull",
        href: "/dashboard/blog/new",
        roles: ["agronomist"],
      },
      {
        label: "Shto link burimi",
        href: "/dashboard/blog/sources",
        roles: ["admin"],
      },
      {
        label: "Ferma ime",
        href: "/dashboard/farm",
        roles: ["farmer"],
      },
      {
        label: "Përdorues & Role",
        href: "/dashboard/admin/users",
        roles: ["admin"],
      },
    ],
    []
  );

  const visibleNav = nav.filter((i) =>
    user ? i.roles.includes(user.role) : false
  );

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: "Admin",
      agronomist: "Agronom",
      farmer: "Fermer",
      specialist: "Specialist",
      user: "User",
    };
    return labels[role] || role;
  };

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gradient-to-b from-green-50/30 to-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            {/* Sidebar */}
            <aside className="glass rounded-3xl p-4 h-fit lg:sticky lg:top-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-black/55">Paneli</div>
                  <div className="text-base font-semibold text-[color:var(--primary-dark)]">
                    {user?.displayName ?? user?.email ?? "Përdorues"}
                  </div>
                </div>
                <span className="rounded-full border bg-white/70 px-3 py-1 text-xs font-semibold text-[color:var(--primary-dark)]">
                  {getRoleLabel(user?.role ?? "user")}
                </span>
              </div>

              <nav className="mt-4 space-y-1">
                {visibleNav.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={[
                        "block rounded-2xl px-3 py-2 text-sm transition",
                        active
                          ? "border bg-white/80 font-semibold text-[color:var(--primary-dark)]"
                          : "text-black/70 hover:bg-white/60",
                      ].join(" ")}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <button
                onClick={() => signOutUser()}
                className="mt-5 w-full rounded-2xl border bg-white/70 px-3 py-2 text-sm font-semibold text-[color:var(--primary-dark)] hover:bg-white transition"
              >
                Dil
              </button>
            </aside>

            {/* Main content */}
            <main className="glass rounded-3xl p-6">{children}</main>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
