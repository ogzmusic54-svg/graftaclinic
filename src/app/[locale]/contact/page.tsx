import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { routing, hasLocale, type Locale } from "@/i18n/routing";
import { siteConfig, buildWhatsAppUrl, buildTelLink } from "@/config/site";
import { CtaSection } from "@/components/CtaSection";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "contact.meta" });

  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = `${siteConfig.url}/${l}/contact`;
  }

  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: `/${locale}/contact`, languages },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const lc = locale as Locale;

  const t = await getTranslations("contact");
  const tCommon = await getTranslations("common");

  const channels = [
    {
      title: t("channels.callTitle"),
      body: t("channels.callBody"),
      action: tCommon("callNow"),
      href: buildTelLink(),
      external: false,
      iconPath: "M3 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a8 8 0 0 0 8 8v-1a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2A16 16 0 0 1 3 5z",
    },
    {
      title: t("channels.whatsappTitle"),
      body: t("channels.whatsappBody"),
      action: tCommon("writeOnWhatsapp"),
      href: buildWhatsAppUrl(lc),
      external: true,
      iconPath: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z",
    },
    {
      title: t("channels.visitTitle"),
      body: t("channels.visitBody"),
      action: tCommon("address"),
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${siteConfig.contact.address.street}, ${siteConfig.contact.address.district}, ${siteConfig.contact.address.city}`
      )}`,
      external: true,
      iconPath: "M12 2a8 8 0 0 0-8 8c0 5.5 8 12 8 12s8-6.5 8-12a8 8 0 0 0-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z",
    },
  ];

  return (
    <>
      <section className="section bg-[var(--color-surface-clinical)] border-b border-[var(--color-border-subtle)]">
        <div className="container-content max-w-3xl">
          <span className="gold-rule" />
          <p className="label-caps text-[var(--color-accent-deep)] mb-3">{t("hero.kicker")}</p>
          <h1 className="font-serif">{t("hero.title")}</h1>
          <p className="mt-4 text-lg text-[var(--color-text-muted)]">{t("hero.subtitle")}</p>
        </div>
      </section>

      <section className="section">
        <div className="container-content grid gap-6 md:grid-cols-3">
          {channels.map((c, i) => (
            <a
              key={i}
              href={c.href}
              {...(c.external ? { target: "_blank", rel: "noopener" } : {})}
              className="card p-8 flex flex-col gap-4 group"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d={c.iconPath} />
                </svg>
              </span>
              <h2 className="font-serif text-xl text-[var(--color-text-strong)]">{c.title}</h2>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed flex-1">
                {c.body}
              </p>
              <span className="text-sm font-semibold text-[var(--color-primary)] inline-flex items-center gap-1">
                {c.action}
                <svg width="16" height="16" viewBox="0 0 16 16" className="transition-transform group-hover:translate-x-1">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="section bg-[var(--color-surface-low)]">
        <div className="container-content grid gap-10 lg:grid-cols-2">
          <div>
            <span className="gold-rule" />
            <h2 className="font-serif">{siteConfig.name}</h2>
            <ul className="mt-6 space-y-5 text-base">
              <li>
                <p className="label-caps text-[var(--color-accent-deep)] mb-1">{tCommon("address")}</p>
                <p className="text-[var(--color-text-main)]">
                  {siteConfig.contact.address.street}<br />
                  {siteConfig.contact.address.district}, {siteConfig.contact.address.city}<br />
                  {siteConfig.contact.address.country}
                </p>
              </li>
              <li>
                <p className="label-caps text-[var(--color-accent-deep)] mb-1">{tCommon("phone")}</p>
                <a href={buildTelLink()} className="text-[var(--color-primary)] font-semibold">
                  {siteConfig.contact.phoneDisplay}
                </a>
              </li>
              <li>
                <p className="label-caps text-[var(--color-accent-deep)] mb-1">{tCommon("email")}</p>
                <a href={`mailto:${siteConfig.contact.email}`} className="text-[var(--color-primary)] font-semibold">
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <p className="label-caps text-[var(--color-accent-deep)] mb-1">{tCommon("hours")}</p>
                <p className="text-[var(--color-text-main)]">
                  {siteConfig.contact.hours[lc]}
                </p>
              </li>
            </ul>
          </div>

          <div className="relative aspect-square lg:aspect-auto min-h-[420px] overflow-hidden rounded-2xl border border-[var(--color-border-subtle)]">
            {siteConfig.mapsEmbedSrc ? (
              <iframe
                src={siteConfig.mapsEmbedSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={siteConfig.name}
              />
            ) : (
              <div className="grid h-full w-full place-items-center bg-[var(--color-primary-deep)] text-white p-8 text-center">
                <div>
                  <p className="font-serif text-2xl mb-3">{siteConfig.name}</p>
                  <p className="text-sm text-white/70 max-w-xs">
                    Google Maps embed kodunu <code className="px-1 py-0.5 bg-white/10 rounded">src/config/site.ts</code> içindeki <code className="px-1 py-0.5 bg-white/10 rounded">mapsEmbedSrc</code> alanına ekleyin.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
