import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";
import { buildWhatsAppUrl, buildTelLink, siteConfig } from "@/config/site";
import { SmartImage } from "./SmartImage";

export function Hero() {
  const t = useTranslations("home.hero");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <SmartImage
          src="/images/hero.jpg"
          alt={siteConfig.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary-deep)]/85 via-[var(--color-primary-deep)]/65 to-[var(--color-primary-deep)]/85" />
      </div>

      <div className="container-content py-28 md:py-40 lg:py-48 text-white">
        <div className="max-w-3xl space-y-7">
          <p className="label-caps text-[var(--color-accent-soft)]">{t("kicker")}</p>
          <h1 className="font-serif text-white whitespace-pre-line">{t("title")}</h1>
          <p className="text-lg md:text-xl text-white/85 leading-relaxed max-w-2xl">
            {t("subtitle")}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={buildWhatsAppUrl(locale)}
              target="_blank"
              rel="noopener"
              className="btn btn-accent"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"/>
              </svg>
              {t("primaryCta")}
            </a>
            <Link href="/services" className="btn btn-ghost !text-white !border-white/30 hover:!bg-white/10">
              {t("secondaryCta")}
            </Link>
            <a
              href={buildTelLink()}
              className="btn !text-white !bg-transparent hover:!bg-white/10 underline underline-offset-4 decoration-[var(--color-accent)]"
            >
              {tCommon("callNow")}
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-white/80 border-t border-white/10 pt-6">
            {(t.raw("badges") as string[]).map((badge, i) => (
              <span key={i} className="inline-flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 20 20" className="text-[var(--color-accent-bright)] shrink-0" aria-hidden="true">
                  <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
