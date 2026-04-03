import { NextRequest, NextResponse } from "next/server";
import {
  hashPassword,
  getUserByResetToken,
  updateUserPassword,
} from "@/lib/auth-d1";

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    // Validate input
    if (!token || !password) {
      return NextResponse.json(
        { error: "令牌和新密码都是必填项" },
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

    const db = (request as any).env.DB;
    if (!db) {
      console.error("D1 database not bound");
      return NextResponse.json(
        { error: "服务器配置错误" },
        { status: 500 }
      );
    }

    // Find user by reset token
    const user = await getUserByResetToken(db, token);
    if (!user) {
      return NextResponse.json(
        { error: "重置令牌无效或已过期" },
        { status: 400 }
      );
    }

    // Hash new password
    const passwordHash = await hashPassword(password);

    // Update password
    await updateUserPassword(db, user.id, passwordHash);

    return NextResponse.json({
      success: true,
      message: "密码重置成功，请使用新密码登录",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}
