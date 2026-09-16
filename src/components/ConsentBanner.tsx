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

  // Bant açıkken gövdeye sınıf bas: yüzen WhatsApp butonu bunu okuyup bandın
  // üstüne çıkar (WhatsAppFloat). 16.09.2026: bant butonu örtüyordu.
  useEffect(() => {
    document.body.classList.toggle("consent-open", visible);
    return () => document.body.classList.remove("consent-open");
  }, [visible]);

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
      {/* Mobilde kompakt: 16.09.2026'da bant ilk ekranın alt %23'ünü kaplıyor ve
          iniş sayfasının iletişim butonlarını örtüyordu. Metin ve butonlar
          küçüldü, boşluklar daraldı; "Kabul/Reddet" eşitliği korunuyor. */}
      <div className="mx-auto flex max-w-5xl flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-5">
        <div className="text-xs leading-snug text-white/85 sm:text-sm sm:leading-relaxed">
          <p>{t("body")}</p>
          {sensitive && (
            // Hassas sayfada reklam etiketi zaten hiç yüklenmiyor.
            // Bunu ziyaretçiye söylemek, bu kitlede en güçlü güven
            // sinyallerinden biri.
            <p className="mt-1.5 text-white/70 sm:mt-2">{t("sensitiveNote")}</p>
          )}
        </div>

        <div className="flex shrink-0 gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => decide("denied")}
            className="rounded-full border border-white/40 px-4 py-2 text-xs font-medium text-white transition hover:bg-white/10 sm:px-5 sm:py-2.5 sm:text-sm"
          >
            {t("reject")}
          </button>
          <button
            type="button"
            onClick={() => decide("granted")}
            className="rounded-full bg-white px-4 py-2 text-xs font-medium text-[var(--color-primary-deep)] transition hover:bg-white/90 sm:px-5 sm:py-2.5 sm:text-sm"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
