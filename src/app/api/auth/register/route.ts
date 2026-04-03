import { NextRequest, NextResponse } from "next/server";
import {
  hashPassword,
  generateToken,
  getUserByEmail,
  getUserByUsername,
  createUser,
} from "@/lib/auth-d1";

export async function POST(request: NextRequest) {
  try {
    const { email, username, password } = await request.json();

    // Validate input
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: "邮箱、用户名和密码都是必填项" },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "邮箱格式不正确" }, { status: 400 });
    }

    // Username validation (alphanumeric, 3-20 chars)
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        { error: "用户名需为 3-20 位字母、数字或下划线" },
        { status: 400 }
      );
    }

    // Password strength validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: "密码至少需要 8 位字符" },
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

    // Check if email already exists
    const existingEmail = await getUserByEmail(db, email);
    if (existingEmail) {
      return NextResponse.json(
        { error: "该邮箱已被注册" },
        { status: 409 }
      );
    }

    // Check if username already exists
    const existingUsername = await getUserByUsername(db, username);
    if (existingUsername) {
      return NextResponse.json(
        { error: "该用户名已被使用" },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Generate verification token
    const verificationToken = generateToken();

    // Create user
    await createUser(db, {
      email,
      username,
      passwordHash,
      verificationToken,
    });

    // TODO: Send verification email
    // For now, we'll include the token in the response for testing
    // In production, you would send an email with a verification link

    return NextResponse.json({
      success: true,
      message: "注册成功",
      // Remove this in production - only for testing
      verification_token: verificationToken,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}
