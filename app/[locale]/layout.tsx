import {NextIntlClientProvider} from 'next-intl';
import {notFound} from 'next/navigation';
import type { Metadata } from "next";
import {locales} from '@/i18n';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClientProviders from "@/components/ClientProviders";

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const messages = (await import(`@/messages/${locale}.json`)).default;
  return {
    title: messages.meta?.title,
    description: messages.meta?.description,
    icons: {
      icon: "/images/logo.png",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ClientProviders>
        <Navbar />
        {children}
        <Footer />
      </ClientProviders>
    </NextIntlClientProvider>
  );
}
