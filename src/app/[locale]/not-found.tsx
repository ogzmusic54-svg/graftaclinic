import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function LocaleNotFound() {
  const t = useTranslations("common");

  return (
    <section className="min-h-[70vh] grid place-items-center bg-[var(--color-primary-deep)] text-white">
      <div className="container-content text-center max-w-xl">
        <p className="label-caps text-[var(--color-accent-soft)] mb-4">404</p>
        <h1 className="font-serif text-white">
          Sayfa bulunamadı / Page not found
        </h1>
        <p className="mt-4 text-white/70">
          Aradığınız sayfa taşınmış veya silinmiş olabilir.
        </p>
        <Link href="/" className="btn btn-accent mt-8 inline-flex">
          {t("back")}
        </Link>
      </div>
    </section>
  );
}
