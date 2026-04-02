// Cloudflare Pages runtime type declarations
// These types are available in the Cloudflare Pages Functions runtime

declare namespace Cloudflare {
  interface Env {
    DB: D1Database;
  }
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<{ results: T[]; success: boolean; meta?: object }>;
}
