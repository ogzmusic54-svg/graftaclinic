import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/Hero";
import { TrustStats } from "@/components/TrustStats";
import { WhyUs } from "@/components/WhyUs";
import { ServicesSection } from "@/components/ServicesSection";
import { ProcessSection } from "@/components/ProcessSection";
import { BeforeAfterTeaser } from "@/components/BeforeAfterTeaser";
import { Testimonials } from "@/components/Testimonials";
import { InternationalSection } from "@/components/InternationalSection";
import { TrustBadges } from "@/components/TrustBadges";
import { HomeFAQ } from "@/components/HomeFAQ";
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
      <WhyUs />
      <ServicesSection />
      <ProcessSection />
      <BeforeAfterTeaser />
      <Testimonials />
      <InternationalSection />
      <TrustBadges />
      <HomeFAQ />
      <CtaSection />
    </>
  );
}
