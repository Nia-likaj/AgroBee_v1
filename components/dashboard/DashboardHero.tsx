"use client";

import { useMemo } from "react";

type DashboardHeroProps = {
  city: string;
  plantHealth: number; // 0-100
  humidity: number; // 0-100
  temperature: number; // °C
  wind: number; // km/h
  rain: number; // mm
  updatedAt: string; // e.g. "2026-01-08T01:30"
  cities?: string[];
  onCityChange?: (city: string) => void;
};

export default function DashboardHero({
  city,
  plantHealth,
  humidity,
  temperature,
  wind,
  rain,
  updatedAt,
  cities = ["Tiranë", "Durrës", "Vlorë", "Shkodër", "Elbasan", "Korçë"],
  onCityChange,
}: DashboardHeroProps) {
  const status = useMemo(() => {
    if (plantHealth >= 75) return { label: "Kushte shumë të mira", tone: "good" as const };
    if (plantHealth >= 50) return { label: "Kushte normale", tone: "ok" as const };
    return { label: "Rrezik / Jo optimale", tone: "bad" as const };
  }, [plantHealth]);

  const insights = useMemo(() => {
    const items: { icon: "calendar" | "drop" | "wind"; text: string }[] = [];
    if (rain >= 1) items.push({ icon: "calendar", text: "Kontrollo parashikimin 24h për reshje." });
    if (humidity >= 80) items.push({ icon: "drop", text: "Rregullo ujitjen sipas lagështisë." });
    if (wind >= 20) items.push({ icon: "wind", text: "Monitoro erën për dëmtime në kulturë." });

    if (items.length === 0) {
      items.push({ icon: "calendar", text: "Kushtet janë stabile; kontrollo parashikimin 24h." });
      items.push({ icon: "drop", text: "Mbaj rutinë të moderuar ujitjeje." });
      items.push({ icon: "wind", text: "Era është e ulët; risk i vogël mekanik." });
    }

    return items.slice(0, 3);
  }, [rain, humidity, wind]);

  return (
    <section className="relative overflow-hidden rounded-[28px] border bg-white/30 shadow-sm backdrop-blur"
      style={{ borderColor: "rgba(0,0,0,0.06)" }}
    >
      {/* Background photo */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url("/images/mountains.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(1px)",
          transform: "scale(1.03)",
          opacity: 0.35,
        }}
      />
      {/* Soft overlays */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 520px at 15% 15%, rgba(139,195,74,0.28), transparent 55%)," +
            "radial-gradient(900px 520px at 90% 25%, rgba(31,122,58,0.18), transparent 55%)," +
            "linear-gradient(180deg, rgba(246,251,246,0.88) 0%, rgba(246,251,246,0.70) 100%)",
        }}
      />

      <div className="relative p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-xs text-black/55">Dashboard</div>
            <h1 className="mt-1 text-2xl font-semibold text-[color:var(--primary-dark)]">
              Monitorim në kohë reale
            </h1>
            <p className="mt-2 text-sm text-black/60">
              Të dhënat vijnë nga Open-Meteo; "Plant Health" është një skorë e llogaritur.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border bg-white/70 px-3 py-1 text-xs font-semibold text-[color:var(--primary-dark)]"
              style={{ borderColor: "rgba(0,0,0,0.08)" }}
            >
              Live
            </span>

            <div className="relative">
              <select
                value={city}
                onChange={(e) => onCityChange?.(e.target.value)}
                className="h-9 rounded-xl border bg-white/70 pl-3 pr-9 text-sm font-semibold text-[color:var(--primary-dark)] outline-none"
                style={{ borderColor: "rgba(0,0,0,0.08)" }}
              >
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-black/60">
                ▾
              </span>
            </div>
          </div>
        </div>

        {/* Content grid */}
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {/* LEFT: Monitorim + insights */}
          <div className="lg:col-span-2 rounded-3xl border bg-white/70 p-6 shadow-sm"
            style={{ borderColor: "rgba(0,0,0,0.06)" }}
          >
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-xs text-black/55">Kushtet aktuale • {city}</div>
                <div className="mt-1 text-xl font-semibold text-[color:var(--primary-dark)]">
                  {status.label}
                </div>
              </div>
              <span className="inline-flex w-fit items-center rounded-full border bg-white/75 px-3 py-1 text-xs text-black/70"
                style={{ borderColor: "rgba(0,0,0,0.08)" }}
              >
                Përditësuar: {updatedAt}
              </span>
            </div>

            {/* Mini KPI row */}
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <MiniKpi label="Plant Health" value={`${plantHealth}%`} pct={plantHealth} />
              <MiniKpi label="Lagështia" value={`${humidity}%`} pct={humidity} />
              <MiniKpi
                label="Temperatura"
                value={`${temperature}°C`}
                pct={tempToPct(temperature)}
              />
            </div>

            {/* Insights box */}
            <div className="mt-4 rounded-2xl border bg-white/75 p-4"
              style={{ borderColor: "rgba(0,0,0,0.06)" }}
            >
              <div className="text-xs font-semibold text-black/60">Insights</div>
              <div className="mt-2 text-sm text-black/70">
                Reshje: <span className="font-semibold">{rain} mm</span> • Erë:{" "}
                <span className="font-semibold">{wind} km/h</span>
              </div>

              <ul className="mt-4 space-y-2">
                {insights.map((it, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-black/70">
                    <span className="mt-0.5">{renderIcon(it.icon)}</span>
                    <span>{it.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT: icon cards */}
          <div className="grid gap-4">
            <RightCard
              title="Plant Health"
              value={`${plantHealth}%`}
              pct={plantHealth}
              icon="leaf"
            />
            <RightCard
              title="Temperatura"
              value={`${temperature}°C`}
              pct={tempToPct(temperature)}
              icon="thermo"
            />
            <RightCard title="Era" value={`${wind} km/h`} pct={windToPct(wind)} icon="wind" />
            <RightCard title="Reshje" value={`${rain} mm`} pct={rainToPct(rain)} icon="rain" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Helpers ---------- */

function MiniKpi({ label, value, pct }: { label: string; value: string; pct: number }) {
  return (
    <div className="rounded-2xl border bg-white/75 p-4"
      style={{ borderColor: "rgba(0,0,0,0.06)" }}
    >
      <div className="text-xs text-black/55">{label}</div>
      <div className="mt-1 text-lg font-semibold text-[color:var(--primary-dark)]">{value}</div>
      <Bar pct={pct} />
    </div>
  );
}

function RightCard({
  title,
  value,
  pct,
  icon,
}: {
  title: string;
  value: string;
  pct: number;
  icon: "leaf" | "thermo" | "wind" | "rain";
}) {
  return (
    <div className="rounded-3xl border bg-white/75 p-5 shadow-sm"
      style={{ borderColor: "rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border bg-white/80"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
        >
          {renderIcon(icon)}
        </span>
        <div>
          <div className="text-xs text-black/55">{title}</div>
          <div className="mt-0.5 text-xl font-semibold text-[color:var(--primary-dark)]">{value}</div>
        </div>
      </div>
      <div className="mt-4">
        <Bar pct={pct} />
      </div>
    </div>
  );
}

function Bar({ pct }: { pct: number }) {
  const safe = Math.max(0, Math.min(100, pct));
  return (
    <div className="mt-3 h-2 w-full overflow-hidden rounded-full border bg-white/70"
      style={{ borderColor: "rgba(0,0,0,0.06)" }}
    >
      <div
        className="h-full rounded-full"
        style={{ width: `${safe}%`, background: "linear-gradient(90deg, var(--accent), var(--primary))" }}
      />
    </div>
  );
}

/* ---------- Percent converters (simple, tweak later) ---------- */
function tempToPct(t: number) {
  // map -5..35C -> 0..100
  return Math.max(0, Math.min(100, ((t + 5) / 40) * 100));
}
function windToPct(w: number) {
  // 0..30 km/h -> 0..100
  return Math.max(0, Math.min(100, (w / 30) * 100));
}
function rainToPct(r: number) {
  // 0..5 mm -> 0..100
  return Math.max(0, Math.min(100, (r / 5) * 100));
}

/* ---------- Icons (inline SVG) ---------- */
function renderIcon(kind: string) {
  const common = { width: 18, height: 18, stroke: "rgba(31,122,58,0.95)", strokeWidth: 2, fill: "none" as const };
  switch (kind) {
    case "leaf":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M20 4c-6.5 0-11 4.5-11 11 0 3.5 2 5 5 5 6.5 0 11-4.5 11-11 0-3.5-2-5-5-5Z" opacity="0.2" fill="rgba(139,195,74,0.35)" stroke="none"/>
          <path d="M20 4c-6.5 0-11 4.5-11 11 0 3.5 2 5 5 5 6.5 0 11-4.5 11-11 0-3.5-2-5-5-5Z" />
          <path d="M9 15c3-2 6-5 9-9" />
        </svg>
      );
    case "thermo":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M10 14.5V5a2 2 0 1 1 4 0v9.5a4 4 0 1 1-4 0Z" />
          <path d="M12 7v8" opacity="0.35" />
        </svg>
      );
    case "wind":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M3 8h10a2 2 0 1 0-2-2" />
          <path d="M3 12h14a2 2 0 1 1-2 2" />
          <path d="M3 16h8" />
        </svg>
      );
    case "rain":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M7 15a4 4 0 0 1 0-8 5 5 0 0 1 9.7 1.5A3.5 3.5 0 1 1 18 15H7Z" />
          <path d="M9 18l-1 2" />
          <path d="M13 18l-1 2" />
          <path d="M17 18l-1 2" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M7 3v3M17 3v3" />
          <path d="M4 7h16" />
          <path d="M5 6h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />
          <path d="M8 11h4" opacity="0.35" />
        </svg>
      );
    case "drop":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M12 2s6 7 6 12a6 6 0 0 1-12 0c0-5 6-12 6-12Z" />
        </svg>
      );
    default:
      return (
        <svg {...common} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}
