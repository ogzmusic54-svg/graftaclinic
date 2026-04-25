import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { routing, hasLocale, type Locale } from "@/i18n/routing";
import { categoryOrder, getServicesByCategory } from "@/config/services";
import { ServiceCard } from "@/components/ServiceCard";
import { CtaSection } from "@/components/CtaSection";
import { siteConfig } from "@/config/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "services.indexMeta" });

  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = `${siteConfig.url}/${l}/services`;
  }

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/services`,
      languages,
    },
  };
}

export default async function ServicesIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("services.indexHero");
  const tNav = await getTranslations("nav");

  return (
    <>
      <section className="section bg-[var(--color-surface-clinical)] border-b border-[var(--color-border-subtle)]">
        <div className="container-content max-w-3xl">
          <span className="gold-rule" />
          <p className="label-caps text-[var(--color-accent-deep)] mb-3">{t("kicker")}</p>
          <h1 className="font-serif">{t("title")}</h1>
          <p className="mt-4 text-lg text-[var(--color-text-muted)]">{t("subtitle")}</p>
        </div>
      </section>

      <section className="section">
        <div className="container-content space-y-16">
          {categoryOrder.map((cat) => {
            const items = getServicesByCategory(cat);
            return (
              <div key={cat}>
                <h2 className="font-serif text-3xl mb-6 text-[var(--color-text-strong)]">
                  {tNav(`categories.${cat}`)}
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((s) => (
                    <ServiceCard key={s.slug} service={s} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <CtaSection />
    </>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Locale tipini kullanılır halde tutmak için
export type _Locale = Locale;
