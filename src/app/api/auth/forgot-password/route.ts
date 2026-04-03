import { NextRequest, NextResponse } from "next/server";
import { generateToken, getUserByEmail, setPasswordResetToken } from "@/lib/auth-d1";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "邮箱是必填项" },
        { status: 400 }
      );
    }

    const db = (request as any).env.DB;
    if (!db) {
      console.error("D1 database not bound");
      return NextResponse.json(
        { error: "服务器配置错误" },
        { status: 500 }
      );
    }

    // Check if user exists
    const user = await getUserByEmail(db, email);
    
    // Always return success to prevent email enumeration attacks
    // Even if user doesn't exist, we don't want to reveal that
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "如果该邮箱已注册，您将收到密码重置链接",
      });
    }

    // Check if user is active
    if (user.status !== "active") {
      return NextResponse.json({
        success: true,
        message: "如果该邮箱已注册，您将收到密码重置链接",
      });
    }

    // Generate reset token (valid for 1 hour)
    const token = generateToken();
    const expiresMs = Date.now() + 60 * 60 * 1000; // 1 hour

    await setPasswordResetToken(db, email, token, expiresMs);

    // TODO: Send email with reset link
    // In production, you would send an email containing a link like:
    // https://shaunathelamb.com/reset-password?token=xxx

    return NextResponse.json({
      success: true,
      message: "如果该邮箱已注册，您将收到密码重置链接",
      // Remove this in production - only for testing
      reset_token: token,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}
