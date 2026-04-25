import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";
import { siteConfig, buildWhatsAppUrl, buildTelLink } from "@/config/site";
import { categoryOrder, getServicesByCategory } from "@/config/services";

export function Footer() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 bg-[var(--color-primary-deep)] text-white">
      <div className="container-content section grid gap-12 lg:grid-cols-4">
        <div className="space-y-4 lg:col-span-1">
          <Link href="/" className="inline-block" aria-label={siteConfig.name}>
            <Image
              src={siteConfig.brand.logoLight}
              alt={siteConfig.name}
              width={400}
              height={200}
              className="h-16 w-auto"
            />
          </Link>
          <p className="text-sm leading-relaxed text-white/70">{t("footer.tagline")}</p>
          <div className="flex gap-3">
            <a
              href={buildWhatsAppUrl(locale)}
              target="_blank"
              rel="noopener"
              className="btn btn-whatsapp text-xs"
            >
              {t("common.whatsapp")}
            </a>
            <a href={buildTelLink()} className="btn btn-ghost text-xs !text-white !border-white/30 hover:!bg-white/10">
              {t("common.callNow")}
            </a>
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-2 gap-8">
          <div>
            <p className="label-caps text-[var(--color-accent-soft)] mb-4">{t("footer.menu")}</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-white/80 hover:text-white">{t("nav.home")}</Link></li>
              <li><Link href="/about" className="text-white/80 hover:text-white">{t("nav.about")}</Link></li>
              <li><Link href="/services" className="text-white/80 hover:text-white">{t("nav.services")}</Link></li>
              <li><Link href="/contact" className="text-white/80 hover:text-white">{t("nav.contact")}</Link></li>
            </ul>
          </div>
          <div>
            <p className="label-caps text-[var(--color-accent-soft)] mb-4">{t("footer.ourServices")}</p>
            <ul className="space-y-2 text-sm">
              {categoryOrder.flatMap((cat) =>
                getServicesByCategory(cat).slice(0, 3).map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/services/${s.slug}`}
                      className="text-white/80 hover:text-white"
                    >
                      {t(`services.${s.slug}.title`)}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        <div>
          <p className="label-caps text-[var(--color-accent-soft)] mb-4">{t("footer.contactTitle")}</p>
          <ul className="space-y-3 text-sm text-white/80">
            <li>
              <span className="block text-white/50 text-xs uppercase tracking-wider mb-1">
                {t("common.address")}
              </span>
              {siteConfig.contact.address.street}<br />
              {siteConfig.contact.address.district}, {siteConfig.contact.address.city}<br />
              {siteConfig.contact.address.country}
            </li>
            <li>
              <span className="block text-white/50 text-xs uppercase tracking-wider mb-1">
                {t("common.phone")}
              </span>
              <a href={buildTelLink()} className="hover:text-white">
                {siteConfig.contact.phoneDisplay}
              </a>
            </li>
            <li>
              <span className="block text-white/50 text-xs uppercase tracking-wider mb-1">
                {t("common.email")}
              </span>
              <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-white">
                {siteConfig.contact.email}
              </a>
            </li>
            <li>
              <span className="block text-white/50 text-xs uppercase tracking-wider mb-1">
                {t("common.hours")}
              </span>
              {siteConfig.contact.hours[locale]}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-content flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-white/60">
            © {year} {siteConfig.brand.legalName}. {t("footer.rights")}
          </p>
          <p className="text-xs text-white/40 max-w-xl">{t("footer.disclaimer")}</p>
        </div>
      </div>
    </footer>
  );
}
