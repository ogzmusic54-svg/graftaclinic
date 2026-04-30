import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/routing";

const LANG_TAG: Record<Locale, string> = {
  tr: "tr-TR",
  en: "en-US",
  de: "de-DE",
};

export function WebSiteSchema({ locale }: { locale: Locale }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: `${siteConfig.url}/${locale}`,
    inLanguage: LANG_TAG[locale],
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
