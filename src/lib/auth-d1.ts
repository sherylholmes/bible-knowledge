import { SignJWT, jwtVerify } from "jose";

// Cloudflare D1 types (minimal)
interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  run(): Promise<{ success: boolean; meta: object }>;
  all<T = unknown>(): Promise<{ results: T[]; success: boolean }>;
}
interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

// ============ Config ============
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production"
);
const JWT_EXPIRY = "7d"; // 7 days
const PASSWORD_HASH_ITERATIONS = 100000;
const PASSWORD_HASH_KEY_LEN = 32;
const SALT_LEN = 16;

// ============ Types ============
export interface User {
  id: string;
  email: string;
  username: string;
  password_hash: string;
  email_verified: number;
  status: string;
  created_at: number;
  updated_at: number;
}

export interface JWTPayload {
  sub: string; // user id
  email: string;
  username: string;
  iat: number;
  exp: number;
}

// ============ Password Hashing (PBKDF2) ============
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LEN));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const hash = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: PASSWORD_HASH_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    PASSWORD_HASH_KEY_LEN * 8
  );
  // Combine salt + hash and base64 encode
  const combined = new Uint8Array(salt.length + hash.byteLength);
  combined.set(salt);
  combined.set(new Uint8Array(hash), salt.length);
  return btoa(String.fromCharCode(...combined));
}

export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  try {
    const combined = Uint8Array.from(atob(storedHash), (c) => c.charCodeAt(0));
    const salt = combined.slice(0, SALT_LEN);
    const storedKey = combined.slice(SALT_LEN);
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveBits"]
    );
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt,
        iterations: PASSWORD_HASH_ITERATIONS,
        hash: "SHA-256",
      },
      keyMaterial,
      PASSWORD_HASH_KEY_LEN * 8
    );
    const derivedKey = new Uint8Array(derivedBits);
    // Constant-time comparison
    if (storedKey.length !== derivedKey.length) return false;
    let result = 0;
    for (let i = 0; i < storedKey.length; i++) {
      result |= storedKey[i] ^ derivedKey[i];
    }
    return result === 0;
  } catch {
    return false;
  }
}

// ============ JWT ============
export async function signJWT(payload: Omit<JWTPayload, "iat" | "exp">): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(JWT_SECRET);
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

// ============ ID Generation ============
export function generateId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function generateToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ============ D1 Database Helpers ============
export async function getUserByEmail(
  db: D1Database,
  email: string
): Promise<User | null> {
  const result = await db
    .prepare("SELECT * FROM users WHERE email = ?")
    .bind(email)
    .first<User>();
  return result || null;
}

export async function getUserByUsername(
  db: D1Database,
  username: string
): Promise<User | null> {
  const result = await db
    .prepare("SELECT * FROM users WHERE username = ?")
    .bind(username)
    .first<User>();
  return result || null;
}

export async function getUserById(
  db: D1Database,
  id: string
): Promise<User | null> {
  const result = await db
    .prepare("SELECT * FROM users WHERE id = ?")
    .bind(id)
    .first<User>();
  return result || null;
}

export async function createUser(
  db: D1Database,
  data: {
    email: string;
    username: string;
    passwordHash: string;
    verificationToken?: string;
  }
): Promise<void> {
  const now = Date.now();
  const id = generateId();
  await db
    .prepare(
      `INSERT INTO users (id, email, username, password_hash, email_verified, verification_token, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, 0, ?, 'active', ?, ?)`
    )
    .bind(id, data.email, data.username, data.passwordHash, data.verificationToken || null, now, now)
    .run();
}

export async function updateUserVerification(
  db: D1Database,
  userId: string
): Promise<void> {
  const now = Date.now();
  await db
    .prepare(
      "UPDATE users SET email_verified = 1, verification_token = NULL, updated_at = ? WHERE id = ?"
    )
    .bind(now, userId)
    .run();
}

export async function setPasswordResetToken(
  db: D1Database,
  email: string,
  token: string,
  expiresMs: number
): Promise<void> {
  const now = Date.now();
  await db
    .prepare(
      "UPDATE users SET reset_token = ?, reset_token_expires = ?, updated_at = ? WHERE email = ?"
    )
    .bind(token, expiresMs, now, email)
    .run();
}

export async function getUserByResetToken(
  db: D1Database,
  token: string
): Promise<User | null> {
  const result = await db
    .prepare(
      "SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > ? AND status = 'active'"
    )
    .bind(token, Date.now())
    .first<User>();
  return result || null;
}

export async function updateUserPassword(
  db: D1Database,
  userId: string,
  passwordHash: string
): Promise<void> {
  const now = Date.now();
  await db
    .prepare(
      "UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL, updated_at = ? WHERE id = ?"
    )
    .bind(passwordHash, now, userId)
    .run();
}
