import { NextResponse } from "next/server";

/**
 * Nötr landing page formunun alıcısı — Aşama 1.
 *
 * Kural: **bu sunucuda hiçbir şey saklanmaz.** Gelen başvuru doğrulanır ve
 * kliniğin kanalına iletilir. Sebebi `olcumleme-plani.md` §5.1: bu segmentte
 * bir başvuru kaydının kendisi bile hassas veri ipucu taşır.
 *
 * ── İletim yolları (en az biri tanımlı olmalı) ───────────────────────────
 *   1. CONTACT_FORWARD_WEBHOOK   HTTPS uç noktası (Make, Zapier, n8n, CRM…)
 *   2. SMTP_HOST + SMTP_USER + SMTP_PASS + CONTACT_TO_EMAIL   klasik posta kutusu
 *   3. RESEND_API_KEY + CONTACT_TO_EMAIL   Resend üzerinden e-posta
 *
 * İkisi de tanımlıysa önce webhook denenir; webhook başarısız olursa
 * **e-postaya düşülür** — bozuk bir entegrasyon yüzünden başvuru kaybolmaz.
 * Hiçbiri tanımlı değilse 503 döner ve kullanıcıya WhatsApp / e-posta
 * gösterilir. Sessiz kayıp yoktur.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\/\s-]*(?:\d[+()\/\s-]*){6,}$/;
const PREFERENCES = ["E-Mail", "WhatsApp", "Rückruf"] as const;
const MAX_MESSAGE = 2000;

function clean(value: unknown, max = 200): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

interface Basvuru {
  quelle: string;
  eingegangen: string;
  kontaktweg: string;
  name: string;
  email: string;
  telefon: string;
  sprache: string;
  nachricht: string;
}

/** Düz metin e-posta gövdesi — HTML yok, ek yok. */
function metin(p: Basvuru): string {
  return [
    "Neue vertrauliche Anfrage",
    "",
    `Kontaktweg:   ${p.kontaktweg}`,
    `Name/Kürzel:  ${p.name || "—"}`,
    `E-Mail:       ${p.email || "—"}`,
    `Telefon:      ${p.telefon || "—"}`,
    `Sprache:      ${p.sprache}`,
    "",
    "Nachricht:",
    p.nachricht || "—",
    "",
    `Eingegangen:  ${p.eingegangen}`,
    `Quelle:       ${p.quelle}`,
  ].join("\n");
}

async function webhookGonder(url: string, p: Basvuru): Promise<void> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(p),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`webhook ${res.status}`);
}

/** Şifre iki adla da okunur: SMTP_PASS ve SMTP_PASSWORD (diğer projelerde
 *  ikincisi kullanılıyor; yanlış ad yüzünden formun sessizce çalışmaması
 *  ihtimalini ortadan kaldırır). */
function smtpSifre(): string {
  return process.env.SMTP_PASS || process.env.SMTP_PASSWORD || "";
}

/**
 * SMTP kullanılabilir mi?
 *
 * İki senaryo desteklenir:
 *   a) Kimlik doğrulamalı gönderim — SMTP_USER + şifre tanımlı.
 *   b) Kimlik doğrulamasız yerel teslim — site ile posta sunucusu aynı
 *      makinede olduğunda (Mailcow), kendi alan adına gelen postayı 25.
 *      porttan doğrudan teslim etmek için kullanıcı/şifre gerekmez.
 *
 * Her iki durumda da SMTP_HOST ve CONTACT_TO_EMAIL zorunludur.
 */
function smtpHazir(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.CONTACT_TO_EMAIL);
}

