"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useTranslations, useLocale } from 'next-intl';
import { calcGrowthRateScore, buildWeeklyGrowthSeries } from "@/lib/growth";
import { useAuth } from "@/components/auth/AuthProvider";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const locale = useLocale();
  const t = useTranslations('home');
  const tFeatures = useTranslations('homeFeatures');
  const tSteps = useTranslations('homeSteps');
  const tPreview = useTranslations('homePreview');

  return (
    <main className="min-h-screen">
      {/* Background like the inspiration: green gradients + soft field vibe */}
      <div
        className="relative overflow-hidden"
        style={{
          background:
            "radial-gradient(1200px 600px at 20% 10%, rgba(139,195,74,0.35), transparent 55%)," +
            "radial-gradient(1000px 600px at 85% 25%, rgba(31,122,58,0.22), transparent 55%)," +
            "linear-gradient(180deg, rgba(246,251,246,1) 0%, rgba(221,238,219,1) 70%, rgba(246,251,246,1) 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'url("/images/mountains.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="absolute inset-0 bg-grid opacity-[0.35]" />

        {/* HERO */}
        <section className="relative mx-auto max-w-6xl px-4 pt-10 pb-10 md:pt-16">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border bg-white/65 px-3 py-1 text-xs font-medium text-black/70">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: "linear-gradient(90deg, var(--accent), var(--primary))" }}
                />
                {t('badge')}
              </div>

              <h1 className="mt-4 text-3xl font-semibold leading-tight text-(--primary-dark) md:text-5xl">
                {t('title')}{" "}
                <span className="underline decoration-(--accent) decoration-4 underline-offset-4">
                  {t('highlight')}
                </span>
                .
              </h1>

              <p className="mt-4 text-base leading-relaxed text-black/70 md:text-lg">
                {t('description')}
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/${locale}/register`}
                  className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold shadow-sm"
                  style={{
                    background: "linear-gradient(90deg, var(--primary), var(--accent))",
                    color: "#fff",
                  }}
                >
                  {t('cta')}
                </Link>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {/* Nëse /farms nuk ekziston akoma, hiqe këtë card */}
                <div
                  className="group glass rounded-2xl p-4 shadow-sm transition-all duration-300 cursor-default"
                  style={{
                    background: "linear-gradient(135deg, rgba(31,122,58,0.08), rgba(139,195,74,0.12))",
                  }}
                >
                  <div className="text-xs text-black/55 group-hover:text-black/70 transition-colors">{t('cardMarketplaceLabel')}</div>
                  <div className="text-sm font-semibold text-(--primary-dark) mt-1 group-hover:text-(--primary) transition-colors">
                    {t('cardMarketplaceValue')}
                  </div>
                </div>

                <div
                  className="group glass rounded-2xl p-4 shadow-sm transition-all duration-300 cursor-default"
                  style={{
                    background: "linear-gradient(135deg, rgba(31,122,58,0.08), rgba(139,195,74,0.12))",
                  }}
                >
                  <div className="text-xs text-black/55 group-hover:text-black/70 transition-colors">{t('cardUserAreaLabel')}</div>
                  <div className="text-sm font-semibold text-(--primary-dark) mt-1 group-hover:text-(--primary) transition-colors">
                    {t('cardUserAreaValue')}
                  </div>
                </div>
              </div>
            </div>

            {/* App-like preview cards (REAL preview) */}
            <div className="relative">
              <DashboardPreviewCard
                city={tPreview('city')}
                plantHealth={87}
                humidity={68}
                temperature={22}
                wind={12}
                rain={2.3}
                updatedAt={tPreview('updatedAt')}
              />

              <div className="absolute -top-4 -right-4 hidden md:block">
                <div className="glass rounded-2xl px-3 py-2 shadow-sm">
                  <div className="text-[10px] text-black/55">{t('expertsLabel')}</div>
                  <div className="text-xs font-semibold text-(--primary-dark)">{t('expertsValue')}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* FEATURES (wide background) */}
      <section className="relative py-20">
        {/* GREEN BACKGROUND – FULL WIDTH */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(1200px 600px at 15% 20%, rgba(139,195,74,0.22), transparent 55%)," +
              "radial-gradient(1000px 600px at 85% 10%, rgba(31,122,58,0.14), transparent 55%)," +
              "linear-gradient(135deg, rgba(31,122,58,0.05) 0%, rgba(139,195,74,0.12) 50%, rgba(31,122,58,0.05) 100%)",
          }}
        />

        {/* CONTENT – CENTERED */}
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-3xl bg-white/45 p-6 shadow-sm backdrop-blur md:p-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-semibold text-(--primary-dark) md:text-3xl">
                  {tFeatures('title')}
                </h2>
                <p className="mt-2 text-sm text-black/65 md:text-base">
                  {tFeatures('subtitle')}
                </p>
              </div>

              <Link
                href={`/${locale}/about`}
                className="inline-flex items-center rounded-xl border bg-white/60 px-4 py-2 text-sm font-semibold hover:bg-white transition"
              >
                {tFeatures('more')}
              </Link>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Feature title={tFeatures('item1Title')} desc={tFeatures('item1Desc')} />
              <Feature title={tFeatures('item2Title')} desc={tFeatures('item2Desc')} />
              <Feature title={tFeatures('item3Title')} desc={tFeatures('item3Desc')} />
              <Feature title={tFeatures('item4Title')} desc={tFeatures('item4Desc')} />
              <Feature title={tFeatures('item5Title')} desc={tFeatures('item5Desc')} />
              <Feature title={tFeatures('item6Title')} desc={tFeatures('item6Desc')} />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-6xl px-4 pb-16 mt-10">
        <div
          className="relative overflow-hidden rounded-3xl border bg-white/45 p-8 shadow-sm backdrop-blur md:p-12"
          style={{
            background:
              "radial-gradient(900px 500px at 15% 25%, rgba(139,195,74,0.16), transparent 55%)," +
              "radial-gradient(800px 500px at 85% 10%, rgba(31,122,58,0.10), transparent 55%)," +
              "linear-gradient(135deg, rgba(31,122,58,0.03) 0%, rgba(139,195,74,0.08) 50%, rgba(31,122,58,0.03) 100%)",
          }}
        >
          <div
            className="absolute inset-0 opacity-15 rounded-3xl -z-10"
            style={{
              backgroundImage: 'url("/images/mountains2.jpg")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />

          <h2 className="text-2xl font-semibold text-(--primary-dark) md:text-3xl">{tSteps('title')}</h2>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-black/65 md:text-base">
            {tSteps('subtitle')}
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Step n="01" title={tSteps('step1Title')} desc={tSteps('step1Desc')} />
            <Step n="02" title={tSteps('step2Title')} desc={tSteps('step2Desc')} />
            <Step n="03" title={tSteps('step3Title')} desc={tSteps('step3Desc')} />
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/${locale}/register`}
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-sm"
              style={{ background: "linear-gradient(90deg, var(--primary), var(--accent))" }}
            >
              {tSteps('cta')}
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      {!isAuthenticated && (
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div
            className="rounded-3xl p-8 text-white shadow-sm"
            style={{
              background: "linear-gradient(90deg, rgba(31,122,58,0.95), rgba(139,195,74,0.95))",
            }}
          >
            <div className="grid gap-6 md:grid-cols-2 md:items-center">
              <div>
                <h3 className="text-2xl font-semibold">{t('finalTitle')}</h3>
                <p className="mt-2 text-white/90">{t('finalSubtitle')}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
                <Link
                  href={`/${locale}/register`}
                  className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold shadow-sm"
                  style={{ color: "#0B2416" }}
                >
                  {t('finalCta')}
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}


/* ---------- UI helpers ---------- */
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="text-xs text-black/55">{label}</div>
      <div className="mt-1 text-sm font-semibold text-(--primary-dark)">{value}</div>
    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="group rounded-3xl border bg-white/65 p-6 shadow-sm backdrop-blur transition hover:bg-white hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="text-(--primary-dark) text-base font-semibold leading-snug">
          {title}
        </div>

        {/* mini accent */}
        <span
          className="mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ background: "linear-gradient(90deg, var(--accent), var(--primary))" }}
        />
      </div>

      <p className="mt-3 text-sm leading-relaxed text-black/65">
        {desc}
      </p>

      <div
        className="mt-5 h-1.5 w-16 rounded-full opacity-90 group-hover:w-20 transition-all"
        style={{ background: "linear-gradient(90deg, var(--accent), var(--primary))" }}
      />
    </div>
  );
}

function Step({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <div className="group rounded-3xl border bg-white/65 p-6 shadow-sm backdrop-blur transition hover:bg-white hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-(--primary)">{n}</div>
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: "linear-gradient(90deg, var(--accent), var(--primary))" }}
        />
      </div>

      <div className="mt-3 text-base font-semibold text-(--primary-dark)">{title}</div>
      <div className="mt-2 text-sm leading-relaxed text-black/65">{desc}</div>

      <div
        className="mt-5 h-1.5 w-14 rounded-full group-hover:w-20 transition-all"
        style={{ background: "linear-gradient(90deg, var(--accent), var(--primary))" }}
      />
    </div>
  );
}

