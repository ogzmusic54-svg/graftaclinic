import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { services } from "@/config/services";
import { siteConfig } from "@/config/site";
import { hreflangFor } from "@/lib/seo";

/**
 * Sitemap — her dil için ayrı giriş.
 *
 * Önceki sürüm yalnız `tr` URL'lerini listeliyor, diğer dilleri sadece
 * `alternates` içinde veriyordu. Google bunu genelde okur ama garanti değil;
 * `/en` ve `/de` sayfalarının kendi satırı olmadığında keşif ve indeksleme
 * gecikir. Hedef kitle Avrupa olduğu için en/de sürümlerinin doğrudan
 * listelenmesi kritik.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  // Locale önekinden SONRAKİ yollar
  const staticPaths = [
    "",
    "/about",
    "/services",
    "/results",
    "/contact",
    "/hair-transplant-turkey",
    "/hiv-positive-hair-transplant-turkey",
  ];

  const priorityFor = (path: string) => {
    if (path === "") return 1;
    if (path === "/hair-transplant-turkey") return 0.9;
    if (path === "/hiv-positive-hair-transplant-turkey") return 0.85;
    return 0.8;
  };

  const entries: MetadataRoute.Sitemap = [];

  for (const path of staticPaths) {
    const languages = hreflangFor(path);
    for (const locale of routing.locales) {
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: now,
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: priorityFor(path),
        alternates: { languages },
      });
    }
  }

  for (const service of services) {
    const path = `/services/${service.slug}`;
    const languages = hreflangFor(path);
    for (const locale of routing.locales) {
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: { languages },
      });
    }
  }

  return entries;
}
