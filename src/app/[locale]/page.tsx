import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/Hero";
import { TrustStats } from "@/components/TrustStats";
import { ServicesSection } from "@/components/ServicesSection";
import { DoctorsSection } from "@/components/DoctorsSection";
import { TrustBadges } from "@/components/TrustBadges";
import { CtaSection } from "@/components/CtaSection";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <TrustStats />
      <ServicesSection />
      <DoctorsSection />
      <TrustBadges />
      <CtaSection />
    </>
  );
}
