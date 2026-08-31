import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { routing, hasLocale, type Locale } from "@/i18n/routing";
import { hreflangFor } from "@/lib/seo";
import { LegalPage } from "@/components/LegalPage";
import { impressum } from "@/content/legal";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const icerik = impressum[locale as Locale];

  return {
    title: icerik.baslik,
    description: icerik.aciklama,
    alternates: {
      canonical: `/${locale}/impressum`,
      languages: hreflangFor("/impressum"),
    },
    // Hukuki sayfa arama sonucunda öne çıkmamalı ama taranabilir kalmalı.
    robots: { index: true, follow: true },
  };
}

export default async function ImpressumPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return <LegalPage icerik={impressum[locale as Locale]} />;
}
