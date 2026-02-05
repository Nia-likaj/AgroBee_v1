"use client";

import Link from "next/link";
import {useLocale, useTranslations} from 'next-intl';

export default function HeroDashboardPreview() {
  const locale = useLocale();
  const t = useTranslations('heroPreview');
  const tMetrics = useTranslations('homeMetrics');
  return (
    <Link
      href={`/${locale}/dashboard`}
      className="group relative block focus:outline-none"
      aria-label={t('ariaLabel')}
    >
      {/* Card */}
      <div className="glass rounded-3xl p-5 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-0.5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-black/55">{t('fieldLabel')}</div>
            <div className="text-lg font-semibold text-[color:var(--primary-dark)]">
              {t('title')}
            </div>
            <div className="text-xs text-black/55">
              {t('subtitle')}
            </div>
          </div>

          <span className="rounded-full border bg-white/70 px-3 py-1 text-xs font-semibold text-[color:var(--primary-dark)]">
            {t('live')}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <MetricMini title={tMetrics('plantHealth')} value="68%" pct={68} />
          <MetricMini title={tMetrics('humidity')} value="82%" pct={82} />
        </div>

        <div className="mt-4 glass rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-[color:var(--primary-dark)]">
              {t('growthRate')}
            </div>
            <div className="text-xs text-black/55">{t('week')}</div>
          </div>

          <div className="mt-3 grid grid-cols-7 gap-2 items-end">
            {[32, 46, 28, 54, 40, 58, 44].map((h, i) => (
              <div key={i} className="w-full rounded-lg border bg-white/70 overflow-hidden">
                <div
                  className="rounded-lg"
                  style={{
                    height: `${h}px`,
                    background: "linear-gradient(180deg, var(--accent), var(--primary))",
                  }}
                />
              </div>
            ))}
          </div>

          <div className="mt-3 text-xs text-black/55">
            {t('note')}
          </div>
        </div>
      </div>

      {/* Hover overlay: mini dashboard screenshot vibe */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.22) 55%, rgba(0,0,0,0.38) 100%)",
          }}
        />
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <div className="rounded-2xl border bg-white/75 px-3 py-2 text-xs font-semibold text-[color:var(--primary-dark)]"
            style={{ borderColor: "rgba(255,255,255,0.35)" }}
          >
            Shiko Dashboard-in
          </div>

          <div
            className="rounded-2xl px-3 py-2 text-xs font-semibold text-white shadow-sm"
            style={{ background: "linear-gradient(90deg, var(--primary), var(--accent))" }}
          >
            Hap →
          </div>
        </div>
      </div>
    </Link>
  );
}

function MetricMini({ title, value, pct }: { title: string; value: string; pct: number }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="text-xs text-black/55">{title}</div>
      <div className="mt-1 text-lg font-semibold text-[color:var(--primary-dark)]">{value}</div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full border bg-white/70">
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, var(--accent), var(--primary))",
          }}
        />
      </div>
    </div>
  );
}
