import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/routing";

export function OrganizationSchema({ locale }: { locale: Locale }) {
  const data = {
    "@context": "https://schema.org",
    // MedicalClinic, MedicalBusiness'ın alt tipi ve daha spesifik.
    // İkisini birden vermek arama motorlarına en dar sınıflandırmayı sağlar.
    "@type": ["MedicalClinic", "MedicalBusiness"],
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    legalName: siteConfig.brand.legalName,
    url: `${siteConfig.url}/${locale}`,
    image: `${siteConfig.url}/images/og-cover.jpg`,
    logo: `${siteConfig.url}/images/graftalogo.png`,
    description: siteConfig.brand.tagline[locale],
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    priceRange: "$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.address.street,
      addressLocality: siteConfig.contact.address.city,
      addressRegion: siteConfig.contact.address.district,
      postalCode: siteConfig.contact.address.postalCode,
      addressCountry: "TR",
    },
    sameAs: Object.values(siteConfig.social).filter(Boolean),
    medicalSpecialty: [
      "Plastic Surgery",
      "Dermatology",
      "Hair Restoration",
      "Aesthetic Medicine",
    ],
    knowsLanguage: ["tr", "en", "de"],
    currenciesAccepted: "EUR",
    // Hedef kitle Avrupa. ABD kaldırıldı — o pazara hizmet vermiyoruz ve
    // alakasız ülke listelemek konu sinyalini zayıflatıyor.
    areaServed: [
      { "@type": "Place", name: "Europe" },
      { "@type": "Country", name: "Germany" },
      { "@type": "Country", name: "Austria" },
      { "@type": "Country", name: "Switzerland" },
      { "@type": "Country", name: "Netherlands" },
      { "@type": "Country", name: "Belgium" },
      { "@type": "Country", name: "France" },
      { "@type": "Country", name: "Ireland" },
      { "@type": "Country", name: "Luxembourg" },
      { "@type": "Country", name: "United Kingdom" },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "19:00",
      },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: siteConfig.contact.phone,
        email: siteConfig.contact.email,
        contactType: "customer service",
        availableLanguage: ["English", "German", "Turkish"],
        areaServed: ["DE", "AT", "CH", "NL", "BE", "FR", "IE", "LU", "GB"],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
