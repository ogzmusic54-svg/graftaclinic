// Reklam iniş sayfası (/de/vertrauliche-beurteilung) regresyon testi.
// Çalıştırmak için: node scripts/verify-landing-page.mjs
// (sunucu ayrı terminalde: npx next start -p 3121, NEXT_PUBLIC_META_PIXEL_ID tanımlı)
//
// Doğruladığı kurallar:
//   - Nötr sayfada pixel çalışır ve PageView TAM BİR KEZ gider
//   - Beş wa.me bağlantısının hepsi Contact olayı gönderir
//   - Hassas sayfada rıza verilmiş olsa bile hiçbir şey yüklenmez
//   - Sayfada HIV/AIDS kelimesi, öncesi–sonrası, garanti iddiası geçmez
//   - Sayfa yalnız Almanca yayında, sitemap'te yok, noindex
//   - Form webhook tanımsızken sessizce kaybolmaz
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3121";
const OUT = process.env.SHOT_DIR ?? "/tmp";
const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

const browser = await chromium.launch({ executablePath: CHROME });
const fails = [];
const ok = (cond, msg) => { console.log(`${cond ? "  OK " : "  X  "} ${msg}`); if (!cond) fails.push(msg); };

async function newCtx({ width = 1440, height = 900, consent = null } = {}) {
  const c = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, locale: "de-DE" });
  if (consent) await c.addInitScript((v) => { try { localStorage.setItem("grafta-consent", v); } catch {} }, consent);
  return c;
}

const queue = (p) => p.evaluate(() => (typeof window.fbq === "function" ? window.fbq.queue.map((a) => Array.from(a).join(" ")) : null));

// ── 1. Nötr sayfa, rıza verilmiş: pixel çalışır, PageView TAM BİR KEZ
console.log("\n1) Notr sayfa · riza VAR");
{
  const c = await newCtx({ consent: "granted" });
  const p = await c.newPage();
  await p.goto(`${BASE}/de/vertrauliche-beurteilung`, { waitUntil: "networkidle" });
  await p.waitForTimeout(600);
  const q = await queue(p);
  ok(q !== null, "pixel yuklendi");
  ok(q.filter((e) => e === "track PageView").length === 1, `PageView tam 1 kez (bulunan: ${q.filter((e) => e === "track PageView").length})`);
  ok(q.some((e) => e.startsWith("init ")), "init cagrildi");
  await p.screenshot({ path: `${OUT}/lp-desktop.png`, fullPage: true });
  await c.close();
}

// ── 2. WhatsApp + telefon tıklamaları Contact gönderiyor
console.log("\n2) Donusum olaylari");
{
  const c = await newCtx({ consent: "granted" });
  const p = await c.newPage();
  await p.goto(`${BASE}/de/vertrauliche-beurteilung`, { waitUntil: "networkidle" });
  await p.evaluate(() => {
    document.querySelectorAll('a[href*="wa.me"]').forEach((e) => e.removeAttribute("target"));
    document.addEventListener("click", (e) => { if (e.target.closest?.('a[href*="wa.me"], a[href^="tel:"]')) e.preventDefault(); });
  });
  const n = await p.$$eval('a[href*="wa.me"]', (els) => els.length);
  for (let i = 0; i < n; i++) {
    const l = p.locator('a[href*="wa.me"]').nth(i);
    await l.scrollIntoViewIfNeeded().catch(() => {});
    await l.click({ force: true, noWaitAfter: true });
  }
  await p.waitForTimeout(400);
  const contacts = (await queue(p)).filter((e) => e === "track Contact").length;
  ok(contacts === n, `${n} wa.me baglantisinin hepsi Contact gonderdi (gonderen: ${contacts})`);
  await c.close();
}

// ── 3. Hassas sayfa, rıza VERİLMİŞ: hiçbir şey yüklenmez
console.log("\n3) Hassas sayfa · riza VAR (kritik kural)");
{
  const c = await newCtx({ consent: "granted" });
  const p = await c.newPage();
  let fb = 0;
  p.on("request", (r) => { if (r.url().includes("facebook")) fb++; });
  await p.goto(`${BASE}/de/hiv-positive-hair-transplant-turkey`, { waitUntil: "networkidle" });
  await p.evaluate(() => {
    document.querySelectorAll('a[href*="wa.me"]').forEach((e) => e.removeAttribute("target"));
    document.addEventListener("click", (e) => { if (e.target.closest?.('a[href*="wa.me"]')) e.preventDefault(); });
  });
  await p.locator('a[href*="wa.me"]').first().click({ force: true, noWaitAfter: true });
  await p.waitForTimeout(600);
  ok(await p.evaluate(() => typeof window.fbq === "undefined"), "fbq tanimli degil");
  ok(fb === 0, `facebook'a hicbir istek gitmedi (${fb})`);
  await c.close();
}

