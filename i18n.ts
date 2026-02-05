import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

export const locales = ['sq', 'en'] as const;
export const defaultLocale = 'sq' as const;

export default getRequestConfig(async ({locale}) => {
  if (!locales.includes(locale as any)) notFound();

  return {
    locale: locale as string,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
