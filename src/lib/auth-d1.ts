import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "bible-knowledge-secret-change-in-production"
);

// PBKDF2 password hashing
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomUUID();
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );
  const hash = btoa(String.fromCharCode(...new Uint8Array(derivedBits)));
  return `${salt}:${hash}`;
}

export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  try {
    const [salt, hash] = storedHash.split(":");
    if (!salt || !hash) return false;
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      "PBKDF2",
      false,
      ["deriveBits"]
    );
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: encoder.encode(salt),
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      256
    );
    const computedHash = btoa(
      String.fromCharCode(...new Uint8Array(derivedBits))
    );
    return computedHash === hash;
  } catch {
    return false;
  }
}

export async function signJWT(payload: {
  sub: string;
  email: string;
  username: string;
}): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyJWT(
  token: string
): Promise<{ sub: string; email: string; username: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      sub: payload.sub as string,
      email: payload.email as string,
      username: payload.username as string,
    };
  } catch {
    return null;
  }
}

export interface D1User {
  id: string;
  email: string;
  username: string;
  password_hash: string;
  email_verified: number;
  verification_token: string | null;
  reset_token: string | null;
  reset_token_expires: number | null;
  status: string;
  created_at: number;
  updated_at: number;
}

export async function getUserByEmail(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any,
  email: string
): Promise<D1User | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = (await db.prepare("SELECT * FROM users WHERE email = ?").bind(email).first()) as D1User | null;
  return result || null;
}

export async function getUserById(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any,
  id: string
): Promise<D1User | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = (await db.prepare("SELECT * FROM users WHERE id = ?").bind(id).first()) as D1User | null;
  return result || null;
}

export async function createUser(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any,
  email: string,
  username: string,
  passwordHash: string
): Promise<string> {
  const id = crypto.randomUUID();
  const now = Date.now();
  await db
    .prepare(
      `INSERT INTO users (id, email, username, password_hash, email_verified, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, 0, 'pending', ?, ?)`
    )
    .bind(id, email, username, passwordHash, now, now)
    .run();
  return id;
}
