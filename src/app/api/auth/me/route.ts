import { NextResponse, type NextRequest } from "next/server";
import { decodeJWT } from "@/lib/auth"; // Google OAuth JWT decoder
import { verifyJWT } from "@/lib/auth-d1"; // Our custom JWT decoder

export async function GET(request: NextRequest) {
  const sessionToken = request.cookies.get("session")?.value;

  if (!sessionToken) {
    return NextResponse.json({ user: null });
  }

  // Try our custom D1 JWT first
  const ourPayload = await verifyJWT(sessionToken);
  if (ourPayload) {
    return NextResponse.json({
      user: {
        id: ourPayload.sub,
        email: ourPayload.email,
        name: ourPayload.username, // Use username as name
        provider: "email",
      },
    });
  }

  // Try Google OAuth JWT (has `name` and `picture` fields)
  const googleUser = decodeJWT(sessionToken);
  if (googleUser) {
    return NextResponse.json({
      user: {
        id: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
        provider: "google",
      },
    });
  }

  // Invalid session
  return NextResponse.json({ user: null });
}
