import { useTranslations, useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { buildWhatsAppUrl } from "@/config/site";

const SERVICE_ICONS: Record<string, string> = {
  // Tercüman
  translator: "M5 5h14M12 3v2M9 8c-2 4-3 6-6 9M15 8c2 4 3 6 6 9M9 14h6",
  // Otel + transfer (yıldız + araba)
  hotel: "M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6",
  // Havalimanı transfer (uçak)
  transfer: "M2 16l8-2 4-7 2 1-3 7 7 1v2l-9-1-3 6-2-1 1-5-5-1z",
  // VIP karşılama (rozet)
  vip: "M12 2l2.5 5 5.5 1-4 4 1 5.5L12 15l-5 2.5 1-5.5-4-4 5.5-1L12 2z",
  // Ücretsiz konsültasyon (mesaj)
  consultation: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z",
  // Garanti / sigorta (kalkan)
  warranty: "M12 2L4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4z",
};

interface Item { key: keyof typeof SERVICE_ICONS; title: string; description: string }

export function InternationalSection() {
  const t = useTranslations("home.international");
  const locale = useLocale() as Locale;
  const items = t.raw("items") as Item[];
  const stats = t.raw("stats") as { value: string; label: string }[];

  return (
    <section className="section bg-[var(--color-primary-deep)] text-white relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(212,169,61,0.18),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(212,169,61,0.1),transparent_40%)]"
      />

      <div className="container-content relative">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="gold-rule" />
            <p className="label-caps text-[var(--color-accent-soft)] mb-3">{t("kicker")}</p>
            <h2 className="font-serif text-white">{t("title")}</h2>
            <p className="mt-5 text-lg text-white/80 leading-relaxed">{t("subtitle")}</p>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {stats.map((s, i) => (
                <div key={i} className="text-center sm:text-left">
                  <p className="font-serif text-3xl text-[var(--color-accent-bright)]">{s.value}</p>
                  <p className="mt-1 text-xs text-white/70 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>

            <a
              href={buildWhatsAppUrl(locale)}
              target="_blank"
              rel="noopener"
              className="btn btn-accent mt-8"
            >
              {t("cta")}
            </a>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((item, i) => (
              <div
                key={i}
                className="rounded-xl bg-white/5 border border-white/10 backdrop-blur p-5 transition-colors hover:bg-white/10 hover:border-[var(--color-accent)]/40"
              >
                <div className="w-11 h-11 rounded-lg bg-[var(--color-accent)]/15 grid place-items-center mb-3">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-accent-bright)]" aria-hidden="true">
                    <path d={SERVICE_ICONS[item.key] ?? SERVICE_ICONS.consultation} />
                  </svg>
                </div>
                <h3 className="font-serif text-base text-white mb-1.5">{item.title}</h3>
                <p className="text-xs text-white/65 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
