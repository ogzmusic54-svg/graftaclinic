import { useTranslations, useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { buildWhatsAppUrl } from "@/config/site";

interface FaqItem { question: string; answer: string }

export function HomeFAQ() {
  const t = useTranslations("home.faq");
  const locale = useLocale() as Locale;
  const items = t.raw("items") as FaqItem[];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <section className="section">
      <div className="container-content">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div>
            <span className="gold-rule" />
            <p className="label-caps text-[var(--color-accent-deep)] mb-3">{t("kicker")}</p>
            <h2 className="font-serif">{t("title")}</h2>
            <p className="mt-4 text-[var(--color-text-muted)] leading-relaxed">{t("subtitle")}</p>

            <a
              href={buildWhatsAppUrl(locale)}
              target="_blank"
              rel="noopener"
              className="btn btn-primary mt-6"
            >
              {t("cta")}
            </a>
          </div>

          <div className="space-y-3">
            {items.map((item, i) => (
              <details
                key={i}
                className="group rounded-xl border border-[var(--color-border-subtle)] bg-white p-5 open:shadow-md open:border-[var(--color-accent)]/40 transition-colors"
                {...(i === 0 ? { open: true } : {})}
              >
                <summary className="flex cursor-pointer items-start justify-between gap-4 font-serif text-lg text-[var(--color-text-strong)] list-none">
                  <span className="flex-1">{item.question}</span>
                  <span className="shrink-0 w-7 h-7 rounded-full bg-[var(--color-surface-low)] grid place-items-center transition-transform group-open:rotate-45 group-open:bg-[var(--color-accent)] group-open:text-[var(--color-primary-deep)]">
                    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                      <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 text-sm text-[var(--color-text-muted)] leading-relaxed">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </section>
  );
}
