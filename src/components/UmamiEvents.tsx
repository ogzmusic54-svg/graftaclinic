"use client";

import { useEffect } from "react";

/**
 * Davranış olayları — Umami'ye (çerezsiz, kendi sunucumuz) gider.
 *
 * Amaç: "siteye gelen neden yazmıyor?" sorusuna veriyle cevap vermek.
 * Sayfa görüntüleme parçacığın kendi işi; burası yalnız şunları ekler:
 *   - scroll_25 / scroll_50 / scroll_75 / scroll_90  → ne kadar okundu
 *   - engaged_15s / engaged_60s                       → sekme görünürken kalış
 *   - whatsapp_click / call_click / form_cta_click    → hangi düğmeye basıldı
 * Kişisel veri yok: olay adı + sayfa yolu + (varsa) tercih. Form içeriği,
 * e-posta, telefon ASLA gönderilmez.
 */

type Umami = { track: (name: string, data?: Record<string, string | number>) => void };

function track(name: string, data?: Record<string, string | number>) {
  const u = (window as unknown as { umami?: Umami }).umami;
  if (u && typeof u.track === "function") u.track(name, data);
}

export function UmamiEvents() {
  useEffect(() => {
    const sent = new Set<string>();
    const once = (name: string, data?: Record<string, string | number>) => {
      if (sent.has(name)) return;
      sent.add(name);
      track(name, data);
    };

    // Kaydırma derinliği
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const pct = ((window.scrollY || doc.scrollTop) / max) * 100;
      if (pct >= 25) once("scroll_25");
      if (pct >= 50) once("scroll_50");
      if (pct >= 75) once("scroll_75");
      if (pct >= 90) once("scroll_90");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Görünür kalış süresi (sekme arka plandayken saymaz)
    let visible = 0;
    const tick = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      visible += 1;
      if (visible === 15) once("engaged_15s");
      if (visible === 60) once("engaged_60s");
      if (visible >= 60) window.clearInterval(tick);
    }, 1000);

    // Düğmeler
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.("a");
      if (!el) return;
      const href = el.getAttribute("href") ?? "";
      if (href.includes("wa.me") || href.includes("whatsapp.com")) track("whatsapp_click");
      else if (href.startsWith("tel:")) track("call_click");
      else if (href === "#anfrage" || href.endsWith("#anfrage")) track("form_cta_click");
    };
    document.addEventListener("click", onClick, true);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearInterval(tick);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return null;
}

/** Form bileşeni başarıyla gönderince çağırır — yalnız tercih türü gider. */
export function trackFormSent(preference: string) {
  track("form_sent", { preference });
}
