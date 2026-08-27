// Ölçümleme güvencesi regresyon testi.
// Çalıştırmak için: npm i --no-save playwright && node scripts/verify-tracking.mjs
// (sunucu ayrı terminalde: npx next start -p 3121)
//
// Doğruladığı kural: reklam etiketi ancak (rıza verilmiş) VE (sayfa hassas
// değil) ise yüklenir. Hassas sayfada rıza verilmiş olsa bile yüklenmez.
import { chromium } from "playwright";

const BASE = "http://localhost:3121";
const PIXEL = "connect.facebook.net";

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const results = [];

async function visit(path, { consent }) {
  const ctx = await browser.newContext({ locale: "de-DE" });
  const page = await ctx.newPage();

  const pixelRequests = [];
  page.on("request", (r) => {
    if (r.url().includes(PIXEL) || r.url().includes("facebook.com/tr")) {
      pixelRequests.push(r.url());
    }
  });

  if (consent) {
    await ctx.addInitScript(() => {
      try {
        localStorage.setItem("grafta-consent", "granted");
      } catch {}
    });
  }

  await page.goto(BASE + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);

  results.push({
    path,
    consent: consent ? "verildi" : "verilmedi",
    pixelYuklendi: pixelRequests.length > 0,
    istekSayisi: pixelRequests.length,
  });

  await ctx.close();
}

// 1) Rıza yok, genel sayfa      -> pixel YUKLENMEMELI
await visit("/de", { consent: false });
// 2) Rıza var, genel sayfa      -> pixel YUKLENMELI
await visit("/de", { consent: true });
// 3) Rıza yok, hassas sayfa     -> pixel YUKLENMEMELI
await visit("/de/hiv-positive-hair-transplant-turkey", { consent: false });
// 4) Rıza VAR, hassas sayfa     -> pixel YINE DE YUKLENMEMELI  <-- kritik test
await visit("/de/hiv-positive-hair-transplant-turkey", { consent: true });

await browser.close();

console.log("\n%-52s %-12s %s", "SAYFA", "RIZA", "PIXEL");
for (const r of results) {
  console.log(
    r.path.padEnd(52),
    r.consent.padEnd(12),
    r.pixelYuklendi ? `YUKLENDI (${r.istekSayisi})` : "yuklenmedi",
  );
}

const beklenen = [false, true, false, false];
const gercek = results.map((r) => r.pixelYuklendi);
const gecti = JSON.stringify(beklenen) === JSON.stringify(gercek);
console.log("\nSONUC:", gecti ? "TUM TESTLER GECTI" : "BASARISIZ");
process.exit(gecti ? 0 : 1);
