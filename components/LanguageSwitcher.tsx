'use client';

import {useLocale} from 'next-intl';
import {useRouter, usePathname} from 'next/navigation';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: string) => {
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPathname);
  };

  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={() => switchLanguage('sq')}
        className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition-all ${
          locale === 'sq' 
            ? 'bg-green-600 text-white shadow-md' 
            : 'bg-white/80 text-gray-700 hover:bg-white border border-gray-200'
        }`}
        aria-label="Switch to Albanian"
      >
        SQ
      </button>
      <button
        onClick={() => switchLanguage('en')}
        className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition-all ${
          locale === 'en' 
            ? 'bg-green-600 text-white shadow-md' 
            : 'bg-white/80 text-gray-700 hover:bg-white border border-gray-200'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  );
}
