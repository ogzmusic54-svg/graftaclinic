/**
 * Ölçümleme kuralları — tek kaynak.
 *
 * İki bağımsız kapı var ve reklam etiketi ancak İKİSİ birden açıkken yüklenir:
 *
 *   1. Kullanıcı rızası  (AB'de yasal zorunluluk)
 *   2. Sayfa hassas değil (kendi kuralımız — sağlık verisi sızmasını önler)
 *
 * İkinci kapı rızadan bağımsızdır: kullanıcı rıza verse bile HIV veya
 * durum bazlı bir sayfada Meta Pixel yüklenmez. Sebebi, sayfanın URL'i ve
 * başlığının kendisinin GDPR Madde 9 kapsamında özel nitelikli veri
 * (sağlık durumu) ifşa etmesi.
 */

/** Reklam etiketlerinin ASLA çalışmayacağı yol parçaları. */
export const SENSITIVE_PATH_SEGMENTS = [
  "hiv-positive-hair-transplant-turkey",
  // İleride eklenecek durum bazlı sayfalar buraya yazılır:
  // "hepatitis-hair-transplant", "diabetes-hair-transplant", ...
] as const;

// Bilerek burada DEĞİL: "vertrauliche-beurteilung".
// Reklam iniş sayfasının adresinde tanı adı geçmez, bu yüzden hassas değildir
// ve pixel orada çalışır — dönüşümün ölçülebildiği tek yer orası.
// Adresi nötr kaldığı sürece HIV içeriği sayfanın gövdesinde durabilir;
// pixel'e giden veri adres ve başlıktır, gövde değil.

/**
 * Bir yolun hassas olup olmadığını söyler.
 * Locale önekinden bağımsız çalışır (/de/... , /en/... , /tr/...).
 */
export function isSensitivePath(pathname: string): boolean {
  return SENSITIVE_PATH_SEGMENTS.some((segment) => pathname.includes(segment));
}

/** Rıza tercihinin saklandığı anahtar. */
export const CONSENT_STORAGE_KEY = "grafta-consent";

export type ConsentValue = "granted" | "denied";

/** Kayıtlı rıza tercihini okur. Karar verilmemişse null döner. */
export function readStoredConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    // Gizli sekme veya site verisi engelliyse: karar verilmemiş say.
    return null;
  }
}

/** Rıza tercihini kaydeder. Yazılamazsa sessizce geçer — sayfa çalışmaya devam eder. */
export function writeStoredConsent(value: ConsentValue): void {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
  } catch {
    /* yoksay */
  }
}

/** Meta Pixel ID — tanımlı değilse pixel hiç yüklenmez. */
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";
