"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import {
  META_PIXEL_ID,
  isSensitivePath,
  readStoredConsent,
  type ConsentValue,
} from "@/lib/tracking";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Meta Pixel — yalnız (rıza verilmiş) VE (sayfa hassas değil) ise yüklenir.
 *
 * Rota değişiminde tekrar değerlendirilir: kullanıcı genel bir sayfadan
 * HIV sayfasına geçtiğinde yeni bir PageView GÖNDERİLMEZ.
 */
export function Analytics() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<ConsentValue | null>(null);

  useEffect(() => {
    setConsent(readStoredConsent());

    // Banner karar verdiğinde bu olayı yayınlar.
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<ConsentValue>).detail;
      setConsent(detail);
    };
    window.addEventListener("grafta:consent", onChange);
    return () => window.removeEventListener("grafta:consent", onChange);
  }, []);

  const sensitive = isSensitivePath(pathname);
  const allowed = consent === "granted" && !sensitive && Boolean(META_PIXEL_ID);

  // Rota değişiminde PageView — sadece izin verilen sayfalarda.
  useEffect(() => {
    if (!allowed || typeof window.fbq !== "function") return;
    window.fbq("track", "PageView");
  }, [allowed, pathname]);

  if (!allowed) return null;

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];
t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');
      `}
    </Script>
  );
}

/**
 * Dönüşüm olayı gönderir. Hassas sayfadan çağrılırsa hiçbir şey yapmaz.
 *
 * `custom_data` bilerek desteklenmiyor: sağlık verisinin reklam ekosistemine
 * sızdığı yer tam olarak orasıdır.
 */
export function trackEvent(name: "Contact" | "Lead" | "Schedule"): void {
  if (typeof window === "undefined") return;
  if (isSensitivePath(window.location.pathname)) return;
  if (typeof window.fbq !== "function") return;
  window.fbq("track", name);
}
