"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import {
  isSensitivePath,
  readStoredConsent,
  writeStoredConsent,
  type ConsentValue,
} from "@/lib/tracking";

/**
 * Çerez rıza bandı — AB/AEA ziyaretçileri için yasal zorunluluk.
 *
 * Tasarım kararı: "Kabul et" ve "Reddet" **eşit görünürlükte**. Reddi
 * zorlaştıran karanlık desen (küçük link, gri buton) AB veri koruma
 * otoritelerinin yaptırım uyguladığı bir konu — ve mahremiyet üzerine
 * kurulu bir konumlandırmayla da çelişirdi.
 */
export function ConsentBanner() {
  const t = useTranslations("consent");
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Karar verilmemişse göster.
    setVisible(readStoredConsent() === null);
  }, []);

  const decide = (value: ConsentValue) => {
    writeStoredConsent(value);
    setVisible(false);

    // Google Consent Mode v2 sinyalini güncelle
    window.gtag?.("consent", "update", {
      ad_storage: value,
      ad_user_data: value,
      ad_personalization: value,
      analytics_storage: value,
    });

    // Analytics bileşenini haberdar et
    window.dispatchEvent(new CustomEvent<ConsentValue>("grafta:consent", { detail: value }));
  };

  if (!visible) return null;

  const sensitive = isSensitivePath(pathname);

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t("title")}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--color-border-subtle)] bg-[var(--color-primary-deep)] text-white"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm leading-relaxed text-white/85">
          <p>{t("body")}</p>
          {sensitive && (
            // Hassas sayfada reklam etiketi zaten hiç yüklenmiyor.
            // Bunu ziyaretçiye söylemek, bu kitlede en güçlü güven
            // sinyallerinden biri.
            <p className="mt-2 text-white/70">{t("sensitiveNote")}</p>
          )}
        </div>

        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => decide("denied")}
            className="rounded-full border border-white/40 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
          >
            {t("reject")}
          </button>
          <button
            type="button"
            onClick={() => decide("granted")}
            className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-[var(--color-primary-deep)] transition hover:bg-white/90"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
