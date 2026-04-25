import { useTranslations } from "next-intl";

export function TrustStats() {
  const t = useTranslations("home.trust");
  const stats = t.raw("stats") as { value: string; label: string }[];

  return (
    <section className="border-y border-[var(--color-border-subtle)] bg-[var(--color-surface-clinical)]">
      <div className="container-content py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center md:text-left">
              <p className="font-serif text-4xl md:text-5xl font-semibold text-[var(--color-primary-deep)]">
                {s.value}
              </p>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
