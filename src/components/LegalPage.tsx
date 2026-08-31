import type { HukukSayfasi } from "@/content/legal";

/**
 * Hukuki sayfa gövdesi (Impressum / Datenschutzerklärung).
 *
 * Tek bileşen iki sayfayı da basar: içerik `src/content/legal.ts` içinde
 * dile göre tutulur, burada yalnız sunum var. Avukat düzeltmesi geldiğinde
 * bu dosyaya dokunulmaz.
 */
export function LegalPage({ icerik }: { icerik: HukukSayfasi }) {
  return (
    <>
      <section className="bg-[var(--color-primary-deep)] text-white">
        <div className="container-content py-20 md:py-24 max-w-3xl">
          <h1 className="font-serif text-white">{icerik.baslik}</h1>
          <p className="mt-4 text-lg text-white/80 leading-relaxed">
            {icerik.aciklama}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-content max-w-3xl">
          {icerik.bolumler.map((bolum) => (
            <div key={bolum.baslik} className="mb-10 last:mb-0">
              <h2 className="font-serif text-xl md:text-2xl mb-3">
                {bolum.baslik}
              </h2>
              {bolum.paragraflar.map((p, i) => (
                <p
                  key={i}
                  className="text-[var(--color-text-muted,#4b5563)] leading-relaxed mb-2 last:mb-0"
                >
                  {p}
                </p>
              ))}
            </div>
          ))}

          <p className="mt-12 pt-6 border-t text-sm text-[var(--color-text-muted,#6b7280)]">
            {icerik.guncelleme}
          </p>
        </div>
      </section>
    </>
  );
}
