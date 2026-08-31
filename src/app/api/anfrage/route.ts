import { NextResponse } from "next/server";

/**
 * Nötr landing page formunun alıcısı.
 *
 * Kural: **bu sunucuda hiçbir şey saklanmaz.** Gelen başvuru doğrulanır ve
 * doğrudan kliniğin kendi kanalına iletilir. Sebebi `olcumleme-plani.md` §5.1:
 * bu segmentte bir başvuru kaydının kendisi bile hassas veri ipucu taşır.
 *
 * Yayın öncesi ortam değişkeni:
 *   CONTACT_FORWARD_WEBHOOK = klinik tarafındaki HTTPS uç noktası
 * Tanımlı değilse form 503 döner ve kullanıcıya WhatsApp / e-posta gösterilir —
 * sessizce kaybolan başvuru olmaz.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_LEN = 2000;

function clean(value: unknown, max = 200): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  // Bot tuzağı dolduysa başarı dön ama hiçbir yere iletme.
  if (clean(body.website)) {
    return NextResponse.json({ ok: true });
  }

  const email = clean(body.email, 254);
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const payload = {
    quelle: "vertrauliche-beurteilung",
    eingegangen: new Date().toISOString(),
    name: clean(body.name, 80),
    email,
    land: clean(body.country, 40),
    altersgruppe: clean(body.ageGroup, 20),
    zeitrahmen: clean(body.timeframe, 80),
    nachricht: clean(body.message, MAX_LEN),
  };

  const webhook = process.env.CONTACT_FORWARD_WEBHOOK;
  if (!webhook) {
    console.error("[anfrage] CONTACT_FORWARD_WEBHOOK tanimli degil - basvuru iletilemedi");
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  try {
    const forwarded = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
    });
    if (!forwarded.ok) throw new Error(`webhook ${forwarded.status}`);
  } catch (err) {
    // Başvurunun içeriği loglanmaz — yalnız hata.
    console.error("[anfrage] iletim basarisiz:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "forward_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
