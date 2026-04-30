import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { routing, hasLocale } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import { SmartImage } from "@/components/SmartImage";
import { CtaSection } from "@/components/CtaSection";

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
  const t = await getTranslations({ locale, namespace: "results" });

  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = `${siteConfig.url}/${l}/results`;
  }

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: `/${locale}/results`, languages },
  };
}

const PLACEHOLDER_RESULTS = [
  { service: "hair-transplant", grafts: "3200", months: "9" },
  { service: "hair-transplant", grafts: "3800", months: "10" },
  { service: "hair-transplant", grafts: "4200", months: "12" },
  { service: "hair-transplant", grafts: "4500", months: "12" },
  { service: "hair-transplant", grafts: "4800", months: "12" },
  { service: "hair-transplant", grafts: "5200", months: "12" },
  { service: "hair-transplant", grafts: "5800", months: "14" },
];

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("results");
  const tHome = await getTranslations("home.results");
  const tServices = await getTranslations("services");
  const tCommon = await getTranslations("home.results");

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
        <div className="container-content">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PLACEHOLDER_RESULTS.map((item, i) => {
              const serviceTitle = tServices(`${item.service}.title`);
              const subtitle = item.grafts
                ? `${item.grafts} greft · ${item.months} ${t("monthsLater")}`
                : `${item.months} ${t("monthsLater")}`;
              return (
                <article key={i} className="card group">
                  <div className="relative aspect-square overflow-hidden">
                    <SmartImage
                      src={`/images/results/result-${(i % 7) + 1}.jpg`}
                      alt={`${serviceTitle} — ${tCommon("beforeAfter")}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary-deep)]/70 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 right-4 flex justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-white/90 text-xs font-bold text-[var(--color-text-strong)] uppercase tracking-wider">
                        {tCommon("before")}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-[var(--color-accent)] text-xs font-bold text-[var(--color-primary-deep)] uppercase tracking-wider">
                        {tCommon("after")}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="font-serif text-lg leading-tight">{serviceTitle}</p>
                      <p className="text-xs text-white/80 mt-1">{subtitle}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <p className="mt-12 text-xs text-center text-[var(--color-text-muted)] max-w-2xl mx-auto">
            {tCommon("disclaimer")}
          </p>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
