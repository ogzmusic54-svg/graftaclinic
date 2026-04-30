import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const handle = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const supported = routing.locales as readonly string[];

  if (supported.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) {
    return handle(req);
  }

  if (req.cookies.get("NEXT_LOCALE")) {
    return handle(req);
  }

  const accept = (req.headers.get("accept-language") ?? "").toLowerCase();
  const matched = supported.find((l) =>
    accept
      .split(",")
      .some((part) => part.trim().split(";")[0].split("-")[0] === l),
  );

  if (!matched) {
    const url = req.nextUrl.clone();
    url.pathname = `/en${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  return handle(req);
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
