import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lazy initialization — only real on client, dummy placeholder on server
let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (typeof window === "undefined") {
    // Server-side during static build — return a no-op proxy
    return createClient("https://placeholder.supabase.co", "placeholder-key");
  }

  if (_client) return _client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  _client = createClient(supabaseUrl, supabaseAnonKey);
  return _client;
}

// Named export for convenience — resolves lazily at call time
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabase() as any)[prop];
  },
});
