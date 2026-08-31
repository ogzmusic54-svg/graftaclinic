"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { trackEvent } from "@/components/Analytics";
import { SmartImage } from "@/components/SmartImage";
import { siteConfig } from "@/config/site";

/**
 * Nötr adresli sayfadaki iletişim formu — Aşama 1.
 *
 * Bağlayıcı kurallar (`08-teknik/form-spesifikasyonu.md`):
 *  - **Sağlık verisi toplanmaz.** Tanı, tetkik, ilaç, rapor istenmez.
 *  - **Telefon zorunlu değildir.** Yalnız WhatsApp veya geri arama seçilirse
 *    istenir; e-posta seçiliyken alan DOM'da hiç render edilmez — görünüp de
 *    "isteğe bağlı" yazması verdiğimiz sözü görsel olarak zayıflatır.
 *  - Başvuru bu sunucuda saklanmaz; `/api/anfrage` kliniğin kanalına iletir.
 */

type Status = "idle" | "sending" | "sent" | "error";
type Preference = "E-Mail" | "WhatsApp" | "Rückruf";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// En az 6 rakam; boşluk, +, -, / ve parantez serbest.
const PHONE_RE = /^[+()\/\s-]*(?:\d[+()\/\s-]*){6,}$/;

export function AnfrageForm() {
  const t = useTranslations("vertraulich.form");
  const [status, setStatus] = useState<Status>("idle");
  const [preference, setPreference] = useState<Preference>("E-Mail");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const preferenceOptions = t.raw("contactPreferenceOptions") as Preference[];
  const languageOptions = t.raw("languageOptions") as string[];

  const phoneNeeded = preference === "WhatsApp" || preference === "Rückruf";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const email = String(data.get("email") ?? "").trim();
    // Telefon alanı gizliyken değeri hiç gönderilmez — kullanıcı önce WhatsApp
    // seçip numara yazıp sonra e-postaya dönerse o numara bizde kalmaz.
    const phone = phoneNeeded ? String(data.get("phone") ?? "").trim() : "";
    const language = String(data.get("language") ?? "");
    const consent = data.get("consent") === "on";

    const next: Record<string, string> = {};
    if (!preference) next.contactPreference = t("errPreference");
    if (preference === "E-Mail") {
      if (!email) next.email = t("errEmailMissing");
      else if (!EMAIL_RE.test(email)) next.email = t("errEmailInvalid");
    } else if (email && !EMAIL_RE.test(email)) {
      next.email = t("errEmailInvalid");
    }
    if (phoneNeeded) {
      if (!phone) next.phone = t("errPhoneMissing");
      else if (!PHONE_RE.test(phone)) next.phone = t("errPhoneInvalid");
    }
    if (!language) next.language = t("errLanguage");
    if (!consent) next.consent = t("errConsent");

    setErrors(next);
    if (Object.keys(next).length > 0) {
      const first = document.getElementById(Object.keys(next)[0]);
      first?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/anfrage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? "").trim(),
          contactPreference: preference,
          email,
          phone,
          language,
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

  const logo = (extra: string) => (
    <SmartImage
      src={siteConfig.brand.logoLight}
      alt={t("logoAlt")}
      width={132}
      height={48}
      className={extra}
    />
  );

  if (status === "sent") {
    return (
      <div className="card bg-white p-8 text-center" role="status" aria-live="polite">
        {logo("mx-auto mb-6 h-10 w-auto")}
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary-deep)]">
          <svg width="22" height="22" viewBox="0 0 20 20" className="text-[var(--color-accent)]" aria-hidden="true">
            <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h3 className="mt-5 font-serif text-2xl text-[var(--color-text-strong)]">{t("successTitle")}</h3>
        <p className="mt-3 text-[var(--color-text-muted)]">{t("successBody")}</p>
      </div>
    );
  }

  const fieldClass =
    "mt-1.5 w-full rounded-lg border border-[var(--color-border-subtle)] bg-white px-4 py-2.5 text-[var(--color-text-main)] outline-none focus:border-[var(--color-accent-deep)] focus:ring-2 focus:ring-[var(--color-accent)]/25";
  const labelClass = "block text-sm font-medium text-[var(--color-text-strong)]";
  const errClass = "mt-1.5 text-sm text-[var(--color-accent-deep)]";

  const err = (key: string) =>
    errors[key] ? (
      <p id={`${key}-error`} role="alert" className={errClass}>
        {errors[key]}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate className="card bg-white p-6 md:p-8">
      {logo("mb-5 h-10 w-auto")}
      <h3 className="font-serif text-2xl text-[var(--color-text-strong)]">{t("title")}</h3>

      {/* Zorunlu uyarı — kaldırılamaz. Brif §6, Aşama 1. */}
      <p className="mt-4 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-4 text-sm leading-relaxed text-[var(--color-text-muted)]">
        {t("subtitle")}
      </p>

      {/* Honeypot */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* İletişim tercihi ilk soru: telefon alanının görünüp görünmeyeceğini bu belirliyor */}
      <fieldset className="mt-6">
        <legend className={labelClass}>
          {t("contactPreference")} <span className="text-[var(--color-accent-deep)]">*</span>
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {preferenceOptions.map((option) => (
            <label
              key={option}
              className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition ${
                preference === option
                  ? "border-[var(--color-accent-deep)] bg-[var(--color-accent)]/10 font-medium text-[var(--color-text-strong)]"
                  : "border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)]"
              }`}
            >
              <input
                type="radio"
                name="contactPreference"
                value={option}
                checked={preference === option}
                onChange={() => setPreference(option)}
                className="sr-only"
              />
              {option}
            </label>
          ))}
        </div>
        {err("contactPreference")}
      </fieldset>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>{t("name")}</label>
          <input id="name" name="name" type="text" autoComplete="given-name"
            placeholder={t("namePlaceholder")} className={fieldClass} />
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            {t("email")}{preference === "E-Mail" && <span className="text-[var(--color-accent-deep)]"> *</span>}
          </label>
          <input id="email" name="email" type="email" autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            placeholder={t("emailPlaceholder")} className={fieldClass} />
          {err("email")}
        </div>

        {/* Telefon: tercih e-posta iken DOM'da hiç yok */}
        {phoneNeeded && (
          <div aria-live="polite">
            <label htmlFor="phone" className={labelClass}>
              {t("phone")} <span className="text-[var(--color-accent-deep)]">*</span>
            </label>
            <input id="phone" name="phone" type="tel" autoComplete="tel"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              placeholder={t("phonePlaceholder")} className={fieldClass} />
            {err("phone")}
          </div>
        )}

        <div className={phoneNeeded ? "" : "sm:col-span-1"}>
          <label htmlFor="language" className={labelClass}>
            {t("language")} <span className="text-[var(--color-accent-deep)]">*</span>
          </label>
          <select id="language" name="language" defaultValue={languageOptions[0]}
            aria-describedby={errors.language ? "language-error" : undefined}
            className={fieldClass}>
            {languageOptions.map((o) => <option key={o}>{o}</option>)}
          </select>
          {err("language")}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className={labelClass}>{t("message")}</label>
          <textarea id="message" name="message" rows={4}
            placeholder={t("messagePlaceholder")} className={fieldClass} />
        </div>
      </div>

      <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
        <input id="consent" type="checkbox" name="consent"
          aria-describedby={errors.consent ? "consent-error" : undefined}
          className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-accent-deep)]" />
        <span>{t("consent")}</span>
      </label>
      {err("consent")}

      {status === "error" && (
        <div role="alert" className="mt-4 rounded-lg bg-[var(--color-accent)]/10 px-4 py-3 text-sm text-[var(--color-text-strong)]">
          <strong className="block">{t("errorTitle")}</strong>
          <span className="text-[var(--color-text-muted)]">{t("errorBody")}</span>
        </div>
      )}

      <button type="submit" disabled={status === "sending"}
        className="btn btn-accent mt-6 w-full disabled:opacity-60">
        {status === "sending" ? t("sending") : t("submit")}
      </button>
    </form>
  );
}