/** Klasik posta kutusu (Hostinger, Google Workspace, Yandex…) üzerinden gönderim. */
async function smtpGonder(p: Basvuru): Promise<void> {
  const host = process.env.SMTP_HOST!;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const to = process.env.CONTACT_TO_EMAIL!;
  const user = process.env.SMTP_USER ?? "";
  const sifre = smtpSifre();
  const from =
    process.env.CONTACT_FROM_EMAIL ?? `Grafta Website <${user || to}>`;

  const { createTransport } = await import("nodemailer");
  const transport = createTransport({
    host,
    port,
    secure: port === 465,
    // Kimlik bilgisi yoksa yerel teslim denenir (aynı makinedeki posta sunucusu).
    ...(user && sifre ? { auth: { user, pass: sifre } } : {}),
    // Sertifika doğrulaması varsayılan olarak AÇIK: şifre relay'e (SMTP2GO)
    // giderken bağlantının doğrulanmış olması gerekir. Yalnızca kendi
    // sunucusundaki otomatik imzalı sertifikaya bağlanılıyorsa
    // SMTP_INSECURE_TLS=true ile gevşetilebilir.
    ...(process.env.SMTP_INSECURE_TLS === "true"
      ? { tls: { rejectUnauthorized: false } }
      : {}),
  });

  await transport.sendMail({
    from,
    to: to.split(",").map((x) => x.trim()).filter(Boolean),
    ...(p.email ? { replyTo: p.email } : {}),
    subject: `Website Anfrage — ${p.kontaktweg}`,
    text: metin(p),
  });
}

async function epostaGonder(p: Basvuru): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) throw new Error("eposta yapilandirilmadi");
  const from = process.env.CONTACT_FROM_EMAIL ?? "Grafta Website <onboarding@resend.dev>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: to.split(",").map((s) => s.trim()).filter(Boolean),
      // Kullanıcı e-posta bıraktıysa "yanıtla" doğrudan ona gitsin.
      ...(p.email ? { reply_to: p.email } : {}),
      subject: `Vertrauliche Anfrage — ${p.kontaktweg}`,
      text: metin(p),
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`resend ${res.status}`);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  // Bot tuzağı dolduysa başarı dön ama hiçbir yere iletme.
  if (clean(body.website)) return NextResponse.json({ ok: true });

  const kontaktweg = clean(body.contactPreference, 20);
  if (!(PREFERENCES as readonly string[]).includes(kontaktweg)) {
    return NextResponse.json({ error: "invalid_preference" }, { status: 400 });
  }

  const email = clean(body.email, 254);
  const telefon = clean(body.phone, 40);
  const sprache = clean(body.language, 20);

  if (kontaktweg === "E-Mail" && !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }
  if (email && !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }
  if (kontaktweg !== "E-Mail" && !PHONE_RE.test(telefon)) {
    return NextResponse.json({ error: "invalid_phone" }, { status: 400 });
  }
  if (!sprache) {
    return NextResponse.json({ error: "invalid_language" }, { status: 400 });
  }

  const payload: Basvuru = {
    quelle: "vertrauliche-beurteilung",
    eingegangen: new Date().toISOString(),
    kontaktweg,
    name: clean(body.name, 80),
    email,
    telefon,
    sprache,
    nachricht: clean(body.message, MAX_MESSAGE),
  };

  const webhook = process.env.CONTACT_FORWARD_WEBHOOK;
  const smtpVar = smtpHazir();
  const epostaHazir = Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL);

  if (!webhook && !smtpVar && !epostaHazir) {
    console.error(
      "[anfrage] Iletim yapilandirilmamis: CONTACT_FORWARD_WEBHOOK veya " +
        "SMTP_* veya RESEND_API_KEY + CONTACT_TO_EMAIL tanimlanmali. Basvuru iletilemedi.",
    );
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const hatalar: string[] = [];

  if (webhook) {
    try {
      await webhookGonder(webhook, payload);
      return NextResponse.json({ ok: true, via: "webhook" });
    } catch (e) {
      // Başvurunun içeriği loglanmaz — yalnız hata tipi.
      hatalar.push(`webhook: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  if (smtpVar) {
    try {
      await smtpGonder(payload);
      if (hatalar.length) console.warn("[anfrage] webhook basarisiz, smtp'ye dusuldu:", hatalar.join(" | "));
      return NextResponse.json({ ok: true, via: "smtp" });
    } catch (e) {
      hatalar.push(`smtp: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  if (epostaHazir) {
    try {
      await epostaGonder(payload);
      // Webhook denendi ve düştüyse bu bir yedekleme; kayıt için işaretle.
      if (hatalar.length) console.warn("[anfrage] webhook basarisiz, e-postaya dusuldu:", hatalar.join(" | "));
      return NextResponse.json({ ok: true, via: "email" });
    } catch (e) {
      hatalar.push(`eposta: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  console.error("[anfrage] iletim basarisiz:", hatalar.join(" | "));
  return NextResponse.json({ error: "forward_failed" }, { status: 502 });
}
