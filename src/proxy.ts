import { NextResponse, type NextRequest } from "next/server";
import { decodeJWT } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const sessionToken = request.cookies.get("session")?.value;
  const pathname = request.nextUrl.pathname;

  // Public routes
  const publicRoutes = ["/", "/bible", "/knowledge", "/worship", "/login"];
  const isPublic = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isAuthApi = pathname.startsWith("/api/auth/");
  const isStaticAsset = pathname.startsWith("/_next/") || pathname.includes(".");

  if (isPublic || isAuthApi || isStaticAsset) {
    return NextResponse.next();
  }

  // Require valid session
  if (!sessionToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const user = decodeJWT(sessionToken);
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
