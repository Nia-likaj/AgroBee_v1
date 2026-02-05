"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

function isActive(pathname: string, href: string, locale: string) {
  const localePath = `/${locale}${href}`;
  if (href === "/") return pathname === `/${locale}` || pathname === `/${locale}/`;
  return pathname.startsWith(localePath);
}

export default function Navbar() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('nav');

  const navItems = [
    { href: `/${locale}/about`, label: t('about') },
  ];

  return (
    <header className="sticky top-0 z-50">
      <div
        className="border-b"
        style={{
          background:
            "linear-gradient(180deg, rgba(246,251,246,0.88), rgba(246,251,246,0.55))",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="AgroBee Logo"
              width={44}
              height={44}
              className="rounded-xl"
              style={{ width: 'auto', height: 'auto', maxWidth: '44px', maxHeight: '44px' }}
            />
            <div className="leading-tight">
              <div className="font-semibold text-[color:var(--primary-dark)]">AgroBee</div>
              <div className="text-xs text-black/55 -mt-0.5">{t('tagline')}</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navItems.map((i) => (
              <Link
                key={i.href}
                href={i.href}
                className={`transition ${
                  isActive(pathname, i.href.replace(`/${locale}`, ''), locale) ? "text-black" : "text-black/70 hover:text-black"
                }`}
              >
                {i.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />

            <Link
              href={`/${locale}/register`}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm"
              style={{ background: "linear-gradient(90deg, var(--primary), var(--accent))" }}
            >
              {t('register')}
            </Link>
          </div>
        </div>

        {/* Mobile quick nav */}
        <div className="md:hidden px-4 pb-3">
          <div className="glass rounded-2xl px-3 py-2 flex items-center justify-between text-sm">
            {navItems.map((i) => (
              <Link
                key={i.href}
                href={i.href}
                className={`${isActive(pathname, i.href.replace(`/${locale}`, ''), locale) ? "text-black" : "text-black/70"}`}
              >
                {i.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
