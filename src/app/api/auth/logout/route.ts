import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const sessionToken = request.cookies.get("session")?.value;

  if (sessionToken) {
    const env = (request as NextRequest & { env: { DB: D1Database } }).env;
    const db = env?.DB;

    if (db) {
      await db
        .prepare(`DELETE FROM sessions WHERE id = ?`)
        .bind(sessionToken)
        .all();
    }
  }

  const response = NextResponse.redirect(new URL("/", request.url));

  response.cookies.set("session", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
