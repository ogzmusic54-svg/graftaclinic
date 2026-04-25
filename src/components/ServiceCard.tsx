import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { SmartImage } from "./SmartImage";
import type { Service } from "@/config/services";

export function ServiceCard({ service }: { service: Service }) {
  const t = useTranslations();
  const title = t(`services.${service.slug}.title`);
  const description = t(`services.${service.slug}.shortDescription`);

  return (
    <Link
      href={`/services/${service.slug}`}
      className="card group flex flex-col"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <SmartImage
          src={service.image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 400px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary-deep)]/60 via-transparent to-transparent" />
      </div>
      <div className="p-6 flex flex-col gap-3 flex-1">
        <p className="label-caps text-[var(--color-accent-deep)]">
          {t(`nav.categories.${service.category}`)}
        </p>
        <h3 className="font-serif text-2xl text-[var(--color-text-strong)]">{title}</h3>
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed flex-1">
          {description}
        </p>
        <span className="text-sm font-semibold text-[var(--color-primary)] inline-flex items-center gap-1 mt-2">
          {t("common.learnMore")}
          <svg width="16" height="16" viewBox="0 0 16 16" className="transition-transform group-hover:translate-x-1">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
    </Link>
  );
}
