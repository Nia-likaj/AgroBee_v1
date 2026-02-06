import {getRequestConfig} from 'next-intl/server';

export const locales = ['sq', 'en'] as const;
export const defaultLocale = 'sq' as const;

export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as any)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
