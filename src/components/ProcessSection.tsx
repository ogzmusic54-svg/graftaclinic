import { useTranslations } from "next-intl";

interface Step { title: string; description: string; duration?: string }

export function ProcessSection() {
  const t = useTranslations("home.process");
  const steps = t.raw("steps") as Step[];

  return (
    <section className="section bg-[var(--color-primary-deep)] text-white relative overflow-hidden">
      {/* Subtil altın ışıma */}
      <div
        aria-hidden="true"
        className="absolute -top-1/4 right-0 w-2/3 h-2/3 bg-[radial-gradient(circle_at_70%_30%,rgba(212,169,61,0.15),transparent_60%)] pointer-events-none"
      />
      <div className="container-content relative">
        <div className="max-w-2xl mb-14">
          <span className="gold-rule" />
          <p className="label-caps text-[var(--color-accent-soft)] mb-3">{t("kicker")}</p>
          <h2 className="font-serif text-white">{t("title")}</h2>
          <p className="mt-4 text-lg text-white/75">{t("subtitle")}</p>
        </div>

        <ol className="grid gap-y-12 gap-x-8 md:grid-cols-2 lg:grid-cols-4 relative">
          {/* Bağlayıcı çizgi (sadece desktop) */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-7 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/40 to-transparent"
          />
          {steps.map((step, i) => (
            <li key={i} className="relative">
              <div className="flex flex-col items-start">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--color-accent-bright)] via-[var(--color-accent)] to-[var(--color-accent-deep)] grid place-items-center font-serif text-2xl font-semibold text-[var(--color-primary-deep)] shadow-[0_8px_24px_-6px_rgba(212,169,61,0.5)]">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
                {step.duration && (
                  <span className="mt-4 inline-block text-xs uppercase tracking-widest text-[var(--color-accent-soft)] font-semibold">
                    {step.duration}
                  </span>
                )}
                <h3 className="mt-3 font-serif text-xl text-white">{step.title}</h3>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
