import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { buildWhatsAppUrl, buildTelLink } from "@/config/site";

interface Props {
  /** "home.cta" gibi bir namespace. */
  namespace?: string;
  variant?: "default" | "compact";
}

export function CtaSection({ namespace = "home.cta", variant = "default" }: Props) {
  const t = useTranslations(namespace);
  const locale = useLocale() as Locale;

  const isCompact = variant === "compact";

  return (
    <section
      className={
        isCompact
          ? "py-16 bg-[var(--color-primary)] text-white"
          : "section bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-deep)] to-[var(--color-primary)] text-white"
      }
    >
      <div className="container-content text-center">
        <span className="gold-rule mx-auto" />
        <h2 className="font-serif text-white max-w-3xl mx-auto">{t("title")}</h2>
        <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">{t("subtitle")}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={buildWhatsAppUrl(locale)}
            target="_blank"
            rel="noopener"
            className="btn btn-accent"
          >
            {t("primary")}
          </a>
          <a
            href={buildTelLink()}
            className="btn btn-ghost !text-white !border-white/30 hover:!bg-white/10"
          >
            {t("secondary")}
          </a>
        </div>
      </div>
    </section>
  );
}
