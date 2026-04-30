import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/routing";

export function OrganizationSchema({ locale }: { locale: Locale }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
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
    areaServed: [
      { "@type": "Country", name: "Türkiye" },
      { "@type": "Country", name: "Germany" },
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "Country", name: "United States" },
      { "@type": "Place", name: "Europe" },
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
        availableLanguage: ["Turkish", "English", "German"],
        areaServed: ["TR", "DE", "GB", "US"],
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
