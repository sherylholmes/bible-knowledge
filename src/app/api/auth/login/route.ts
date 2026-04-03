import { NextRequest, NextResponse } from "next/server";
import { getGoogleAuthUrl } from "@/lib/auth";
import { verifyPassword, signJWT, getUserByEmail } from "@/lib/auth-d1";

// GET = Google OAuth login
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

// POST = Email/password login
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "邮箱和密码都是必填项" },
        { status: 400 }
      );
    }

    // Get D1 database binding
    const db = (request as any).env.DB;
    if (!db) {
      console.error("D1 database not bound");
      return NextResponse.json(
        { error: "服务器配置错误" },
        { status: 500 }
      );
    }

    // Find user by email
    const user = await getUserByEmail(db, email);
    if (!user) {
      return NextResponse.json(
        { error: "邮箱或密码错误" },
        { status: 401 }
      );
    }

    // Check if user is active
    if (user.status !== "active") {
      return NextResponse.json(
        { error: "账户已被禁用" },
        { status: 403 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { error: "邮箱或密码错误" },
        { status: 401 }
      );
    }

    // Generate JWT
    const token = await signJWT({
      sub: user.id,
      email: user.email,
      username: user.username,
    });

    const response = NextResponse.json({
      success: true,
      message: "登录成功",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        email_verified: user.email_verified === 1,
      },
    });

    // Set session cookie (7 days)
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}
