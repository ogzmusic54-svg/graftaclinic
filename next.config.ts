import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/**
 * Umami (çerezsiz analitik) kendi sunucumuzda çalışır. Parçacık ve olay
 * uç noktası site alan adının altından sunulur (/u/...), böylece tarayıcı
 * üçüncü bir alan adına istek atmaz ve reklam engelleyiciler görmez.
 * Kaynak adres gizli değildir; env yoksa sabit değer kullanılır.
 */
const UMAMI_ORIGIN = (
  process.env.UMAMI_ORIGIN ?? "https://umami-ibzdlbau6zaspvehmizzox2s.nevvmedia.com"
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  // Coolify / Docker deploy için minimal standalone build
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  poweredByHeader: false,
  compress: true,
  async rewrites() {
    return [
      { source: "/u/script.js", destination: `${UMAMI_ORIGIN}/script.js` },
      { source: "/u/api/:path*", destination: `${UMAMI_ORIGIN}/api/:path*` },
    ];
  },
};

export default withNextIntl(nextConfig);
