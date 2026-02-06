"use client";

import Link from "next/link";
import {useTranslations, useLocale} from 'next-intl';

export default function Footer() {
  const locale = useLocale();
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  return (
    <footer 
      className="relative border-t text-white overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(31,122,58,0.95), rgba(139,195,74,0.95))"
      }}
    >
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url("/images/farm-field.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <div className="font-semibold text-white">AgroBee.al</div>
            <p className="mt-2 text-sm text-white/80">
              {t('description')}
            </p>
          </div>

          <div>
            <div className="text-sm font-semibold text-white">{t('links')}</div>
            <div className="mt-3 grid gap-2 text-sm">
              {/* <Link className="text-white/80 hover:text-white" href="/farms">Fermat</Link> */}
              {/* <Link className="text-white/80 hover:text-white" href="/blog">Blog</Link> */}
              <Link className="text-white/80 hover:text-white" href={`/${locale}/about`}>{tNav('about')}</Link>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-white">{t('contact')}</div>
            <p className="mt-3 text-sm text-white/80">Email: agrobee.albania@gmail.com</p>
            <p className="mt-1 text-sm text-white/80">{t('location')}</p>
          </div>
        </div>

        <div className="mt-8 text-xs text-white/60">
          © {new Date().getFullYear()} AgroBee. {t('rights')}
        </div>
      </div>
    </footer>
  );
}