// ── 4. Nötr sayfa, rıza YOK: pixel yok, banner var
console.log("\n4) Notr sayfa · riza YOK");
{
  const c = await newCtx({ width: 390, height: 844 });
  const p = await c.newPage();
  await p.goto(`${BASE}/de/vertrauliche-beurteilung`, { waitUntil: "networkidle" });
  ok(await p.evaluate(() => typeof window.fbq === "undefined"), "riza yokken pixel yok");
  ok(await p.locator('[role="dialog"]').isVisible(), "riza bandi gorunuyor");
  await p.screenshot({ path: `${OUT}/lp-mobile.png`, fullPage: true });
  await c.close();
}

// ── 5. Sayfa içeriği ve kurallar
console.log("\n5) Sayfa icerigi");
{
  const c = await newCtx({ consent: "granted" });
  const p = await c.newPage();
  await p.goto(`${BASE}/de/vertrauliche-beurteilung`, { waitUntil: "networkidle" });
  const body = (await p.innerText("body")).toLowerCase();
  const html = await p.content();
  ok(!/\bhiv\b|\baids\b|hiv-positiv/.test(body), "sayfada HIV/AIDS kelimesi gecmiyor");
  ok((await p.innerText("h1")).includes("Haartransplantation"), "H1'de urun adi var");
  ok((await p.$$("h1")).length === 1, "tek H1");
  ok(html.includes('name="robots"') && /noindex/.test(html), "robots noindex");
  ok(html.includes('"@type":"FAQPage"'), "FAQPage semasi var");
  ok(await p.locator('a[href="#anfrage"]').first().isVisible(), "forma giden ikinci CTA var");
  ok(await p.locator("#anfrage form").isVisible(), "form sayfada");
  ok(!/vorher|nachher|before.after/.test(body), "oncesi-sonrasi ifadesi yok (HWG §11)");
  ok(!/garanti|garantie|100 ?%/.test(body), "garanti / %100 iddiasi yok");
  await c.close();
}

// ── 6. Diğer diller 404
console.log("\n6) Rota kapsami");
for (const loc of ["tr", "en"]) {
  const c = await newCtx();
  const p = await c.newPage();
  const r = await p.goto(`${BASE}/${loc}/vertrauliche-beurteilung`);
  ok(r.status() === 404, `/${loc}/vertrauliche-beurteilung -> 404`);
  await c.close();
}
{
  const c = await newCtx();
  const p = await c.newPage();
  const xml = await (await p.goto(`${BASE}/sitemap.xml`)).text();
  ok(!xml.includes("vertrauliche-beurteilung"), "sitemap'te yok (reklam sayfasi)");
  await c.close();
}

// ── 7. Form: webhook tanımsızken kullanıcı sessizce kaybolmuyor
console.log("\n7) Form davranisi");
{
  const c = await newCtx({ consent: "granted" });
  const p = await c.newPage();
  await p.goto(`${BASE}/de/vertrauliche-beurteilung#anfrage`, { waitUntil: "networkidle" });
  await p.click('button[type="submit"]');
  await p.waitForTimeout(300);
  ok((await p.locator('[role="alert"]').first().innerText()).includes("E-Mail"), "bos form: uyari gosteriyor");
  await p.fill("#email", "test@example.com");
  await p.check('input[name="consent"]');
  await p.click('button[type="submit"]');
  await p.waitForTimeout(1500);
  const alert = await p.locator('[role="alert"]').first().innerText();
  ok(alert.includes("nicht gesendet"), "webhook yokken hata gosteriyor, sessiz kaybolmuyor");
  ok(alert.includes("WhatsApp"), "hata mesajinda alternatif kanal var");
  const contacts = (await queue(p)).filter((e) => e === "track Lead").length;
  ok(contacts === 0, "basarisiz gonderimde Lead olayi gonderilmedi");
  await c.close();
}

await browser.close();
console.log(fails.length ? `\nBASARISIZ (${fails.length}):\n- ${fails.join("\n- ")}` : "\nTUM KONTROLLER GECTI");
process.exit(fails.length ? 1 : 0);
