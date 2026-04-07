"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "error">("loading");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const error = params.get("error");

    if (error) {
      setStatus("error");
      setTimeout(() => router.replace("/login?error=" + encodeURIComponent(error)), 2000);
      return;
    }

    if (!code) {
      setStatus("error");
      setTimeout(() => router.replace("/login?error=no_code"), 2000);
      return;
    }

    getSupabase()
      .auth.exchangeCodeForSession(code)
      .then(({ error: authError }) => {
        if (authError) {
          console.error("Auth callback error:", authError);
          router.replace("/login?error=auth_failed");
        } else {
          router.replace("/");
        }
      });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">{status === "error" ? "❌" : "🔄"}</div>
        <p className="text-gray-600">
          {status === "error" ? "授权失败，正在跳转..." : "正在登录，请稍候..."}
        </p>
      </div>
    </div>
  );
}
