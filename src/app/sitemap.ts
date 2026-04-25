import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { services } from "@/config/services";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();
  const staticPaths = ["", "/about", "/services", "/contact"];

  const entries: MetadataRoute.Sitemap = [];

  for (const path of staticPaths) {
    const languages: Record<string, string> = {};
    for (const l of routing.locales) {
      languages[l] = `${base}/${l}${path}`;
    }
    entries.push({
      url: `${base}/${routing.defaultLocale}${path}`,
      lastModified: now,
      changeFrequency: path === "" ? "weekly" : "monthly",
      priority: path === "" ? 1 : 0.8,
      alternates: { languages },
    });
  }

  for (const s of services) {
    const languages: Record<string, string> = {};
    for (const l of routing.locales) {
      languages[l] = `${base}/${l}/services/${s.slug}`;
    }
    entries.push({
      url: `${base}/${routing.defaultLocale}/services/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: { languages },
    });
  }

  return entries;
}
