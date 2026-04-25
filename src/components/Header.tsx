"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";
import { siteConfig, buildWhatsAppUrl } from "@/config/site";
import { categoryOrder, getServicesByCategory } from "@/config/services";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile menu kapat, sayfa değişince
  useEffect(() => {
    setMobileOpen(false);
    setOpenCategory(null);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-40 transition-all ${
        scrolled
          ? "border-b border-[var(--color-border-subtle)] bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75"
          : "bg-transparent"
      }`}
    >
      <div className="container-content flex h-20 items-center justify-between gap-6">
        <Link href="/" className="flex items-center" aria-label={siteConfig.name}>
          <Image
            src={siteConfig.brand.logoLight}
            alt={siteConfig.name}
            width={400}
            height={200}
            priority
            className="h-14 w-auto md:h-16"
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          <Link
            href="/"
            className="text-sm font-medium text-[var(--color-text-main)] hover:text-[var(--color-primary)]"
          >
            {t("nav.home")}
          </Link>

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenCategory(openCategory === "services" ? null : "services")}
              onBlur={(e) => {
                if (!e.currentTarget.parentElement?.contains(e.relatedTarget as Node)) {
                  setOpenCategory(null);
                }
              }}
              className="flex items-center gap-1 text-sm font-medium text-[var(--color-text-main)] hover:text-[var(--color-primary)]"
              aria-expanded={openCategory === "services"}
              aria-haspopup="true"
            >
              {t("nav.services")}
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {openCategory === "services" && (
              <div
                className="absolute left-1/2 top-full mt-3 w-[640px] -translate-x-1/2 rounded-2xl border border-[var(--color-border-subtle)] bg-white p-6 shadow-2xl"
                onMouseLeave={() => setOpenCategory(null)}
              >
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  {categoryOrder.map((cat) => (
                    <div key={cat}>
                      <p className="label-caps mb-3 text-[var(--color-accent-deep)]">
                        {t(`nav.categories.${cat}`)}
                      </p>
                      <ul className="space-y-2">
                        {getServicesByCategory(cat).map((s) => (
                          <li key={s.slug}>
                            <Link
                              href={`/services/${s.slug}`}
                              className="block text-sm text-[var(--color-text-main)] hover:text-[var(--color-primary)]"
                            >
                              {t(`services.${s.slug}.title`)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/about"
            className="text-sm font-medium text-[var(--color-text-main)] hover:text-[var(--color-primary)]"
          >
            {t("nav.about")}
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-[var(--color-text-main)] hover:text-[var(--color-primary)]"
          >
            {t("nav.contact")}
          </Link>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          <a href={buildWhatsAppUrl(locale)} target="_blank" rel="noopener" className="btn btn-primary">
            {t("nav.bookAppointment")}
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
          aria-expanded={mobileOpen}
          className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border-subtle)]"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
            {mobileOpen ? (
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            ) : (
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-[var(--color-border-subtle)] bg-white">
          <div className="container-content py-6 space-y-6">
            <nav className="space-y-3">
              <Link href="/" className="block text-base font-medium">
                {t("nav.home")}
              </Link>
              <details className="group">
                <summary className="flex cursor-pointer items-center justify-between text-base font-medium">
                  {t("nav.services")}
                  <svg width="14" height="14" viewBox="0 0 12 12" className="transition group-open:rotate-180">
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </summary>
                <div className="mt-3 space-y-4 pl-2">
                  {categoryOrder.map((cat) => (
                    <div key={cat}>
                      <p className="label-caps mb-2 text-[var(--color-accent-deep)]">
                        {t(`nav.categories.${cat}`)}
                      </p>
                      <ul className="space-y-2">
                        {getServicesByCategory(cat).map((s) => (
                          <li key={s.slug}>
                            <Link
                              href={`/services/${s.slug}`}
                              className="block text-sm text-[var(--color-text-main)]"
                            >
                              {t(`services.${s.slug}.title`)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </details>
              <Link href="/about" className="block text-base font-medium">
                {t("nav.about")}
              </Link>
              <Link href="/contact" className="block text-base font-medium">
                {t("nav.contact")}
              </Link>
            </nav>
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-[var(--color-border-subtle)]">
              <LanguageSwitcher />
              <a
                href={buildWhatsAppUrl(locale)}
                target="_blank"
                rel="noopener"
                className="btn btn-primary flex-1 justify-center"
              >
                {t("nav.bookAppointment")}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
