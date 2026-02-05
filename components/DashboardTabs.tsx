"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/favorites", label: "Favorites" },
  { href: "/dashboard/feed", label: "Feed" },
];

export default function DashboardTabs() {
  const pathname = usePathname();

  return (
    <div className="w-full">
      <div
        className="inline-flex w-full flex-wrap items-center gap-2 rounded-2xl border bg-white/55 p-2 shadow-sm backdrop-blur"
        style={{ borderColor: "rgba(0,0,0,0.06)" }}
      >
        {tabs.map((t) => {
          const active = pathname === t.href;

          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={active ? "page" : undefined}
              className={[
                "relative inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent",
                active ? "text-white shadow-sm" : "text-black/70 hover:text-black",
              ].join(" ")}
              style={{
                background: active
                  ? "linear-gradient(90deg, var(--primary), var(--accent))"
                  : "rgba(255,255,255,0.35)",
                border: active ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(0,0,0,0.06)",
              }}
            >
              {t.label}

              {/* active indicator */}
              {active && (
                <span
                  className="absolute -bottom-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full"
                  style={{ background: "rgba(255,255,255,0.85)" }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
