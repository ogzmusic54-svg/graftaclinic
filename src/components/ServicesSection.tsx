import { useTranslations } from "next-intl";
import { categoryOrder, getServicesByCategory } from "@/config/services";
import { ServiceCard } from "./ServiceCard";

export function ServicesSection() {
  const t = useTranslations("home.servicesSection");
  const tNav = useTranslations("nav");

  return (
    <section className="section">
      <div className="container-content">
        <div className="max-w-2xl mb-12">
          <span className="gold-rule" />
          <p className="label-caps text-[var(--color-accent-deep)] mb-3">{t("kicker")}</p>
          <h2 className="font-serif">{t("title")}</h2>
          <p className="mt-4 text-lg text-[var(--color-text-muted)]">{t("subtitle")}</p>
        </div>

        <div className="space-y-16">
          {categoryOrder.map((cat) => {
            const items = getServicesByCategory(cat);
            return (
              <div key={cat}>
                <h3 className="font-serif text-2xl mb-6 text-[var(--color-text-strong)]">
                  {tNav(`categories.${cat}`)}
                </h3>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((s) => (
                    <ServiceCard key={s.slug} service={s} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
