"use client";

// Decode JWT payload without verification (used for reading Supabase session tokens)
export function decodeJWT(token: string): {
  id: string;
  email: string;
  name: string;
  picture?: string;
} | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name || payload.email,
      picture: payload.picture,
    };
  } catch {
    return null;
  }
}

// Store session in localStorage (Supabase client handles this internally, but we use it for quick reads)
export function getStoredUser() {
  if (typeof window === "undefined") return null;
  try {
    const session = localStorage.getItem("sb-session");
    if (!session) return null;
    const data = JSON.parse(session);
    if (!data?.user) return null;
    return {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email,
      picture: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture,
    };
  } catch {
    return null;
  }
}

// Store Supabase auth token in localStorage for middleware-less auth
export function storeSession(accessToken: string, refreshToken?: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    "sb-session",
    JSON.stringify({
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: Date.now() + 3600 * 1000,
      token_type: "bearer",
      user: null, // filled by getCurrentUser
    })
  );
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("sb-session");
}
