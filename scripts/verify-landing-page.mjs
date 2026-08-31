// Landing page ve form regresyon testi.
//
// Calistirmak icin:
//   NEXT_PUBLIC_META_PIXEL_ID=... CONTACT_FORWARD_WEBHOOK=http://127.0.0.1:3199/hook \
//     npx next start -p 3141
//   node scripts/verify-landing-page.mjs
//
// Dogruladigi kurallar:
//   - Blok sirasi: iletisim gecidi HIV bolumunden ONCE (brif §5)
//   - Form birincil: WhatsApp'tan once ve daha genis (kabul kriteri 4)
//   - "anonym" kelimesi hicbir yerde gecmiyor (ilke 6)
//   - Telefon alani yalniz WhatsApp/Rueckruf secilince DOM'a giriyor
//   - Almanca dogrulama hatalari
//   - Ucdan uca gonderim + basarili gonderimde tam 1 Lead olayi
//   - Hassas sayfada riza VARKEN bile pixel yuklenmiyor
//   - Canonical apex'e isaret ediyor, www referansi yok
import { chromium } from "playwright";
const B = process.env.BASE_URL ?? "http://localhost:3141";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const fails = [];
const ok = (c, m) => { console.log(`${c ? "  OK " : "  X  "} ${m}`); if (!c) fails.push(m); };

async function ctx(consent = "granted", w = 1400) {
  const c = await b.newContext({ viewport: { width: w, height: 950 }, locale: "de-DE" });
  if (consent) await c.addInitScript((v) => { try { localStorage.setItem("grafta-consent", v); } catch {} }, consent);
  return c;
}

console.log("\n1) Blok sirasi ve form onceligi");
{
  const c = await ctx(); const p = await c.newPage();
  await p.goto(`${B}/de/vertrauliche-beurteilung`, { waitUntil: "networkidle" });
  const order = await p.$$eval("section", els => els.map(e => e.id || (e.querySelector("h1,h2")?.innerText || "").slice(0,34)));
  console.log("   sira:", JSON.stringify(order));
  const gate = order.indexOf("anfrage");
  const hiv = order.findIndex(x => /HIV und Haartransplantation/.test(x));
  ok(gate > -1 && hiv > -1 && gate < hiv, `iletisim gecidi HIV bolumunden ONCE (gecit ${gate}, hiv ${hiv})`);
  const formBox = await p.locator("#anfrage form").boundingBox();
  const waBox = await p.locator("#anfrage aside").boundingBox();
  ok(formBox.x < waBox.x, "form WhatsApp'in SOLUNDA (once geliyor)");
  ok(formBox.width > waBox.width, `form daha genis (${Math.round(formBox.width)} > ${Math.round(waBox.width)})`);
  const body = (await p.innerText("body")).toLowerCase();
  ok(!body.includes("anonym"), "'anonym' kelimesi sayfada YOK");
  ok(body.includes("der medizinische teil ist getrennt"), "05. blok (tibbi ikinci asama) sayfada");
  await c.close();
}

console.log("\n2) Kosullu telefon alani");
{
  const c = await ctx(); const p = await c.newPage();
  await p.goto(`${B}/de/vertrauliche-beurteilung#anfrage`, { waitUntil: "networkidle" });
  ok(await p.locator("#phone").count() === 0, "tercih E-Mail iken telefon alani DOM'da YOK");
  await p.getByRole("radio", { name: "WhatsApp" }).check({ force: true });
  await p.waitForTimeout(250);
  ok(await p.locator("#phone").count() === 1, "WhatsApp secilince telefon alani belirdi");
  await p.fill("#phone", "+49 170 1234567");
  await p.getByRole("radio", { name: "E-Mail" }).check({ force: true });
  await p.waitForTimeout(250);
  ok(await p.locator("#phone").count() === 0, "E-Mail'e donunce telefon alani tekrar kayboldu");
  await c.close();
}

console.log("\n3) Dogrulama ve hata mesajlari");
{
  const c = await ctx(); const p = await c.newPage();
  await p.goto(`${B}/de/vertrauliche-beurteilung#anfrage`, { waitUntil: "networkidle" });
  await p.click('button[type="submit"]');
  await p.waitForTimeout(300);
  const t = await p.locator("#anfrage").innerText();
  ok(/E-Mail-Adresse/.test(t) && /Einwilligung/.test(t), "bos form: Almanca hatalar gosterildi");
  await p.fill("#email", "bozuk@");
  await p.click('button[type="submit"]'); await p.waitForTimeout(250);
  ok(/nicht vollständig/.test(await p.locator("#anfrage").innerText()), "gecersiz e-posta yakalandi");
  await c.close();
}

console.log("\n4) Ucdan uca gonderim (webhook)");
{
  const c = await ctx(); const p = await c.newPage();
  await p.goto(`${B}/de/vertrauliche-beurteilung#anfrage`, { waitUntil: "networkidle" });
  await p.fill("#name", "M.");
  await p.fill("#email", "test@example.com");
  await p.selectOption("#language", "Deutsch");
  await p.fill("#message", "Eine allgemeine Frage zum Ablauf.");
  await p.check("#consent");
  await p.click('button[type="submit"]');
  await p.waitForTimeout(2000);
  const t = await p.locator("#anfrage").innerText();
  ok(/angekommen/.test(t), "basari ekrani gosterildi");
  const q = await p.evaluate(() => typeof window.fbq === "function" ? window.fbq.queue.map(a => Array.from(a).join(" ")) : []);
  ok(q.filter(e => e === "track Lead").length === 1, `basarili gonderimde Lead olayi TAM 1 (bulunan ${q.filter(e=>e==="track Lead").length})`);
  await c.close();
}

console.log("\n5) Pixel kurallari");
{
  const c = await ctx(); const p = await c.newPage();
  await p.goto(`${B}/de/vertrauliche-beurteilung`, { waitUntil: "networkidle" });
  await p.waitForTimeout(600);
  const q = await p.evaluate(() => typeof window.fbq === "function" ? window.fbq.queue.map(a => Array.from(a).join(" ")) : null);
  ok(q !== null, "notr sayfa + riza: pixel yuklendi");
  ok(q.filter(e => e === "track PageView").length === 1, "PageView tam 1 kez");
  await c.close();
  const c2 = await ctx(); const p2 = await c2.newPage();
  let fb = 0; p2.on("request", r => { if (r.url().includes("facebook")) fb++; });
  await p2.goto(`${B}/de/hiv-positive-hair-transplant-turkey`, { waitUntil: "networkidle" });
  ok(await p2.evaluate(() => typeof window.fbq === "undefined") && fb === 0, "hassas sayfa + riza: pixel YOK, 0 istek");
  await c2.close();
}

console.log("\n6) Canonical apex'e isaret ediyor mu");
{
  const c = await ctx(); const p = await c.newPage();
  await p.goto(`${B}/de/vertrauliche-beurteilung`, { waitUntil: "networkidle" });
  const canon = await p.getAttribute('link[rel="canonical"]', "href").catch(() => null);
  const html = await p.content();
  ok(!html.includes("www.graftaclinic.com"), "sayfada www.graftaclinic.com referansi YOK");
  console.log("   canonical:", canon);
  await c.close();
}

await b.close();
console.log(fails.length ? `\nBASARISIZ (${fails.length}):\n- ${fails.join("\n- ")}` : "\nTUM KONTROLLER GECTI");
process.exit(fails.length ? 1 : 0);
