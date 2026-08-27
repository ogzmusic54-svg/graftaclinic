import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Newsreader, Manrope } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { routing, hasLocale, type Locale } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import { hreflangFor } from "@/lib/seo";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { OrganizationSchema } from "@/components/OrganizationSchema";
import { WebSiteSchema } from "@/components/WebSiteSchema";

import "../globals.css";

const newsreader = Newsreader({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-newsreader",
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-manrope",
  weight: ["300", "400", "500", "600", "700"],
});

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

  const t = await getTranslations({ locale, namespace: "home.meta" });
  const tagline = siteConfig.brand.tagline[locale as Locale];

  const languages = hreflangFor();

  // Almanca için de_DE seçildi: hedef pazarın ağırlığı Almanya (Avusturya ve
  // İsviçre de aynı etiketi okur). İngilizce için en_GB — kitle Avrupa,
  // ABD değil.
  const OG_LOCALE: Record<Locale, string> = {
    tr: "tr_TR",
    en: "en_GB",
    de: "de_DE",
  };

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: t("title"),
      template: `%s · ${siteConfig.name}`,
    },
    description: t("description"),
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.name }],
    alternates: {
      canonical: `/${locale}`,
      languages,
    },
    openGraph: {
      type: "website",
      // Open Graph, ISO dil kodunu değil `dil_ÜLKE` biçimini bekler.
      // Yalın "de" geçersiz sayılır; paylaşımlarda dil eşleşmesi kaybolur.
      locale: OG_LOCALE[locale as Locale],
      alternateLocale: routing.locales
        .filter((l) => l !== locale)
        .map((l) => OG_LOCALE[l]),
      url: `${siteConfig.url}/${locale}`,
      siteName: siteConfig.name,
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: "/images/og-cover.jpg",
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} — ${tagline}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "common" });
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${newsreader.variable} ${manrope.variable}`}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <a
            href="#main"
            className="absolute -top-12 left-4 z-50 rounded bg-[var(--color-primary)] px-4 py-2 text-white focus:top-4"
          >
            {t("skipToContent")}
          </a>
          <Header />
          <main id="main" className="min-h-[60vh]">
            {children}
          </main>
          <Footer />
          <WhatsAppFloat />
          <OrganizationSchema locale={locale as Locale} />
          <WebSiteSchema locale={locale as Locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
