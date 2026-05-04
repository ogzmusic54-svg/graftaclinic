import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { Link, routing, hasLocale, type Locale } from "@/i18n/routing";
import { siteConfig, buildWhatsAppUrl, buildTelLink } from "@/config/site";
import { CtaSection } from "@/components/CtaSection";

const SLUG = "hair-transplant-turkey";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: "hairTransplantTurkey.meta" });

  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = `${siteConfig.url}/${l}/${SLUG}`;
  }

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    alternates: {
      canonical: `/${locale}/${SLUG}`,
      languages,
    },
    openGraph: {
      type: "article",
      locale,
      url: `${siteConfig.url}/${locale}/${SLUG}`,
      siteName: siteConfig.name,
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: "/images/og-cover.jpg",
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    robots: { index: true, follow: true },
  };
}

interface KV { value: string; label: string }
interface CompareRow { country: string; price: string; note: string }
interface NamedItem { title: string; description: string }
interface TechItem { name: string; tagline: string; description: string }
interface Tier { name: string; price: string; grafts: string; includes: string[]; highlight?: string }
interface JourneyStep { day: string; title: string; description: string }
interface FaqItem { question: string; answer: string }

export default async function HairTransplantTurkeyPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("hairTransplantTurkey");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");

  const stats = t.raw("intro.stats") as KV[];
  const trustChips = t.raw("hero.trustChips") as string[];
  const compareRows = t.raw("whyTurkey.comparison.rows") as CompareRow[];
  const whyItems = t.raw("whyGrafta.items") as NamedItem[];
  const techniques = t.raw("techniques.items") as TechItem[];
  const tiers = t.raw("pricing.tiers") as Tier[];
  const packageItems = t.raw("package.items") as NamedItem[];
  const journeySteps = t.raw("journey.steps") as JourneyStep[];
  const patientGroups = t.raw("patientGroups.items") as NamedItem[];
  const faqItems = t.raw("faq.items") as FaqItem[];

  const url = `${siteConfig.url}/${locale}/${SLUG}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: tNav("home"), item: `${siteConfig.url}/${locale}` },
      { "@type": "ListItem", position: 2, name: t("hero.title"), item: url },
    ],
  };

  const procedureJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: "Hair Transplantation",
    alternateName: ["Hair Restoration", "FUE Hair Transplant", "DHI Hair Transplant", "Sapphire FUE"],
    description: t("intro.body"),
    procedureType: "https://schema.org/SurgicalProcedure",
    bodyLocation: "Scalp",
    preparation: t("journey.steps.0.description"),
    followup: t("journey.steps.4.description"),
    provider: {
      "@type": "MedicalBusiness",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      url: `${siteConfig.url}/${locale}`,
      telephone: siteConfig.contact.phone,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Istanbul",
        addressCountry: "TR",
      },
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const offerCatalogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Hair Transplant Turkey",
    provider: { "@id": `${siteConfig.url}/#organization` },
    areaServed: ["TR", "DE", "GB", "US", "NL", "AE", "SA", "FR"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: t("pricing.title"),
      itemListElement: tiers.map((tier) => ({
        "@type": "Offer",
        name: tier.name,
        price: tier.price,
        priceCurrency: "USD",
        description: `${tier.grafts} · ${tier.includes.slice(0, 3).join(" · ")}`,
        availability: "https://schema.org/InStock",
      })),
    },
  };

  const aggregateRatingJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": `${siteConfig.url}/#organization`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "1247",
      bestRating: "5",
      worstRating: "1",
    },
  };

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[var(--color-primary-deep)] text-white">
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-accent-deep)_0%,_transparent_55%)]" />
        </div>
        <div className="container-content py-20 md:py-28">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-white/70">
            <Link href="/" className="hover:text-white">{tNav("home")}</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{t("hero.title")}</span>
          </nav>
          <p className="label-caps text-[var(--color-accent-soft)] mb-3">{t("hero.kicker")}</p>
          <h1 className="font-serif text-white max-w-4xl">{t("hero.title")}</h1>
          <p className="mt-5 text-lg md:text-xl text-white/85 max-w-3xl leading-relaxed">
            {t("hero.subtitle")}
          </p>
          <p className="mt-3 text-sm text-white/65 max-w-3xl">{t("hero.h1Subline")}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={buildWhatsAppUrl(locale as Locale)}
              target="_blank"
              rel="noopener"
              className="btn btn-accent"
            >
              {t("hero.primaryCta")}
            </a>
            <a
              href={buildTelLink()}
              className="btn btn-ghost !text-white !border-white/30 hover:!bg-white/10"
            >
              {t("hero.secondaryCta")}
            </a>
          </div>

          <ul className="mt-10 flex flex-wrap gap-3" aria-label="Trust signals">
            {trustChips.map((c) => (
              <li
                key={c}
                className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-wide text-white/80 backdrop-blur"
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* INTRO + STATS */}
      <section className="section">
        <div className="container-content grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3 prose-content space-y-5">
            <span className="gold-rule" />
            <h2 className="font-serif">{t("intro.title")}</h2>
            <p className="text-lg leading-relaxed text-[var(--color-text-main)]">
              {t("intro.body")}
            </p>
          </div>
          <dl className="lg:col-span-2 grid grid-cols-2 gap-4 self-center">
            {stats.map((s) => (
              <div
                key={s.label}
                className="card p-6 text-center bg-[var(--color-surface-elevated)]"
              >
                <dt className="font-serif text-3xl text-[var(--color-text-strong)]">{s.value}</dt>
                <dd className="mt-1 text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* WHY TURKEY · PRICE COMPARISON */}
      <section className="section bg-[var(--color-surface-clinical)] border-y border-[var(--color-border-subtle)]">
        <div className="container-content max-w-5xl">
          <span className="gold-rule" />
          <h2 className="font-serif">{t("whyTurkey.title")}</h2>
          <p className="mt-4 text-lg text-[var(--color-text-muted)] leading-relaxed">
            {t("whyTurkey.subtitle")}
          </p>

          <div className="mt-10 overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-white shadow-sm">
            <div className="bg-[var(--color-primary-deep)] px-6 py-4">
              <p className="font-serif text-lg text-white">{t("whyTurkey.comparison.title")}</p>
            </div>
            <table className="w-full text-left">
              <thead className="bg-[var(--color-surface-low)] text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
                <tr>
                  <th className="px-6 py-3 font-medium">Country</th>
                  <th className="px-6 py-3 font-medium">Price (5,000 grafts)</th>
                  <th className="px-6 py-3 font-medium hidden md:table-cell">Notes</th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((r, i) => {
                  const isUs = i === compareRows.length - 1;
                  return (
                    <tr
                      key={r.country}
                      className={
                        isUs
                          ? "bg-[var(--color-accent-soft)]/20 font-medium"
                          : "border-t border-[var(--color-border-subtle)]"
                      }
                    >
                      <td className="px-6 py-4 text-[var(--color-text-strong)]">{r.country}</td>
                      <td className="px-6 py-4 text-[var(--color-text-strong)] font-serif text-lg">
                        {r.price}
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--color-text-muted)] hidden md:table-cell">
                        {r.note}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-[var(--color-text-muted)] italic">
            {t("whyTurkey.comparison.note")}
          </p>
        </div>
      </section>

      {/* WHY GRAFTA · 8 STANDARDS */}
      <section className="section">
        <div className="container-content">
          <div className="max-w-3xl">
            <span className="gold-rule" />
            <h2 className="font-serif">{t("whyGrafta.title")}</h2>
            <p className="mt-4 text-lg text-[var(--color-text-muted)]">
              {t("whyGrafta.subtitle")}
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {whyItems.map((w, i) => (
              <article
                key={w.title}
                className="card p-6 bg-[var(--color-surface-elevated)] flex gap-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-deep)] font-serif text-base text-[var(--color-accent)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-serif text-xl text-[var(--color-text-strong)]">{w.title}</h3>
                  <p className="mt-2 text-[var(--color-text-muted)] leading-relaxed">
                    {w.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TECHNIQUES */}
      <section className="section bg-[var(--color-surface-clinical)] border-y border-[var(--color-border-subtle)]">
        <div className="container-content">
          <div className="max-w-3xl">
            <span className="gold-rule" />
            <h2 className="font-serif">{t("techniques.title")}</h2>
            <p className="mt-4 text-lg text-[var(--color-text-muted)]">
              {t("techniques.subtitle")}
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {techniques.map((tech) => (
              <article
                key={tech.name}
                className="card p-6 bg-white border-[var(--color-border-subtle)]"
              >
                <p className="label-caps text-[var(--color-accent-deep)] mb-2">{tech.tagline}</p>
                <h3 className="font-serif text-xl text-[var(--color-text-strong)]">{tech.name}</h3>
                <p className="mt-3 text-sm text-[var(--color-text-muted)] leading-relaxed">
                  {tech.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="section">
        <div className="container-content">
          <div className="max-w-3xl">
            <span className="gold-rule" />
            <h2 className="font-serif">{t("pricing.title")}</h2>
            <p className="mt-4 text-lg text-[var(--color-text-muted)]">{t("pricing.subtitle")}</p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {tiers.map((tier) => (
              <article
                key={tier.name}
                className={
                  tier.highlight
                    ? "card p-7 bg-[var(--color-primary-deep)] text-white border-[var(--color-primary-deep)] relative overflow-hidden lg:scale-[1.03]"
                    : "card p-7 bg-white"
                }
              >
                {tier.highlight && (
                  <span className="absolute top-4 right-4 rounded-full bg-[var(--color-accent)] px-3 py-1 text-xs font-medium uppercase tracking-wider text-[var(--color-primary-deep)]">
                    {tier.highlight}
                  </span>
                )}
                <h3
                  className={
                    tier.highlight
                      ? "font-serif text-xl text-white"
                      : "font-serif text-xl text-[var(--color-text-strong)]"
                  }
                >
                  {tier.name}
                </h3>
                <p
                  className={
                    tier.highlight
                      ? "mt-3 font-serif text-3xl text-[var(--color-accent-soft)]"
                      : "mt-3 font-serif text-3xl text-[var(--color-text-strong)]"
                  }
                >
                  {tier.price}
                </p>
                <p
                  className={
                    tier.highlight
                      ? "text-xs uppercase tracking-wider text-white/70"
                      : "text-xs uppercase tracking-wider text-[var(--color-text-muted)]"
                  }
                >
                  {tier.grafts}
                </p>

                <ul className="mt-6 space-y-3">
                  {tier.includes.map((line) => (
                    <li key={line} className="flex gap-3 text-sm">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 20 20"
                        className={
                          tier.highlight
                            ? "shrink-0 text-[var(--color-accent-soft)]"
                            : "shrink-0 text-[var(--color-accent)]"
                        }
                        aria-hidden="true"
                      >
                        <path
                          d="M4 10l4 4 8-8"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span
                        className={
                          tier.highlight
                            ? "text-white/85"
                            : "text-[var(--color-text-main)]"
                        }
                      >
                        {line}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href={buildWhatsAppUrl(locale as Locale)}
                  target="_blank"
                  rel="noopener"
                  className={
                    tier.highlight
                      ? "btn btn-accent w-full mt-6 justify-center"
                      : "btn btn-primary w-full mt-6 justify-center"
                  }
                >
                  {t("hero.primaryCta")}
                </a>
              </article>
            ))}
          </div>
          <p className="mt-6 text-xs text-[var(--color-text-muted)] italic max-w-3xl">
            {t("pricing.disclaimer")}
          </p>
        </div>
      </section>

      {/* ALL-INCLUSIVE PACKAGE */}
      <section className="section bg-[var(--color-primary-deep)] text-white">
        <div className="container-content">
          <div className="max-w-3xl">
            <span className="gold-rule" />
            <h2 className="font-serif text-white">{t("package.title")}</h2>
            <p className="mt-4 text-lg text-white/75">{t("package.subtitle")}</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {packageItems.map((p) => (
              <article
                key={p.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
              >
                <h3 className="font-serif text-lg text-white">{p.title}</h3>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">{p.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* JOURNEY · DAY-BY-DAY */}
      <section className="section">
        <div className="container-content max-w-4xl">
          <span className="gold-rule" />
          <h2 className="font-serif">{t("journey.title")}</h2>
          <ol className="mt-12 space-y-6">
            {journeySteps.map((step, i) => (
              <li
                key={step.title}
                className="card p-6 grid gap-4 md:grid-cols-[140px_1fr] items-start bg-[var(--color-surface-elevated)]"
              >
                <div>
                  <span className="label-caps text-[var(--color-accent-deep)]">{step.day}</span>
                  <p className="mt-1 font-serif text-2xl text-[var(--color-text-strong)]">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                </div>
                <div>
                  <h3 className="font-serif text-xl text-[var(--color-text-strong)]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[var(--color-text-muted)] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* PATIENT GROUPS */}
      <section className="section bg-[var(--color-surface-clinical)] border-y border-[var(--color-border-subtle)]">
        <div className="container-content">
          <div className="max-w-3xl">
            <span className="gold-rule" />
            <h2 className="font-serif">{t("patientGroups.title")}</h2>
            <p className="mt-4 text-lg text-[var(--color-text-muted)]">
              {t("patientGroups.subtitle")}
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {patientGroups.map((g, i) => {
              const linkedSlug = i === 3 ? "/hiv-positive-hair-transplant-turkey" : null;
              if (linkedSlug) {
                return (
                  <Link
                    key={g.title}
                    href={linkedSlug}
                    className="card p-6 bg-white block hover:border-[var(--color-accent)] transition-colors"
                  >
                    <h3 className="font-serif text-lg text-[var(--color-text-strong)]">{g.title}</h3>
                    <p className="mt-2 text-sm text-[var(--color-text-muted)] leading-relaxed">
                      {g.description}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-[var(--color-accent-deep)]">
                      {tCommon("readMore")}
                      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                        <path d="M3 6h6m0 0L6 3m3 3L6 9" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </Link>
                );
              }
              return (
                <article key={g.title} className="card p-6 bg-white">
                  <h3 className="font-serif text-lg text-[var(--color-text-strong)]">{g.title}</h3>
                  <p className="mt-2 text-sm text-[var(--color-text-muted)] leading-relaxed">
                    {g.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* RESULTS LINK */}
      <section className="section">
        <div className="container-content max-w-4xl text-center">
          <span className="gold-rule mx-auto" />
          <h2 className="font-serif">{t("results.title")}</h2>
          <p className="mt-4 text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
            {t("results.subtitle")}
          </p>
          <Link href="/results" className="btn btn-primary mt-8 inline-flex">
            {t("results.cta")}
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-[var(--color-surface-clinical)] border-y border-[var(--color-border-subtle)]">
        <div className="container-content max-w-3xl">
          <span className="gold-rule" />
          <h2 className="font-serif">{t("faq.title")}</h2>
          <div className="mt-10 space-y-3">
            {faqItems.map((f, i) => (
              <details
                key={i}
                className="group rounded-xl border border-[var(--color-border-subtle)] bg-white p-5 open:shadow-md"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-serif text-lg text-[var(--color-text-strong)]">
                  {f.question}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 12 12"
                    className="shrink-0 transition-transform group-open:rotate-180"
                  >
                    <path
                      d="M2 4l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </summary>
                <p className="mt-3 text-[var(--color-text-muted)] leading-relaxed">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaSection namespace="hairTransplantTurkey.cta" />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(procedureJsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerCatalogJsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRatingJsonLd) }}
      />
    </>
  );
}
