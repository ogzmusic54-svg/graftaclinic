"use client";

import type { ReactNode } from "react";
import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";
import { buildWhatsAppUrlForPath } from "@/config/site";

interface WhatsAppLinkProps {
  className?: string;
  children: ReactNode;
}

/**
 * Yola duyarlı WhatsApp bağlantısı: reklam iniş sayfasında onun ön-metnini,
 * diğer sayfalarda genel metni taşır. Sunucu bileşenleri (Footer gibi) yolu
 * bilemediği için bu küçük istemci parçasını kullanır.
 */
export function WhatsAppLink({ className, children }: WhatsAppLinkProps) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  return (
    <a href={buildWhatsAppUrlForPath(locale, pathname)} target="_blank" rel="noopener" className={className}>
      {children}
    </a>
  );
}