function DashboardPreviewCard({
  city,
  plantHealth,
  humidity,
  temperature,
  wind,
  rain,
  updatedAt,
}: {
  city: string;
  plantHealth: number; // 0-100
  humidity: number; // 0-100
  temperature: number; // °C
  wind: number; // km/h
  rain: number; // mm
  updatedAt: string;
}) {
  const tPreview = useTranslations('homePreview');
  const tMetrics = useTranslations('homeMetrics');
  const status = useMemo(() => {
    if (plantHealth >= 75) return { label: tPreview('statusGood'), tone: "good" as const };
    if (plantHealth >= 50) return { label: tPreview('statusOk'), tone: "ok" as const };
    return { label: tPreview('statusBad'), tone: "bad" as const };
  }, [plantHealth, tPreview]);

  // Llogarit growth rate me logjikën e re nga lib/growth.ts
  const growthRate = useMemo(() => {
    return calcGrowthRateScore({ plantHealth, humidity, temperature, wind, rain });
  }, [plantHealth, humidity, temperature, wind, rain]);

  // Gjeneron një seri 7-ditore bazuar në growthRate
  const growthSeries = useMemo(() => {
    const series = buildWeeklyGrowthSeries(growthRate, `growth:${updatedAt}:${city}`);
    // Konverton vlerat 0-100 në lartësi px (min 26px, max 78px)
    return series.map(item => ({
      day: item.day,
      height: Math.round(26 + (clamp(item.growth, 0, 100) / 100) * 52)
    }));
  }, [growthRate, updatedAt, city]);

  return (
    <div className="glass rounded-3xl p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-black/55">{tPreview('fieldLabel')} • {city}</div>
          <div className="text-lg font-semibold text-(--primary-dark)">
            {status.label}
          </div>
          <div className="text-xs text-black/55">
            {tPreview('updatedLabel')}: {updatedAt}
          </div>
        </div>

        <span className="rounded-full border bg-white/70 px-3 py-1 text-xs font-semibold text-(--primary-dark)">
          {tPreview('live')}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Metric title={tMetrics('plantHealth')} value={`${plantHealth}%`} pct={plantHealth} />
        <Metric title={tMetrics('humidity')} value={`${humidity}%`} pct={humidity} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <Metric title={tMetrics('temperature')} value={`${temperature}°C`} pct={tempToPct(temperature)} />
        <Metric title={tMetrics('wind')} value={`${wind} km/h`} pct={windToPct(wind)} />
        <Metric title={tMetrics('rain')} value={`${rain} mm`} pct={rainToPct(rain)} />
      </div>

      <div className="mt-4 glass rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-(--primary-dark)">{tPreview('growthRate')}</div>
            <div className="mt-1 text-2xl font-semibold text-(--primary-dark)">{growthRate}%</div>
          </div>
          <div className="text-xs text-black/55">{tPreview('week')}</div>
        </div>

        <div className="mt-3 h-2 w-full overflow-hidden rounded-full border bg-white/70">
          <div
            className="h-full rounded-full"
            style={{
              width: `${growthRate}%`,
              background: "linear-gradient(90deg, var(--accent), var(--primary))",
            }}
          />
        </div>

        <div className="mt-3 grid grid-cols-7 gap-2 items-end">
          {growthSeries.map((item, i) => (
            <div key={i} className="w-full rounded-lg border bg-white/70 overflow-hidden">
              <div
                className="rounded-lg"
                style={{
                  height: `${item.height}px`,
                  background: "linear-gradient(180deg, var(--accent), var(--primary))",
                }}
              />
            </div>
          ))}
        </div>

        <div className="mt-3 text-xs text-black/55">
          {tPreview('note')}
        </div>
      </div>
    </div>
  );
}

function Metric({ title, value, pct }: { title: string; value: string; pct: number }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="text-xs text-black/55">{title}</div>
      <div className="mt-1 text-lg font-semibold text-(--primary-dark)">{value}</div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full border bg-white/70">
        <div
          className="h-full rounded-full"
          style={{
            width: `${clamp(pct, 0, 100)}%`,
            background: "linear-gradient(90deg, var(--accent), var(--primary))",
          }}
        />
      </div>
    </div>
  );
}

/* ---------- Helpers ---------- */
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function tempToPct(t: number) {
  // -5..35C -> 0..100 (si te logjika e DashboardHero)
  return clamp(((t + 5) / 40) * 100, 0, 100);
}

function windToPct(w: number) {
  // 0..30 km/h -> 0..100
  return clamp((w / 30) * 100, 0, 100);
}

function rainToPct(r: number) {
  // 0..5 mm -> 0..100
  return clamp((r / 5) * 100, 0, 100);
}

