import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { routing, hasLocale } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import { SmartImage } from "@/components/SmartImage";
import { TrustStats } from "@/components/TrustStats";
import { TrustBadges } from "@/components/TrustBadges";
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
  const t = await getTranslations({ locale, namespace: "about.meta" });

  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = `${siteConfig.url}/${l}/about`;
  }

  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: `/${locale}/about`, languages },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("about");
  const values = t.raw("values") as { title: string; description: string }[];

  return (
    <>
      <section className="relative overflow-hidden bg-[var(--color-primary-deep)] text-white">
        <div className="absolute inset-0 -z-10">
          <SmartImage
            src="/images/clinic-interior.jpg"
            alt={siteConfig.name}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary-deep)]/95 to-[var(--color-primary-deep)]/60" />
        </div>
        <div className="container-content py-24 md:py-32 max-w-3xl">
          <p className="label-caps text-[var(--color-accent-soft)] mb-3">{t("hero.kicker")}</p>
          <h1 className="font-serif text-white">{t("hero.title")}</h1>
          <p className="mt-5 text-lg md:text-xl text-white/85 leading-relaxed">{t("hero.subtitle")}</p>
        </div>
      </section>

      <section className="section">
        <div className="container-content grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <SmartImage
              src="/images/clinic-team.jpg"
              alt={t("story.title")}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <span className="gold-rule" />
            <h2 className="font-serif">{t("story.title")}</h2>
            <p className="mt-5 text-lg leading-relaxed text-[var(--color-text-main)]">
              {t("story.body")}
            </p>
          </div>
        </div>
      </section>

      <TrustStats />

      <section className="section bg-[var(--color-surface-low)]">
        <div className="container-content">
          <div className="max-w-2xl mb-12">
            <span className="gold-rule" />
            <h2 className="font-serif">{t("facility.title")}</h2>
            <p className="mt-5 text-lg leading-relaxed text-[var(--color-text-main)]">
              {t("facility.body")}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <div key={i} className="card p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-primary-deep)] font-serif font-semibold mb-4">
                  {i + 1}
                </span>
                <h3 className="font-serif text-lg text-[var(--color-text-strong)] mb-2">
                  {v.title}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TrustBadges />
      <CtaSection />
    </>
  );
}
