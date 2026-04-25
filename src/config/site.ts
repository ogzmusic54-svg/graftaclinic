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
  },

  // Üretim domaini — sitemap, hreflang ve OpenGraph URL'leri buradan üretilir
  url: "https://www.graftaclinic.com",

  // ───── İletişim — bu üç alanı doldurun ─────
  contact: {
    // Uluslararası format, boşluk yok. Örn: +905555555555
    phone: "+905555555555",
    phoneDisplay: "+90 555 555 55 55",

    // WhatsApp numarası, başında + olmadan sadece rakam. Örn: 905555555555
    whatsapp: "905555555555",
    whatsappMessage: {
      tr: "Merhaba, Grafta Clinic web sitesinden ulaşıyorum. Bilgi almak istiyorum.",
      en: "Hello, I'm reaching out via the Grafta Clinic website. I'd like more information.",
      de: "Hallo, ich melde mich über die Grafta Clinic Website. Ich möchte gerne mehr Informationen.",
    },

    email: "info@graftaclinic.com",

    address: {
      street: "Klinik adresi — sokak, no",
      district: "İlçe",
      city: "İstanbul",
      country: "Türkiye",
      postalCode: "34000",
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

/** WhatsApp linkini locale'e göre üretir. */
export function buildWhatsAppUrl(locale: "tr" | "en" | "de"): string {
  const text = encodeURIComponent(siteConfig.contact.whatsappMessage[locale]);
  return `https://wa.me/${siteConfig.contact.whatsapp}?text=${text}`;
}

export function buildTelLink(): string {
  return `tel:${siteConfig.contact.phone}`;
}
