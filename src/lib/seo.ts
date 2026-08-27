import { routing } from "@/i18n/routing";
import { siteConfig } from "@/config/site";

/**
 * Bir sayfanın hreflang (alternates.languages) haritasını üretir.
 *
 * Hedef kitle Avrupa olduğu için `x-default` **İngilizce** sürüme işaret eder:
 * Google, ziyaretçinin dili tr/en/de ile eşleşmediğinde (Fransızca, Hollandaca,
 * İspanyolca, İtalyanca…) bu sürümü gösterir. x-default tanımlı değilse Google
 * hangi sürümü göstereceğini kendi tahmin eder ve çoğu zaman yanlış seçer.
 *
 * Bölgesel varyant (de-AT, en-GB…) bilerek eklenmedi: dil kodu zaten o dilin
 * bütün bölgelerini kapsar, aynı URL'e işaret eden fazladan etiketler yalnız
 * hata yüzeyi büyütür.
 *
 * @param path Locale önekinden SONRAKİ yol. Anasayfa için "" (boş).
 *             Örn: "/contact", "/services/hair-transplant"
 */
export function hreflangFor(path = ""): Record<string, string> {
  const languages: Record<string, string> = {};

  for (const locale of routing.locales) {
    languages[locale] = `${siteConfig.url}/${locale}${path}`;
  }

  languages["x-default"] = `${siteConfig.url}/en${path}`;

  return languages;
}

/** Kanonik URL — locale önekiyle birlikte, mutlak. */
export function canonicalFor(locale: string, path = ""): string {
  return `${siteConfig.url}/${locale}${path}`;
}
