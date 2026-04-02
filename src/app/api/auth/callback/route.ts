import { NextResponse, type NextRequest } from "next/server";
import { exchangeCodeForTokens, getGoogleUserInfo } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL(`/login?error=${error}`, request.url));
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL("/login?error=missing_params", request.url));
  }

  // Verify state (CSRF protection)
  const storedState = request.cookies.get("oauth_state")?.value;
  if (!storedState || storedState !== state) {
    return NextResponse.redirect(new URL("/login?error=invalid_state", request.url));
  }

  // Exchange code for tokens
  const tokens = await exchangeCodeForTokens(code);
  if (!tokens || !tokens.id_token) {
    return NextResponse.redirect(new URL("/login?error=token_exchange", request.url));
  }

  // Get user info from Google
  const googleUser = await getGoogleUserInfo(tokens.access_token);
  if (!googleUser) {
    return NextResponse.redirect(new URL("/login?error=user_info", request.url));
  }

  const response = NextResponse.redirect(new URL("/", request.url));

  // Clear oauth_state cookie
  response.cookies.set("oauth_state", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  // Store id_token in session cookie (30 days)
  response.cookies.set("session", tokens.id_token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });

  return response;
}
