import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const sessionToken = request.cookies.get("session")?.value;

  if (!sessionToken) {
    return NextResponse.json({ user: null });
  }

  const env = (request as NextRequest & { env: { DB: D1Database } }).env;
  const db = env?.DB;

  if (!db) {
    // During local dev without D1, return a placeholder
    return NextResponse.json({
      user: {
        id: "dev-user",
        email: "dev@example.com",
        name: "Dev User",
        picture: null,
      },
    });
  }

  // Find session and join with user
  const result = await db
    .prepare(
      `SELECT u.id, u.email, u.name, u.picture
       FROM sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.id = ? AND s.expires_at > datetime('now')`
    )
    .bind(sessionToken)
    .first();

  if (!result) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: {
      id: result.id,
      email: result.email,
      name: result.name,
      picture: result.picture,
    },
  });
}
