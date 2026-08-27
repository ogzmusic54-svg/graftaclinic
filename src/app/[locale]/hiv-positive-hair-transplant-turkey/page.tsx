import type { Metadata } from "next";
import { hreflangFor } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { Link, routing, hasLocale, type Locale } from "@/i18n/routing";
import { siteConfig, buildWhatsAppUrl } from "@/config/site";
import { CtaSection } from "@/components/CtaSection";

const SLUG = "hiv-positive-hair-transplant-turkey";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: "hivPositive.meta" });

  const languages = hreflangFor(`/${SLUG}`);

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

interface NamedItem { title: string; description: string }
interface JourneyStep { day: string; title: string; description: string }
interface FaqItem { question: string; answer: string }

export default async function HivPositivePage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("hivPositive");
  const tNav = await getTranslations("nav");

  const trustChips = t.raw("hero.trustChips") as string[];
  const realityItems = t.raw("medicalReality.items") as NamedItem[];
  const protocolItems = t.raw("ourProtocol.items") as NamedItem[];
  const confidentialityItems = t.raw("confidentiality.items") as string[];
  const journeySteps = t.raw("journey.steps") as JourneyStep[];
  const faqItems = t.raw("faq.items") as FaqItem[];

  const url = `${siteConfig.url}/${locale}/${SLUG}`;
  const emailHref = `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent("Confidential consultation request")}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: tNav("home"), item: `${siteConfig.url}/${locale}` },
      { "@type": "ListItem", position: 2, name: tNav("hairTransplantTurkey"), item: `${siteConfig.url}/${locale}/hair-transplant-turkey` },
      { "@type": "ListItem", position: 3, name: t("hero.title"), item: url },
    ],
  };

  const procedureJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: "Hair Transplantation for HIV-Positive Patients",
    alternateName: ["HIV-Friendly Hair Transplant", "Hair Restoration with Universal Precautions"],
    description: t("intro.body"),
    procedureType: "https://schema.org/SurgicalProcedure",
    bodyLocation: "Scalp",
    indication: {
      "@type": "MedicalIndication",
      name: "Androgenetic alopecia in HIV-positive patients with controlled viral load",
    },
    contraindication: "Uncontrolled viral load, CD4 count below clinical threshold, active opportunistic infection.",
    preparation: "Pre-op review of CD4 count, viral load and antiretroviral therapy status.",
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

  const medicalWebPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": url,
    url,
    name: t("hero.title"),
    description: t("hero.subtitle"),
    audience: {
      "@type": "MedicalAudience",
      audienceType: "Patient",
    },
    about: {
      "@type": "MedicalCondition",
      name: "HIV (controlled, on ART)",
    },
    medicalAudience: ["Patient"],
    inLanguage: locale,
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[var(--color-primary-deep)] text-white">
        <div className="absolute inset-0 -z-10 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-accent-deep)_0%,_transparent_55%)]" />
        </div>
        <div className="container-content py-20 md:py-28">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-white/70">
            <Link href="/" className="hover:text-white">{tNav("home")}</Link>
            <span className="mx-2">/</span>
            <Link href="/hair-transplant-turkey" className="hover:text-white">
              {tNav("hairTransplantTurkey")}
            </Link>
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
            <a href={emailHref} className="btn btn-ghost !text-white !border-white/30 hover:!bg-white/10">
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

      {/* INTRO */}
      <section className="section">
        <div className="container-content max-w-3xl prose-content space-y-5">
          <span className="gold-rule" />
          <h2 className="font-serif">{t("intro.title")}</h2>
          <p className="text-lg leading-relaxed text-[var(--color-text-main)]">
            {t("intro.body")}
          </p>
        </div>
      </section>

      {/* MEDICAL REALITY */}
      <section className="section bg-[var(--color-surface-clinical)] border-y border-[var(--color-border-subtle)]">
        <div className="container-content">
          <div className="max-w-3xl">
            <span className="gold-rule" />
            <h2 className="font-serif">{t("medicalReality.title")}</h2>
            <p className="mt-4 text-lg text-[var(--color-text-muted)]">
              {t("medicalReality.subtitle")}
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {realityItems.map((item, i) => (
              <article
                key={item.title}
                className="card p-6 bg-white"
              >
                <span className="font-serif text-3xl text-[var(--color-accent-deep)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-serif text-xl text-[var(--color-text-strong)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm text-[var(--color-text-muted)] leading-relaxed">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* OUR PROTOCOL */}
      <section className="section">
        <div className="container-content">
          <div className="max-w-3xl">
            <span className="gold-rule" />
            <h2 className="font-serif">{t("ourProtocol.title")}</h2>
            <p className="mt-4 text-lg text-[var(--color-text-muted)]">
              {t("ourProtocol.subtitle")}
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {protocolItems.map((item) => (
              <article
                key={item.title}
                className="card p-6 bg-[var(--color-surface-elevated)] flex gap-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-deep)]">
                  <svg width="18" height="18" viewBox="0 0 20 20" className="text-[var(--color-accent)]" aria-hidden="true">
                    <path
                      d="M4 10l4 4 8-8"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div>
                  <h3 className="font-serif text-xl text-[var(--color-text-strong)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[var(--color-text-muted)] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CONFIDENTIALITY CHECKLIST */}
      <section className="section bg-[var(--color-primary-deep)] text-white">
        <div className="container-content max-w-4xl">
          <span className="gold-rule" />
          <h2 className="font-serif text-white">{t("confidentiality.title")}</h2>
          <ul className="mt-10 grid gap-3 md:grid-cols-2">
            {confidentialityItems.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  className="shrink-0 mt-0.5 text-[var(--color-accent-bright)]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 2L4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                <span className="text-sm text-white/85 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* LEGAL PROTECTION */}
      <section className="section">
        <div className="container-content max-w-3xl">
          <span className="gold-rule" />
          <h2 className="font-serif">{t("legalProtection.title")}</h2>
          <p className="mt-5 text-lg text-[var(--color-text-main)] leading-relaxed">
            {t("legalProtection.body")}
          </p>
        </div>
      </section>

      {/* JOURNEY */}
      <section className="section bg-[var(--color-surface-clinical)] border-y border-[var(--color-border-subtle)]">
        <div className="container-content max-w-4xl">
          <span className="gold-rule" />
          <h2 className="font-serif">{t("journey.title")}</h2>
          <ol className="mt-12 space-y-6">
            {journeySteps.map((step, i) => (
              <li
                key={step.title}
                className="card p-6 grid gap-4 md:grid-cols-[140px_1fr] items-start bg-white"
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

      {/* FAQ */}
      <section className="section">
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

      <CtaSection namespace="hivPositive.cta" />

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalWebPageJsonLd) }}
      />
    </>
  );
}
