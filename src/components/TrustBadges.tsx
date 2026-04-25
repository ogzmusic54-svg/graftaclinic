import { useTranslations } from "next-intl";

export function TrustBadges() {
  const t = useTranslations("home.trustBadges");
  const badges = [
    { label: "ISO 9001", aria: "ISO 9001 certified" },
    { label: "TC SAĞLIK", aria: "Türkiye Sağlık Bakanlığı" },
    { label: "JCI Aligned", aria: "JCI Aligned" },
    { label: "TPRA", aria: "Türkiye Plastik Cerrahi Derneği" },
    { label: "ISHRS", aria: "International Society of Hair Restoration Surgery" },
    { label: "CE / FDA", aria: "CE FDA Certified Devices" },
  ];

  return (
    <section className="section bg-[var(--color-primary-deep)] text-white">
      <div className="container-content text-center">
        <p className="label-caps text-[var(--color-accent-soft)] mb-4">{t("title")}</p>
        <h2 className="font-serif text-white max-w-3xl mx-auto">{t("subtitle")}</h2>
        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-6">
          {badges.map((b) => (
            <div
              key={b.label}
              className="flex h-20 items-center justify-center rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-center backdrop-blur"
              aria-label={b.aria}
            >
              <span className="font-serif text-base font-medium tracking-wide text-white/90">
                {b.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
