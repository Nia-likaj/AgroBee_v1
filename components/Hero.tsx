"use client";

import Link from "next/link";
import HeroDashboardPreview from "./HeroDashboardPreview";
import {useTranslations, useLocale} from 'next-intl';

export default function Hero() {
  const locale = useLocale();
  const t = useTranslations('hero');
  const tStats = useTranslations('heroStats');
  return (
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

          <h1 className="text-5xl font-bold text-(--primary-dark)">
            {t('title')}{" "}
            <span className="underline decoration-(--accent) decoration-4 underline-offset-4">
              {t('highlight')}
            </span>
            .
          </h1>

          <p className="text-lg text-(--primary-dark)">{t('description')}</p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/${locale}/register`}
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-sm"
              style={{ background: "linear-gradient(90deg, var(--primary), var(--accent))" }}
            >
              {t('cta')}
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Stat label={tStats('marketplaceLabel')} value={tStats('marketplaceValue')} />
            <Stat label={tStats('grantsLabel')} value={tStats('grantsValue')} />
            <Stat label={tStats('trainingLabel')} value={tStats('trainingValue')} />
          </div>
        </div>

        <div className="relative">
          <HeroDashboardPreview />

          <Link href={`/${locale}/dashboard`} className="absolute -bottom-4 -left-4 hidden md:block">
            <div className="glass rounded-2xl px-4 py-3 shadow-sm transition-transform hover:scale-105 cursor-pointer">
              <div className="text-xs text-black/55">{tStats('userArea')}</div>
              <div className="text-sm font-semibold text-(--primary-dark)">
                {tStats('dashboard')}
              </div>
            </div>
          </Link>

          <div className="absolute -top-4 -right-4 hidden md:block">
            <div className="glass rounded-2xl px-4 py-3 shadow-sm">
              <div className="text-xs text-black/55">{tStats('experts')}</div>
              <div className="text-sm font-semibold text-(--primary-dark)">
                {tStats('expertsValue')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="text-xs text-black/55">{label}</div>
      <div className="mt-1 text-sm font-semibold text-(--primary-dark)">{value}</div>
    </div>
  );
}
