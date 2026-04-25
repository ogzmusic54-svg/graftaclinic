"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { useTransition } from "react";

import { routing, type Locale } from "@/i18n/routing";

const localeLabels: Record<Locale, string> = {
  tr: "TR",
  en: "EN",
  de: "DE",
};

const localeFullNames: Record<Locale, string> = {
  tr: "Türkçe",
  en: "English",
  de: "Deutsch",
};

export function LanguageSwitcher() {
  const t = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = useLocale() as Locale;
  const [pending, startTransition] = useTransition();

  function onChange(nextLocale: Locale) {
    startTransition(() => {
      router.replace(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { pathname, params } as any,
        { locale: nextLocale }
      );
    });
  }

  return (
    <div className="flex items-center gap-1" aria-label={t("languageLabel")}>
      {routing.locales.map((l) => {
        const isActive = l === currentLocale;
        return (
          <button
            key={l}
            type="button"
            onClick={() => onChange(l)}
            disabled={pending || isActive}
            title={localeFullNames[l]}
            aria-current={isActive ? "true" : undefined}
            className={`px-2.5 py-1.5 text-xs font-bold tracking-widest rounded-full transition-all ${
              isActive
                ? "bg-[var(--color-primary-deep)] text-[var(--color-accent-bright)]"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-primary-deep)] hover:bg-[var(--color-surface-low)]"
            }`}
          >
            {localeLabels[l]}
          </button>
        );
      })}
    </div>
  );
}
