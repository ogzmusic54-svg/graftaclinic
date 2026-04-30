import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { Link, routing, hasLocale } from "@/i18n/routing";
import { services, getService } from "@/config/services";
import { siteConfig, buildWhatsAppUrl, buildTelLink } from "@/config/site";
import { SmartImage } from "@/components/SmartImage";
import { CtaSection } from "@/components/CtaSection";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  const out: { locale: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    for (const s of services) {
      out.push({ locale, slug: s.slug });
    }
  }
  return out;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const service = getService(slug);
  if (!service) return {};

  const t = await getTranslations({ locale, namespace: `services.${slug}` });

  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = `${siteConfig.url}/${l}/services/${slug}`;
  }

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `/${locale}/services/${slug}`,
      languages,
    },
    openGraph: {
      type: "article",
      title: t("metaTitle"),
      description: t("metaDescription"),
      images: [{ url: service.heroImage ?? service.image, width: 1200, height: 800, alt: t("title") }],
    },
  };
}

interface ProcessStep { step: string; description: string }
interface FaqItem { question: string; answer: string }

export default async function ServiceDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const service = getService(slug);
  if (!service) notFound();
  setRequestLocale(locale);

  const t = await getTranslations(`services.${slug}`);
  const tCommon = await getTranslations("services.common");
  const tNav = await getTranslations("nav");
  const tCommonRoot = await getTranslations("common");

  const benefits = t.raw("benefits") as string[];
  const process = t.raw("process") as ProcessStep[];
  const faq = t.raw("faq") as FaqItem[];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const procedureJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: t("title"),
    description: t("description"),
    bodyLocation: undefined,
    procedureType: "https://schema.org/SurgicalProcedure",
    provider: {
      "@type": "MedicalBusiness",
      name: siteConfig.name,
      url: `${siteConfig.url}/${locale}`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: tNav("home"),
        item: `${siteConfig.url}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: tNav("services"),
        item: `${siteConfig.url}/${locale}/services`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: t("title"),
        item: `${siteConfig.url}/${locale}/services/${slug}`,
      },
    ],
  };

  return (
    <>
      <section className="relative overflow-hidden bg-[var(--color-primary-deep)] text-white">
        <div className="absolute inset-0 -z-10">
          <SmartImage
            src={service.heroImage ?? service.image}
            alt={t("heroTitle")}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary-deep)]/95 via-[var(--color-primary-deep)]/75 to-transparent" />
        </div>
        <div className="container-content py-24 md:py-32">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-white/70">
            <Link href="/" className="hover:text-white">{tNav("home")}</Link>
            <span className="mx-2">/</span>
            <Link href="/services" className="hover:text-white">{tNav("services")}</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{t("title")}</span>
          </nav>
          <p className="label-caps text-[var(--color-accent-soft)] mb-3">
            {tNav(`categories.${service.category}`)}
          </p>
          <h1 className="font-serif text-white max-w-3xl">{t("heroTitle")}</h1>
          <p className="mt-5 text-lg md:text-xl text-white/85 max-w-2xl leading-relaxed">
            {t("heroSubtitle")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={buildWhatsAppUrl(locale as "tr" | "en" | "de")} target="_blank" rel="noopener" className="btn btn-accent">
              {tCommonRoot("writeOnWhatsapp")}
            </a>
            <a href={buildTelLink()} className="btn btn-ghost !text-white !border-white/30 hover:!bg-white/10">
              {tCommonRoot("callNow")}
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-content grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-12">
            <div className="prose-content space-y-4">
              <h2 className="font-serif text-3xl">{t("title")}</h2>
              <p className="text-lg leading-relaxed text-[var(--color-text-main)]">
                {t("description")}
              </p>
            </div>

            <div>
              <h3 className="font-serif text-2xl mb-6 text-[var(--color-text-strong)]">
                {tCommon("processTitle")}
              </h3>
              <ol className="space-y-5">
                {process.map((p, i) => (
                  <li key={i} className="flex gap-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] font-serif text-base font-semibold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-serif text-lg font-semibold text-[var(--color-text-strong)]">
                        {p.step}
                      </p>
                      <p className="mt-1 text-[var(--color-text-muted)] leading-relaxed">
                        {p.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h3 className="font-serif text-2xl mb-6 text-[var(--color-text-strong)]">
                {tCommon("faqTitle")}
              </h3>
              <div className="space-y-3">
                {faq.map((f, i) => (
                  <details
                    key={i}
                    className="group rounded-xl border border-[var(--color-border-subtle)] bg-white p-5 open:shadow-md"
                  >
                    <summary className="flex cursor-pointer items-center justify-between gap-4 font-serif text-lg text-[var(--color-text-strong)]">
                      {f.question}
                      <svg width="14" height="14" viewBox="0 0 12 12" className="shrink-0 transition-transform group-open:rotate-180">
                        <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </summary>
                    <p className="mt-3 text-[var(--color-text-muted)] leading-relaxed">
                      {f.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 self-start">
            <div className="card p-6">
              <h3 className="font-serif text-xl mb-4 text-[var(--color-text-strong)]">
                {tCommon("benefitsTitle")}
              </h3>
              <ul className="space-y-3">
                {benefits.map((b, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <svg width="20" height="20" viewBox="0 0 20 20" className="shrink-0 text-[var(--color-accent)]" aria-hidden="true">
                      <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-[var(--color-text-main)]">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-6 bg-[var(--color-primary-deep)] text-white border-[var(--color-primary-deep)]">
              <p className="label-caps text-[var(--color-accent-soft)] mb-3">
                {tCommonRoot("freeConsultation")}
              </p>
              <h3 className="font-serif text-xl text-white mb-4">{tCommon("ctaTitle")}</h3>
              <p className="text-sm text-white/75 mb-5">{tCommon("ctaSubtitle")}</p>
              <div className="flex flex-col gap-2">
                <a
                  href={buildWhatsAppUrl(locale as "tr" | "en" | "de")}
                  target="_blank"
                  rel="noopener"
                  className="btn btn-whatsapp w-full justify-center"
                >
                  {tCommonRoot("writeOnWhatsapp")}
                </a>
                <a
                  href={buildTelLink()}
                  className="btn !bg-white/10 !text-white border border-white/30 w-full justify-center hover:!bg-white/20"
                >
                  {tCommonRoot("callNow")}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <CtaSection />

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(procedureJsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}
