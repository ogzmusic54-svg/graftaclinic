import { useTranslations } from "next-intl";

interface Review {
  name: string;
  country: string;
  flag: string;
  service: string;
  quote: string;
}

export function Testimonials() {
  const t = useTranslations("home.testimonials");
  const reviews = t.raw("reviews") as Review[];

  return (
    <section className="section bg-[var(--color-surface-low)]">
      <div className="container-content">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="gold-rule mx-auto" />
          <p className="label-caps text-[var(--color-accent-deep)] mb-3">{t("kicker")}</p>
          <h2 className="font-serif">{t("title")}</h2>
          <p className="mt-4 text-lg text-[var(--color-text-muted)]">{t("subtitle")}</p>

          <div className="mt-6 inline-flex items-center gap-3 bg-white px-5 py-2.5 rounded-full border border-[var(--color-border-subtle)]">
            <span className="text-[var(--color-accent)] text-lg leading-none">★★★★★</span>
            <span className="font-serif text-lg font-semibold text-[var(--color-text-strong)]">4.9 / 5</span>
            <span className="text-sm text-[var(--color-text-muted)]">({t("totalReviews")})</span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <article
              key={i}
              className="bg-white rounded-2xl border border-[var(--color-border-subtle)] p-7 hover:border-[var(--color-accent)] transition-all relative"
            >
              {/* Tırnak süsü */}
              <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="absolute top-5 right-5 text-[var(--color-accent)]/15">
                <path d="M14 17h3l2-4V7h-6v6h3M6 17h3l2-4V7H5v6h3z"/>
              </svg>

              <div className="flex items-center gap-1 text-[var(--color-accent)] text-sm mb-3">
                ★★★★★
              </div>

              <p className="text-[var(--color-text-main)] leading-relaxed text-sm mb-6 relative z-10">
                &ldquo;{r.quote}&rdquo;
              </p>

              <div className="flex items-center justify-between pt-5 border-t border-[var(--color-border-subtle)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-accent-bright)] to-[var(--color-accent-deep)] grid place-items-center text-[var(--color-primary-deep)] font-serif font-semibold">
                    {r.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <p className="font-serif text-sm text-[var(--color-text-strong)]">{r.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      <span className="mr-1">{r.flag}</span>{r.country} · {r.service}
                    </p>
                  </div>
                </div>
                <span title={t("verified")} className="inline-flex items-center gap-1 text-xs text-[var(--color-accent-deep)] font-semibold">
                  <svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
