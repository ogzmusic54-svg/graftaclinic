import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { routing, hasLocale, type Locale } from "@/i18n/routing";
import { siteConfig, buildWhatsAppUrl } from "@/config/site";
import { AnfrageForm } from "@/components/AnfrageForm";

/**
 * Reklam iniş sayfası — NÖTR ADRES.
 *
 * Adreste tanı adı geçmediği için bu sayfa `SENSITIVE_PATH_SEGMENTS` içinde
 * DEĞİLDİR ve pixel (rıza varsa) çalışır. Bu bilinçli: dönüşüm ancak burada
 * ölçülebilir. Pixel'e giden veri sayfanın adresi ve başlığıdır — sayfanın
 * gövdesi değil. Bkz. `seo-icerik-plani.md` §2.
 *
 * Sadece Almanca yayınlanır: kampanya DE + AT, tek dil. Diğer dillerde 404.
 * `robots: noindex` — bu sayfa organik aramada `/de/hiv-...` sayfasıyla
 * yarışmamalı; trafiği reklamdan ve topluluk bağlantılarından gelir.
 */

const SLUG = "vertrauliche-beurteilung";
const PAGE_LOCALE: Locale = "de";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return [{ locale: PAGE_LOCALE }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== PAGE_LOCALE) return {};

  const t = await getTranslations({ locale, namespace: "vertraulich.meta" });
  const url = `${siteConfig.url}/${locale}/${SLUG}`;

  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: `/${locale}/${SLUG}` },
    openGraph: {
      type: "website",
      locale: "de_DE",
      url,
      siteName: siteConfig.name,
      title: t("title"),
      description: t("description"),
    },
    // Reklam sayfası: indekslenmez, ama iç bağlantılar takip edilir.
    robots: { index: false, follow: true },
  };
}

interface NamedItem { title: string; description: string }
interface StepItem { step: string; title: string; description: string }
interface FaqItem { question: string; answer: string }

export default async function VertraulicheBeurteilungPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale) || locale !== PAGE_LOCALE) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("vertraulich");

  const chips = t.raw("hero.chips") as string[];
  const reasons = t.raw("reasons.items") as NamedItem[];
  const protocolItems = t.raw("protocol.items") as NamedItem[];
  const steps = t.raw("steps.items") as StepItem[];
  const privacyItems = t.raw("privacy.items") as string[];
  const whatsappPoints = t.raw("channels.whatsappPoints") as string[];
  const faqItems = t.raw("faq.items") as FaqItem[];

  const url = `${siteConfig.url}/${locale}/${SLUG}`;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": url,
    url,
    name: t("hero.title"),
    description: t("meta.description"),
    inLanguage: "de",
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
          <p className="label-caps text-[var(--color-accent-soft)] mb-3">{t("hero.kicker")}</p>
          <h1 className="font-serif text-white max-w-4xl">{t("hero.title")}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/85 md:text-xl">
            {t("hero.subtitle")}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={buildWhatsAppUrl(PAGE_LOCALE)}
              target="_blank"
              rel="noopener"
              className="btn btn-accent"
            >
              {t("hero.primaryCta")}
            </a>
            <a
              href="#anfrage"
              className="btn btn-ghost !border-white/30 !text-white hover:!bg-white/10"
            >
              {t("hero.secondaryCta")}
            </a>
          </div>
          <p className="mt-4 text-sm text-white/65">{t("hero.note")}</p>

          <ul className="mt-10 flex flex-wrap gap-3" aria-label="Trust signals">
            {chips.map((c) => (
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
          <p className="text-lg leading-relaxed text-[var(--color-text-main)]">{t("intro.body")}</p>
          <p className="text-lg leading-relaxed text-[var(--color-text-main)]">{t("intro.body2")}</p>
        </div>
      </section>

      {/* WARUM ABGELEHNT */}
      <section className="section border-y border-[var(--color-border-subtle)] bg-[var(--color-surface-clinical)]">
        <div className="container-content">
          <div className="max-w-3xl">
            <span className="gold-rule" />
            <h2 className="font-serif">{t("reasons.title")}</h2>
            <p className="mt-4 text-lg text-[var(--color-text-muted)]">{t("reasons.subtitle")}</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {reasons.map((item, i) => (
              <article key={item.title} className="card bg-white p-6">
                <span className="font-serif text-3xl text-[var(--color-accent-deep)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-serif text-xl text-[var(--color-text-strong)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-10 max-w-3xl font-serif text-xl text-[var(--color-text-strong)]">
            {t("reasons.closing")}
          </p>
        </div>
      </section>

      {/* PROTOKOLL */}
      <section className="section">
        <div className="container-content">
          <div className="max-w-3xl">
            <span className="gold-rule" />
            <h2 className="font-serif">{t("protocol.title")}</h2>
            <p className="mt-4 text-lg text-[var(--color-text-muted)]">{t("protocol.subtitle")}</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {protocolItems.map((item) => (
              <article
                key={item.title}
                className="card flex gap-5 bg-[var(--color-surface-elevated)] p-6"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-deep)]">
                  <svg width="18" height="18" viewBox="0 0 20 20" className="text-[var(--color-accent)]" aria-hidden="true">
                    <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <h3 className="font-serif text-xl text-[var(--color-text-strong)]">{item.title}</h3>
                  <p className="mt-2 leading-relaxed text-[var(--color-text-muted)]">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-8 text-sm uppercase tracking-wide text-[var(--color-text-muted)]">
            {t("protocol.credentials")}
          </p>
        </div>
      </section>

      {/* ABLAUF */}
      <section className="section border-y border-[var(--color-border-subtle)] bg-[var(--color-surface-clinical)]">
        <div className="container-content max-w-4xl">
          <span className="gold-rule" />
          <h2 className="font-serif">{t("steps.title")}</h2>
          <ol className="mt-12 space-y-6">
            {steps.map((step, i) => (
              <li
                key={step.title}
                className="card grid items-start gap-4 bg-white p-6 md:grid-cols-[140px_1fr]"
              >
                <div>
                  <span className="label-caps text-[var(--color-accent-deep)]">{step.step}</span>
                  <p className="mt-1 font-serif text-2xl text-[var(--color-text-strong)]">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                </div>
                <div>
                  <h3 className="font-serif text-xl text-[var(--color-text-strong)]">{step.title}</h3>
                  <p className="mt-2 leading-relaxed text-[var(--color-text-muted)]">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-10 font-serif text-2xl text-[var(--color-text-strong)]">
            {t("steps.closing")}
          </p>
        </div>
      </section>

      {/* DATENSCHUTZ */}
      <section className="section bg-[var(--color-primary-deep)] text-white">
        <div className="container-content max-w-4xl">
          <span className="gold-rule" />
          <h2 className="font-serif text-white">{t("privacy.title")}</h2>
          <ul className="mt-10 grid gap-3 md:grid-cols-2">
            {privacyItems.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  className="mt-0.5 shrink-0 text-[var(--color-accent-bright)]"
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
                <span className="text-sm leading-relaxed text-white/85">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ZWEI WEGE + FORMULAR */}
      <section id="anfrage" className="section scroll-mt-24">
        <div className="container-content">
          <div className="max-w-3xl">
            <span className="gold-rule" />
            <h2 className="font-serif">{t("channels.title")}</h2>
            <p className="mt-4 text-lg text-[var(--color-text-muted)]">{t("channels.subtitle")}</p>
          </div>

          {/* items-stretch (varsayılan): iki kanal aynı yükseklikte durur.
              WhatsApp kartı formun yanında küçük kalırsa "asıl yol form"
              sinyali verir — oysa ikisi eşit seçenek. */}
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {/* WhatsApp — formla eşit ağırlıkta */}
            <div className="card flex h-full flex-col bg-[var(--color-surface-elevated)] p-6 md:p-8">
              <h3 className="font-serif text-2xl text-[var(--color-text-strong)]">
                {t("channels.whatsappTitle")}
              </h3>
              <p className="mt-3 leading-relaxed text-[var(--color-text-muted)]">
                {t("channels.whatsappBody")}
              </p>
              <p className="mt-4 rounded-lg border border-[var(--color-border-subtle)] bg-white p-4 text-sm leading-relaxed text-[var(--color-text-muted)]">
                {t("channels.whatsappCaveat")}
              </p>

              <p className="mt-6 label-caps text-[var(--color-accent-deep)]">
                {t("channels.whatsappPointsTitle")}
              </p>
              <ul className="mt-3 space-y-2.5">
                {whatsappPoints.map((point) => (
                  <li key={point} className="flex gap-3 text-[var(--color-text-muted)]">
                    <svg width="18" height="18" viewBox="0 0 20 20" className="mt-1 shrink-0 text-[var(--color-accent-deep)]" aria-hidden="true">
                      <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-6">
                <a
                  href={buildWhatsAppUrl(PAGE_LOCALE)}
                  target="_blank"
                  rel="noopener"
                  className="btn btn-accent w-full"
                >
                  {t("channels.whatsappCta")}
                </a>
              </div>
              <p className="mt-4 text-sm text-[var(--color-text-muted)]">
                {siteConfig.contact.hours.de}
              </p>
            </div>

            <AnfrageForm />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-clinical)]">
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
                  <svg width="14" height="14" viewBox="0 0 12 12" className="shrink-0 transition-transform group-open:rotate-180">
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </summary>
                <p className="mt-3 leading-relaxed text-[var(--color-text-muted)]">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
