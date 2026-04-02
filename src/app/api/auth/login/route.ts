import { NextResponse, type NextRequest } from "next/server";
import { getGoogleAuthUrl } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const cookieStore = request.cookies;
  const existingSession = cookieStore.get("session");

  // Already logged in
  if (existingSession?.value) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const { url, state } = await getGoogleAuthUrl();

  const response = NextResponse.redirect(url);

  // Store state in a short-lived cookie for CSRF protection
  response.cookies.set("oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 10, // 10 minutes
    path: "/",
  });

  return response;
}
