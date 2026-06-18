import { appConfig, generatedLocales } from "@/lib/appConfig";
import { montserrat } from '@/lib/fonts';
import { GoogleAnalyticsScript, MicrosoftClarityScript } from "@windrun-huaiin/base-ui/components/server";
import { cn } from '@windrun-huaiin/lib/utils';
import { getFumaTranslations } from '@windrun-huaiin/third-ui/fuma/server';
import { NProgressBar } from '@windrun-huaiin/third-ui/main';
import { RootProvider } from "fumadocs-ui/provider/next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { getAsNeededLocalizedUrl } from '@windrun-huaiin/lib';
import React from 'react';
import './globals.css';
import { HOME_PREVIEW_IMAGE } from '@/lib/home-seo';

export const dynamic = 'force-static';

export async function generateMetadata({
  params: paramsPromise
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await paramsPromise;
  const t = await getTranslations({ locale, namespace: 'home' });
  const title = t('webTitle');
  const description = t('webDescription');
  const canonicalUrl = `${appConfig.baseUrl}${getAsNeededLocalizedUrl(locale, '/')}`;

  return {
    metadataBase: new URL(appConfig.baseUrl),
    title,
    description,
    keywords: t('keywords'),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en": `${appConfig.baseUrl}${getAsNeededLocalizedUrl('en', '/')}`,
      }
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      locale,
      images: [
        {
          url: HOME_PREVIEW_IMAGE.url,
          width: HOME_PREVIEW_IMAGE.width,
          height: HOME_PREVIEW_IMAGE.height,
          alt: HOME_PREVIEW_IMAGE.alt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [HOME_PREVIEW_IMAGE.url],
    },
    icons: [
      { rel: "icon", type: 'image/png', sizes: "16x16", url: "/favicon-16x16.png" },
      { rel: "icon", type: 'image/png', sizes: "32x32", url: "/favicon-32x32.png" },
      { rel: "icon", type: 'image/ico', url: "/favicon.ico" },
      { rel: "apple-touch-icon", sizes: "180x180", url: "/favicon-180x180.png" },
      { rel: "android-chrome", sizes: "512x512", url: "/favicon-512x512.png" },
    ]
  }
}

export default async function RootLayout({
  children,
  params: paramsPromise
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await paramsPromise;
  setRequestLocale(locale);
  const messages = await getMessages();
  const fumaTranslations = await getFumaTranslations(locale);
  return (
    <html lang={locale} suppressHydrationWarning>
      <NextIntlClientProvider messages={messages}>
        <body className={cn(montserrat.className)}>
          <NProgressBar />
          <RootProvider
              i18n={{
                locale: locale,
                locales: generatedLocales,
                translations: fumaTranslations,
              }}
            >
              {children}
            </RootProvider>
        </body>
        <GoogleAnalyticsScript />
        <MicrosoftClarityScript />
      </NextIntlClientProvider>
    </html>
  )
}
