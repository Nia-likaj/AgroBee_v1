"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { AL_CITIES, type City, type WeatherState, calcPlantHealth, fetchWeather } from "@/lib/weather";

function calcGrowthRate(ph: number, h: number, t: number) {
  const a = ph * 0.55;
  const b = (100 - Math.abs(h - 65)) * 0.3;
  const c = (100 - Math.max(0, Math.abs(t - 20) * 2.5)) * 0.15;
  return Math.max(0, Math.min(100, Math.round(a + b + c)));
}

/** Stable weekly bars seeded by city + rate — change when real data changes */
function weeklyBars(seed: number, base: number): number[] {
  let s = (seed | 0) >>> 0;
  return Array.from({ length: 7 }, () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const delta = (s % 21) - 10;
    return Math.max(18, Math.min(80, Math.round(base * 0.82 + delta)));
  });
}

/* ─── Component ───────────────────────────────────────────────── */
export default function HeroDashboardPreview() {
  const locale = useLocale();
  const [city, setCity]             = useState<City>(AL_CITIES[0]);
  const [data, setData]             = useState<WeatherState | null>(null);
  const [loading, setLoading]       = useState(true);
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef                   = useRef<HTMLDivElement>(null);

  /* Fetch live weather ------------------------------------------ */
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const result = await fetchWeather(city.lat, city.lon);
      if (!cancelled) {
        if (result) setData(result);
        setLoading(false);
      }
    }

    load();
    const id = setInterval(load, 5 * 60 * 1000);
    return () => { cancelled = true; clearInterval(id); };
  }, [city.lat, city.lon]);

  /* Close picker on outside click ------------------------------ */
  useEffect(() => {
    if (!pickerOpen) return;
    function onDown(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node))
        setPickerOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [pickerOpen]);

  /* Derived ---------------------------------------------------- */
  const ph = useMemo(() =>
    data ? calcPlantHealth(data.temperatureC, data.humidityPct, data.precipitationMm, data.windKmh) : 0,
    [data]);

  const gr = useMemo(() =>
    data ? calcGrowthRate(ph, data.humidityPct, data.temperatureC) : 0,
    [ph, data]);

  const bars = useMemo(() =>
    weeklyBars(Math.round(city.lat * 100 + gr * 13), gr),
    [city.lat, gr]);

  const statusLabel  = ph >= 75 ? "Kushte shumë të mira" : ph >= 50 ? "Kushte normale" : "Rrezik / Jo optimale";
  const updatedLabel = data?.updatedAt ? (data.updatedAt.slice(11, 16) || "Tani") : "...";

  return (
    <div className="glass rounded-3xl p-5 shadow-sm">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="text-xs text-black/55">Field • {city.name}</div>
          <div className="mt-0.5 text-lg font-semibold text-[color:var(--primary-dark)]">
            {loading ? <span className="opacity-40">Duke ngarkuar…</span> : statusLabel}
          </div>
          <div className="text-xs text-black/55">
            Përditësuar: {loading ? "…" : updatedLabel}
          </div>
        </div>
        <span className="shrink-0 rounded-full border bg-white/70 px-3 py-1 text-xs font-semibold text-[color:var(--primary-dark)]">
          Live
        </span>
      </div>

      {/* ── City selector ── */}
      <div className="relative mt-3" ref={pickerRef}>
        <button
          onClick={() => setPickerOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-xl border bg-white/70 px-3 py-2 text-sm font-semibold text-[color:var(--primary-dark)] transition-colors hover:bg-white/95 active:scale-[0.98]"
          style={{ borderColor: "rgba(0,0,0,0.1)" }}
        >
          <span className="flex items-center gap-2">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
            {city.name}
          </span>
          <svg
            width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            className={`transition-transform duration-200 ${pickerOpen ? "rotate-180" : ""}`}
          >
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>

        {pickerOpen && (
          <div
            className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 max-h-56 overflow-y-auto rounded-2xl border bg-white shadow-xl"
            style={{ borderColor: "rgba(0,0,0,0.08)" }}
          >
            {AL_CITIES.map((c) => (
              <button
                key={c.name}
                onClick={() => { setCity(c); setPickerOpen(false); }}
                className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors hover:bg-slate-50 ${
                  c.name === city.name
                    ? "bg-slate-50 font-semibold text-[color:var(--primary-dark)]"
                    : "font-medium text-black/70"
                }`}
              >
                {c.name === city.name && (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 12l5 5L20 7"/>
                  </svg>
                )}
                <span className={c.name === city.name ? "" : "pl-[19px]"}>{c.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2-col: plant health + humidity */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <MetricBar title="Plant health" value={`${ph}%`}                          pct={ph}                     loading={loading} />
        <MetricBar title="Humidity"     value={data ? `${data.humidityPct}%` : "—"} pct={data?.humidityPct ?? 0} loading={loading} />
      </div>

      {/* 3-col: temperature + wind + rain */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <MetricBar
          title="Temperature"
          value={data ? `${data.temperatureC.toFixed(1)}°C` : "—"}
          pct={data ? Math.max(0, Math.min(100, ((data.temperatureC + 5) / 40) * 100)) : 0}
          loading={loading}
        />
        <MetricBar
          title="Wind"
          value={data ? `${Math.round(data.windKmh)} km/h` : "—"}
          pct={data ? Math.min(100, (data.windKmh / 30) * 100) : 0}
          loading={loading}
        />
        <MetricBar
          title="Rain"
          value={data ? `${data.precipitationMm.toFixed(1)} mm` : "—"}
          pct={data ? Math.min(100, (data.precipitationMm / 5) * 100) : 0}
          loading={loading}
        />
      </div>

      {/* Growth rate + weekly bars */}
      <div className="mt-4 glass rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-[color:var(--primary-dark)]">Growth rate</div>
            <div className="mt-1 text-2xl font-semibold text-[color:var(--primary-dark)]">
              {loading ? "—" : `${gr}%`}
            </div>
          </div>
          <div className="text-xs text-black/55">Week</div>
        </div>

        <div className="mt-3 h-2 w-full overflow-hidden rounded-full border bg-white/70">
          <div
            className="h-full rounded-full transition-[width] duration-700"
            style={{ width: `${gr}%`, background: "linear-gradient(90deg, var(--accent), var(--primary))" }}
          />
        </div>

        <div className="mt-3 grid grid-cols-7 gap-2 items-end">
          {bars.map((h, i) => (
            <div key={i} className="w-full overflow-hidden rounded-lg border bg-white/70">
              <div
                className="rounded-lg transition-[height] duration-700"
                style={{ height: `${h}px`, background: "linear-gradient(180deg, var(--accent), var(--primary))" }}
              />
            </div>
          ))}
        </div>

        <div className="mt-3 text-xs text-black/55">
          Preview synced with real stats (changes with refresh/city).
        </div>
      </div>

      {/* Dashboard link button */}
      <Link
        href={`/${locale}/dashboard`}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border py-2.5 text-sm font-semibold text-[color:var(--primary-dark)] transition-all hover:bg-white/60 hover:shadow-sm"
        style={{ borderColor: "rgba(0,0,0,0.08)", background: "rgba(255,255,255,0.35)" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <rect x="3" y="3" width="7" height="7" rx="1.5"/>
          <rect x="14" y="3" width="7" height="7" rx="1.5"/>
          <rect x="3" y="14" width="7" height="7" rx="1.5"/>
          <rect x="14" y="14" width="7" height="7" rx="1.5"/>
        </svg>
        Hap Dashboard-in
      </Link>
    </div>
  );
}

/* ─── MetricBar ──────────────────────────────────────────────── */
function MetricBar({ title, value, pct, loading }: { title: string; value: string; pct: number; loading?: boolean }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="text-xs text-black/55">{title}</div>
      <div className="mt-1 text-lg font-semibold text-[color:var(--primary-dark)]">
        {loading ? <span className="opacity-40">—</span> : value}
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full border bg-white/70">
        <div
          className="h-full rounded-full transition-[width] duration-700"
          style={{ width: `${Math.max(0, Math.min(100, pct))}%`, background: "linear-gradient(90deg, var(--accent), var(--primary))" }}
        />
      </div>
    </div>
  );
}
