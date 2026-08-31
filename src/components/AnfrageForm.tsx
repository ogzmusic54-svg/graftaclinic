"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { trackEvent } from "@/components/Analytics";
import { SmartImage } from "@/components/SmartImage";
import { siteConfig } from "@/config/site";

/**
 * Nötr adresli sayfadaki iletişim formu — WhatsApp'ın eşit ağırlıklı alternatifi.
 *
 * Kasıtlı olarak sağlık verisi toplamaz. Alanlar: takma ad, e-posta, ülke,
 * yaş aralığı, zaman aralığı, serbest metin. Serbest metin alanının etiketinde
 * "sağlık verisi yazmayın" uyarısı var; veri yine de bizim sunucumuzda
 * saklanmaz, `/api/anfrage` üzerinden kliniğin kanalına iletilir.
 */

type Status = "idle" | "sending" | "sent" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function AnfrageForm() {
  const t = useTranslations("vertraulich.form");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const countryOptions = t.raw("countryOptions") as string[];
  const ageOptions = t.raw("ageOptions") as string[];
  const timeframeOptions = t.raw("timeframeOptions") as string[];

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const email = String(data.get("email") ?? "").trim();
    const consent = data.get("consent") === "on";
    if (!EMAIL_RE.test(email) || !consent) {
      setError(t("requiredError"));
      return;
    }

    setError(null);
    setStatus("sending");

    try {
      const res = await fetch("/api/anfrage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? "").trim(),
          email,
          country: String(data.get("country") ?? ""),
          ageGroup: String(data.get("ageGroup") ?? ""),
          timeframe: String(data.get("timeframe") ?? ""),
          message: String(data.get("message") ?? "").trim(),
          // Bot tuzağı — insan bu alanı görmez ve doldurmaz.
          website: String(data.get("website") ?? ""),
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      trackEvent("Lead");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div
        className="card bg-white p-8 text-center"
        role="status"
        aria-live="polite"
      >
        <SmartImage
          src={siteConfig.brand.logoLight}
          alt={t("logoAlt")}
          width={132}
          height={48}
          className="mx-auto mb-6 h-10 w-auto"
        />
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary-deep)]">
          <svg width="22" height="22" viewBox="0 0 20 20" className="text-[var(--color-accent)]" aria-hidden="true">
            <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h3 className="mt-5 font-serif text-2xl text-[var(--color-text-strong)]">
          {t("successTitle")}
        </h3>
        <p className="mt-3 text-[var(--color-text-muted)]">{t("successBody")}</p>
      </div>
    );
  }

  const fieldClass =
    "mt-1.5 w-full rounded-lg border border-[var(--color-border-subtle)] bg-white px-4 py-2.5 text-[var(--color-text-main)] outline-none focus:border-[var(--color-accent-deep)] focus:ring-2 focus:ring-[var(--color-accent)]/25";
  const labelClass = "block text-sm font-medium text-[var(--color-text-strong)]";

  return (
    <form onSubmit={onSubmit} noValidate className="card bg-white p-6 md:p-8">
      <SmartImage
        src={siteConfig.brand.logoLight}
        alt={t("logoAlt")}
        width={132}
        height={48}
        className="mb-5 h-10 w-auto"
      />
      <h3 className="font-serif text-2xl text-[var(--color-text-strong)]">{t("title")}</h3>
      <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
        {t("subtitle")}
      </p>

      {/* Honeypot — ekranda görünmez, ekran okuyucudan da gizli. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>{t("name")}</label>
          <input id="name" name="name" type="text" autoComplete="given-name" placeholder={t("namePlaceholder")} className={fieldClass} />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            {t("email")} <span className="text-[var(--color-accent-deep)]">*</span>
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" placeholder={t("emailPlaceholder")} className={fieldClass} />
        </div>
        <div>
          <label htmlFor="country" className={labelClass}>{t("country")}</label>
          <select id="country" name="country" className={fieldClass} defaultValue={countryOptions[0]}>
            {countryOptions.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="ageGroup" className={labelClass}>{t("ageGroup")}</label>
          <select id="ageGroup" name="ageGroup" className={fieldClass} defaultValue={ageOptions[1]}>
            {ageOptions.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="timeframe" className={labelClass}>{t("timeframe")}</label>
          <select id="timeframe" name="timeframe" className={fieldClass} defaultValue={timeframeOptions[0]}>
            {timeframeOptions.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className={labelClass}>{t("message")}</label>
          <textarea id="message" name="message" rows={4} placeholder={t("messagePlaceholder")} className={fieldClass} />
        </div>
      </div>

      <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
        <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-accent-deep)]" />
        <span>{t("consent")}</span>
      </label>

      {error && (
        <p role="alert" className="mt-4 rounded-lg bg-[var(--color-accent)]/10 px-4 py-3 text-sm text-[var(--color-text-strong)]">
          {error}
        </p>
      )}

      {status === "error" && (
        <div role="alert" className="mt-4 rounded-lg bg-[var(--color-accent)]/10 px-4 py-3 text-sm text-[var(--color-text-strong)]">
          <strong className="block">{t("errorTitle")}</strong>
          <span className="text-[var(--color-text-muted)]">{t("errorBody")}</span>
        </div>
      )}

      <button type="submit" disabled={status === "sending"} className="btn btn-accent mt-6 w-full disabled:opacity-60">
        {status === "sending" ? t("sending") : t("submit")}
      </button>
    </form>
  );
}
