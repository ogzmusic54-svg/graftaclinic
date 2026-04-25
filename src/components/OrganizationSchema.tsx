import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/routing";

export function OrganizationSchema({ locale }: { locale: Locale }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: siteConfig.name,
    url: `${siteConfig.url}/${locale}`,
    image: `${siteConfig.url}/images/og-cover.jpg`,
    description: siteConfig.brand.tagline[locale],
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
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
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
