import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["tr", "en", "de"],
  defaultLocale: "tr",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

export function hasLocale(
  locales: readonly string[],
  value: unknown,
): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}
