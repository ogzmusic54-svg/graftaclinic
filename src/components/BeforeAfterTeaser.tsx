import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { SmartImage } from "./SmartImage";

interface Item { service: string; months: string; image: string }

export function BeforeAfterTeaser() {
  const t = useTranslations("home.results");

  const items: Item[] = [
    { service: t("items.0.service"), months: t("items.0.months"), image: "/images/results/result-1.png" },
    { service: t("items.1.service"), months: t("items.1.months"), image: "/images/results/result-2.png" },
    { service: t("items.2.service"), months: t("items.2.months"), image: "/images/results/result-3.png" },
  ];

  return (
    <section className="section">
      <div className="container-content">
        <div className="flex flex-col gap-6 mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="gold-rule" />
            <p className="label-caps text-[var(--color-accent-deep)] mb-3">{t("kicker")}</p>
            <h2 className="font-serif">{t("title")}</h2>
            <p className="mt-4 text-lg text-[var(--color-text-muted)]">{t("subtitle")}</p>
          </div>
          <Link href="/results" className="btn btn-ghost shrink-0">
            {t("viewAll")}
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item, i) => (
            <article key={i} className="card group">
              <div className="relative aspect-square overflow-hidden">
                <SmartImage
                  src={item.image}
                  alt={`${item.service} — ${t("beforeAfter")}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary-deep)]/70 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 right-4 flex justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-white/90 text-xs font-bold text-[var(--color-text-strong)] uppercase tracking-wider">
                    {t("before")}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[var(--color-accent)] text-xs font-bold text-[var(--color-primary-deep)] uppercase tracking-wider">
                    {t("after")}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="font-serif text-lg leading-tight">{item.service}</p>
                  <p className="text-xs text-white/80 mt-1">{item.months}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-8 text-xs text-center text-[var(--color-text-muted)] max-w-2xl mx-auto">
          {t("disclaimer")}
        </p>
      </div>
    </section>
  );
}
