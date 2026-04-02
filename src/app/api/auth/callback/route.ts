import { NextResponse, type NextRequest } from "next/server";
import {
  exchangeCodeForTokens,
  getGoogleUserInfo,
  createSessionToken,
} from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const redirectTo = new URL("/", request.url);

  // Handle OAuth errors
  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${error}`, request.url)
    );
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
  const tokens = await exchangeCodeForTokens(code, state);
  if (!tokens) {
    return NextResponse.redirect(new URL("/login?error=token_exchange", request.url));
  }

  // Get user info from Google
  const googleUser = await getGoogleUserInfo(tokens.access_token);
  if (!googleUser) {
    return NextResponse.redirect(new URL("/login?error=user_info", request.url));
  }

  // Generate session token
  const sessionToken = createSessionToken();

  // Access D1 from env (available in Cloudflare Pages runtime)
  const env = (request as NextRequest & { env: { DB: D1Database } }).env;
  const db = env?.DB;

  if (db) {
    // Upsert user in D1
    await db
      .prepare(
        `INSERT INTO users (id, email, name, picture, provider)
         VALUES (?, ?, ?, ?, 'google')
         ON CONFLICT(id) DO UPDATE SET
           email = excluded.email,
           name = excluded.name,
           picture = excluded.picture`
      )
      .bind(googleUser.id, googleUser.email, googleUser.name, googleUser.picture)
      .all();

    // Create session (expires in 30 days)
    const expiresAt = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toISOString();

    await db
      .prepare(
        `INSERT INTO sessions (id, user_id, expires_at)
         VALUES (?, ?, ?)`
      )
      .bind(sessionToken, googleUser.id, expiresAt)
      .all();
  }

  const response = NextResponse.redirect(redirectTo);

  // Clear the oauth_state cookie
  response.cookies.set("oauth_state", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  // Set session cookie (30 days)
  response.cookies.set("session", sessionToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });

  return response;
}
