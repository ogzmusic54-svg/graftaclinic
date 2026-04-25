import { useTranslations } from "next-intl";

const ICONS = [
  // Uzman kadro / sertifikalı doktorlar
  "M12 2l2.39 4.84 5.34.78-3.86 3.77.91 5.31L12 14.27 7.22 16.7l.91-5.31L4.27 7.62l5.34-.78L12 2z",
  // Sterile facility / hijyen
  "M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z",
  // Sertifika / akreditasyon
  "M9 12l2 2 4-4M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  // Ömür boyu destek / garanti
  "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
];

interface Item { title: string; description: string }

export function WhyUs() {
  const t = useTranslations("home.whyUs");
  const items = t.raw("items") as Item[];

  return (
    <section className="section bg-[var(--color-surface-clinical)]">
      <div className="container-content">
        <div className="max-w-2xl mb-12">
          <span className="gold-rule" />
          <p className="label-caps text-[var(--color-accent-deep)] mb-3">{t("kicker")}</p>
          <h2 className="font-serif">{t("title")}</h2>
          <p className="mt-4 text-lg text-[var(--color-text-muted)]">{t("subtitle")}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <article
              key={i}
              className="group relative bg-white rounded-2xl border border-[var(--color-border-subtle)] p-7 transition-all hover:border-[var(--color-accent)] hover:shadow-[0_24px_56px_-16px_rgba(212,169,61,0.25)] hover:-translate-y-1"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-primary-deep)] to-[var(--color-primary)] mb-5 group-hover:from-[var(--color-accent-deep)] group-hover:to-[var(--color-accent)] transition-colors">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-accent-bright)] group-hover:text-white transition-colors">
                  <path d={ICONS[i % ICONS.length]} />
                </svg>
              </div>
              <h3 className="font-serif text-xl text-[var(--color-text-strong)] mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
