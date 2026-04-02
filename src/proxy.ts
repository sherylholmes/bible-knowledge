import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const sessionToken = request.cookies.get("session")?.value;
  const pathname = request.nextUrl.pathname;

  // Public routes that don't need auth
  const publicRoutes = ["/", "/bible", "/knowledge", "/worship", "/login"];
  const isPublic = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Allow access to static assets, API routes (except protected ones), and public routes
  const isApiRoute = pathname.startsWith("/api/");
  const isAuthApi = pathname.startsWith("/api/auth/");
  const isStaticAsset = pathname.startsWith("/_next/") || pathname.includes(".");

  if (isPublic || isAuthApi || isStaticAsset || isApiRoute) {
    return NextResponse.next();
  }

  // For protected routes, require a valid session
  if (!sessionToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Verify session in D1 (only on Cloudflare Pages runtime)
  // During next dev, skip DB check and allow the request
  const env = (request as NextRequest & { env?: { DB: D1Database } }).env;
  const db = env?.DB;

  if (db && sessionToken) {
    const result = await db
      .prepare(
        `SELECT s.id FROM sessions s
         WHERE s.id = ? AND s.expires_at > datetime('now')`
      )
      .bind(sessionToken)
      .first();

    if (!result) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
