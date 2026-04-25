import { useTranslations } from "next-intl";
import { SmartImage } from "./SmartImage";

interface Doctor {
  name: string;
  specialty: string;
  bio: string;
}

export function DoctorsSection() {
  const t = useTranslations("home.doctors");
  const team = t.raw("team") as Doctor[];

  return (
    <section className="section bg-[var(--color-surface-low)]">
      <div className="container-content">
        <div className="max-w-2xl mb-12">
          <span className="gold-rule" />
          <p className="label-caps text-[var(--color-accent-deep)] mb-3">{t("kicker")}</p>
          <h2 className="font-serif">{t("title")}</h2>
          <p className="mt-4 text-lg text-[var(--color-text-muted)]">{t("subtitle")}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {team.map((doc, i) => (
            <article
              key={i}
              className="card p-0"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <SmartImage
                  src={`/images/doctors/doctor-${i + 1}.jpg`}
                  alt={doc.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl text-[var(--color-text-strong)]">{doc.name}</h3>
                <p className="text-sm font-medium text-[var(--color-accent-deep)] mt-1">
                  {doc.specialty}
                </p>
                <p className="mt-3 text-sm text-[var(--color-text-muted)] leading-relaxed">
                  {doc.bio}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
