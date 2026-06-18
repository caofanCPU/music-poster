import { Hero } from "@/components/hero";
import { FAQ, SeoContent } from "@windrun-huaiin/third-ui/main/server";
import { appConfig } from "@/lib/appConfig";
import { HOME_PREVIEW_IMAGE } from "@/lib/home-seo";
import { getAsNeededLocalizedUrl } from "@windrun-huaiin/lib";
import { getTranslations } from "next-intl/server";

export const revalidate = false;

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  const pageUrl = `${appConfig.baseUrl}${getAsNeededLocalizedUrl(locale, '/')}`;
  const imageJsonLd = {
    '@type': 'ImageObject',
    url: HOME_PREVIEW_IMAGE.url,
    width: HOME_PREVIEW_IMAGE.width,
    height: HOME_PREVIEW_IMAGE.height,
    caption: HOME_PREVIEW_IMAGE.alt,
  };
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: t('webTitle'),
    description: t('webDescription'),
    url: pageUrl,
    primaryImageOfPage: imageJsonLd,
    image: imageJsonLd,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero locale={locale} />
      <SeoContent locale={locale} />
      <FAQ locale={locale} />
    </>
  )
}

export async function generateStaticParams() {
  return appConfig.i18n.locales.map(locale => ({ locale }));
}
