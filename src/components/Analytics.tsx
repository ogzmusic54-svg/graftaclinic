"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import {
  GOOGLE_ADS_CONVERSION_CURRENCY,
  GOOGLE_ADS_CONVERSION_LABEL,
  GOOGLE_ADS_CONVERSION_VALUE,
  GOOGLE_ADS_ID,
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

  /**
   * Reklam etiketlerinin ortak zemini: rıza verilmiş VE sayfa hassas değil.
   * Her etiket ayrıca kendi kimliğinin tanımlı olmasını şart koşar.
   */
  const izinliZemin = consent === "granted" && !sensitive;
  const allowed = izinliZemin && Boolean(META_PIXEL_ID);
  const adsAllowed = izinliZemin && Boolean(GOOGLE_ADS_ID);

  /**
   * WhatsApp tıklaması = dönüşüm. Sayfada beş ayrı wa.me bağlantısı var
   * (header, hero, kanal kartı, footer, yüzen buton); her birine ayrı ayrı
   * olay bağlamak yerine tek bir delege dinleyici kullanılıyor — böylece
   * ileride eklenen bir bağlantı da kendiliğinden ölçülür.
   */
  useEffect(() => {
    if (!izinliZemin) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (target?.closest?.('a[href*="wa.me"], a[href^="tel:"]')) {
        trackEvent("Contact");
        trackAdsConversion();
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [izinliZemin]);

  /**
   * PageView — izin verilen her sayfa görüntülemesi için **tam bir kez.**
   *
   * PageView'i kod parçacığının içinden çıkardık: hem parçacık hem bu effect
   * ateşlediğinde ilk görüntüleme iki kez sayılıyor, bu da Meta'nın optimize
   * ettiği tabanı bozuyordu. Artık tek kaynak burası.
   *
   * `fbq` parçacık çalışır çalışmaz tanımlanır ve çağrıları kuyruğa alır;
   * yine de `afterInteractive` yüklemesi effect'ten sonraya kalabildiği için
   * kısa bir bekleme var.
   */
  useEffect(() => {
    if (!allowed) return;
    let cancelled = false;
    let tries = 0;
    const fire = () => {
      if (cancelled) return;
      if (typeof window.fbq === "function") {
        window.fbq("track", "PageView");
      } else if (tries++ < 50) {
        setTimeout(fire, 100);
      }
    };
    fire();
    return () => {
      cancelled = true;
    };
  }, [allowed, pathname]);

  if (!allowed && !adsAllowed) return null;

  return (
    <>
      {adsAllowed && (
        <>
          {/* Google Ads (gtag.js) — rıza modu layout'taki parçacıkta kurulu;
              varsayılan 'denied', rıza verilince 'granted'e güncelleniyor. */}
          <Script
            id="google-ads-js"
            src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-ads-config" strategy="afterInteractive">
            {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = window.gtag || gtag;
gtag('js', new Date());
gtag('config', '${GOOGLE_ADS_ID}');
            `}
          </Script>
        </>
      )}

      {allowed && (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];
t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
      `}
    </Script>
      )}
    </>
  );
}

/**
 * Dönüşüm olayı gönderir. Hassas sayfadan çağrılırsa hiçbir şey yapmaz.
 *
 * `custom_data` bilerek desteklenmiyor: sağlık verisinin reklam ekosistemine
 * sızdığı yer tam olarak orasıdır.
 */
/**
 * Google Ads dönüşümü gönderir. Hassas sayfada veya etiket tanımsızsa
 * hiçbir şey yapmaz. Meta tarafındaki `trackEvent` ile aynı kapılardan geçer.
 */
export function trackAdsConversion(): void {
  if (typeof window === "undefined") return;
  if (isSensitivePath(window.location.pathname)) return;
  if (!GOOGLE_ADS_CONVERSION_LABEL) return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", "conversion", {
    send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_CONVERSION_LABEL}`,
    value: GOOGLE_ADS_CONVERSION_VALUE,
    currency: GOOGLE_ADS_CONVERSION_CURRENCY,
  });
}

export function trackEvent(name: "Contact" | "Lead" | "Schedule"): void {
  if (typeof window === "undefined") return;
  if (isSensitivePath(window.location.pathname)) return;
  if (typeof window.fbq !== "function") return;
  window.fbq("track", name);
}
