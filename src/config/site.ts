/**
 * Grafta Clinic — site geneli ayarlar.
 *
 * BURAYI DOLDURUN: telefon, WhatsApp, e-posta, adres, sosyal medya.
 * Bütün sayfalar ve footer otomatik olarak bu dosyadan okur.
 */
export const siteConfig = {
  name: "Grafta Clinic",
  brand: {
    legalName: "Grafta Clinic",
    tagline: {
      tr: "Saç Ekimi & Estetik Tıp Merkezi",
      en: "Hair Restoration & Aesthetic Medicine Center",
      de: "Haartransplantation & Ästhetische Medizin",
    },
    logoLight: "/images/graftalogo.png",
    logoDark: "/images/graftalogo.png",
    /** Yalnızca amblem (yazısız). Marka adı canlı metin olarak yazılır — her
     *  ekran çözünürlüğünde net görünür. */
    logoMark: "/images/logo-mark.png",
  },

  // Üretim domaini — sitemap, hreflang, canonical ve OpenGraph URL'leri buradan üretilir.
  //
  // ⚠️ 31.08.2026'da `www.graftaclinic.com` ADRESİ ÇALIŞMIYOR:
  // TLS sertifikası geçersiz (self-signed) ve sunucu 503 dönüyor. Buna karşın
  // canonical, sitemap ve hreflang'lar www'ye işaret ediyordu — yani Google'a
  // her sayfanın "asıl adresi" olarak çalışmayan bir host gösteriliyordu.
  // Apex (www'suz) sağlıklı çalıştığı için kanonik host apex'e alındı.
  //
  // Hosting tarafında www düzeltilir ve apex'e yönlendirilirse burası
  // değiştirilmeden kalabilir — tek kanonik host apex olsun.
  url: "https://graftaclinic.com",

  // ───── İletişim — bu üç alanı doldurun ─────
  contact: {
    // Uluslararası format, boşluk yok. Örn: +905555555555
    phone: "+905076473434",
    phoneDisplay: "0507 647 34 34",

    // WhatsApp numarası, başında + olmadan sadece rakam. Örn: 905555555555
    whatsapp: "905076473434",
    whatsappMessage: {
      tr: "Merhaba, Grafta Clinic web sitesinden ulaşıyorum. Bilgi almak istiyorum.",
      en: "Hello, I'm reaching out via the Grafta Clinic website. I'd like more information.",
      de: "Hallo, ich melde mich über die Grafta Clinic Website. Ich möchte gerne mehr Informationen.",
    },
    // Reklam iniş sayfasının KENDİ ön-metni. Genel metin "bilgi almak istiyorum"
    // der; reklamdan gelen kişi ise tanımlı bir talep taşımalı — reklamın CTA'sı
    // ile aynı dil ("vertrauliche Vorprüfung anfragen"). Site geneline yayılmaz.
    landingWhatsappMessage: "Hallo, ich möchte eine vertrauliche Vorprüfung anfragen.",

    email: "info@graftaclinic.com",

    // TODO: Müşteriden adres gelince bu dört satırı güncelle
    // Sokak/bina bilgisi geldiğinde `street` güncellenecek.
    address: {
      street: "Eyüpsultan",
      district: "Eyüpsultan",
      city: "İstanbul",
      country: "Türkiye",
      postalCode: "",
    },

    // Çalışma saatleri — istediğiniz formatta yazın, footer'da olduğu gibi gösterilir
    hours: {
      tr: "Pazartesi – Cumartesi · 09:00 – 19:00",
      en: "Monday – Saturday · 09:00 – 19:00",
      de: "Montag – Samstag · 09:00 – 19:00",
    },
  },

  // ───── Sosyal medya — kullanmadığınızı boş bırakın ─────
  social: {
    instagram: "https://instagram.com/graftaclinic",
    facebook: "",
    tiktok: "",
    youtube: "",
    linkedin: "",
  },

  // ───── Google haritalar embed kodu — opsiyonel ─────
  // Maps'ten "Embed a map" → src="..." kısmını alın ve buraya yapıştırın
  mapsEmbedSrc: "",
} as const;

export type SiteConfig = typeof siteConfig;

/** WhatsApp linkini locale'e göre üretir; `message` verilirse genel ön-metnin yerine geçer. */
export function buildWhatsAppUrl(locale: "tr" | "en" | "de", message?: string): string {
  const text = encodeURIComponent(message ?? siteConfig.contact.whatsappMessage[locale]);
  return `https://wa.me/${siteConfig.contact.whatsapp}?text=${text}`;
}

/** Reklam iniş sayfasının yolu (locale öneki olmadan). */
export const LANDING_PATH = "/vertrauliche-beurteilung";

/**
 * Sayfaya göre WhatsApp linki: iniş sayfasındaysak onun ön-metni, değilse genel.
 * Header ve yüzen buton gibi site geneli bileşenler bunu kullanır.
 */
export function buildWhatsAppUrlForPath(locale: "tr" | "en" | "de", pathname: string): string {
  const onLanding = pathname.includes(LANDING_PATH);
  return buildWhatsAppUrl(locale, onLanding ? siteConfig.contact.landingWhatsappMessage : undefined);
}

export function buildTelLink(): string {
  return `tel:${siteConfig.contact.phone}`;
}
