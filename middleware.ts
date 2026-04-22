import { NextResponse, type NextRequest } from "next/server";
import { TOKEN_COOKIE_NAME } from "@/lib/jwt";

function hasToken(req: NextRequest) {
  return Boolean(req.cookies.get(TOKEN_COOKIE_NAME)?.value);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = hasToken(req);

  if (pathname === "/" && token) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/dashboard") && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if ((pathname === "/login" || pathname === "/register") && token) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  const isProtectedApi =
    pathname.startsWith("/api/messages") ||
    pathname.startsWith("/api/auth/me") ||
    pathname.startsWith("/api/registrations/") ||
    (pathname.startsWith("/api/events") && req.method !== "GET");

  if (isProtectedApi && !token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login", "/register", "/api/:path*"],
};
