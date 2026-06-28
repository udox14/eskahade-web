import { db } from "@/lib/db";
import { adminUsers, sessions } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";

const SESSION_COOKIE = "sk_sess";
export const PSB_SESSION_COOKIE = "psb_sess"; // PSB santri (registrant) sessions
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// --- Password hashing (Web Crypto PBKDF2) ---

async function hash(password: string): Promise<string> {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations: 100_000 },
    key,
    256
  );
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, "0")).join("");
  const hashHex = Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, "0")).join("");
  return `pbkdf2:${saltHex}:${hashHex}`;
}

async function verify(password: string, stored: string): Promise<boolean> {
  const [, saltHex, hashHex] = stored.split(":");
  const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map(h => parseInt(h, 16)));
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations: 100_000 },
    key,
    256
  );
  const candidate = Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, "0")).join("");
  return candidate === hashHex;
}

// --- Session management ---

function genToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createAdminUser(email: string, password: string, name: string) {
  const passwordHash = await hash(password);
  await db().insert(adminUsers).values({
    email,
    passwordHash,
    name,
    createdAt: new Date().toISOString(),
  });
}

export async function loginUser(email: string, password: string): Promise<string | null> {
  const [user] = await db().select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
  if (!user) return null;
  const ok = await verify(password, user.passwordHash);
  if (!ok) return null;

  const token = genToken();
  await db().insert(sessions).values({
    id: token,
    role: "admin",
    userId: user.id,
    expiresAt: Date.now() + SESSION_TTL_MS,
    createdAt: Date.now(),
  });
  return token;
}

export async function validateSession(token: string) {
  const [session] = await db()
    .select({ session: sessions, user: adminUsers })
    .from(sessions)
    .innerJoin(adminUsers, eq(sessions.userId, adminUsers.id))
    .where(and(eq(sessions.id, token), eq(sessions.role, "admin")))
    .limit(1);

  if (!session) return null;
  if (session.session.expiresAt < Date.now()) {
    await db().delete(sessions).where(eq(sessions.id, token));
    return null;
  }
  return { user: session.user, session: session.session };
}

export async function deleteSession(token: string) {
  await db().delete(sessions).where(eq(sessions.id, token));
}

export async function getSessionFromCookies() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return validateSession(token);
}

export function sessionCookieOptions(token: string) {
  return {
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  };
}

// --- PSB santri (registrant) sessions ---
// Polymorphic rows in the same `sessions` table, role='santri'. subjectId is the
// pendaftar.id in eskahade-db. Cookie is psb_sess so it never collides with the
// admin guard (which requires role='admin').

export async function createSantriSession(pendaftarId: string): Promise<string> {
  const token = genToken();
  await db().insert(sessions).values({
    id: token,
    role: "santri",
    subjectId: pendaftarId,
    expiresAt: Date.now() + SESSION_TTL_MS,
    createdAt: Date.now(),
  });
  return token;
}

export async function validateSantriSession(token: string): Promise<{ subjectId: string } | null> {
  const [s] = await db()
    .select()
    .from(sessions)
    .where(and(eq(sessions.id, token), eq(sessions.role, "santri")))
    .limit(1);
  if (!s || !s.subjectId) return null;
  if (s.expiresAt < Date.now()) {
    await db().delete(sessions).where(eq(sessions.id, token));
    return null;
  }
  return { subjectId: s.subjectId };
}

export async function getSantriSessionFromCookies() {
  const jar = await cookies();
  const token = jar.get(PSB_SESSION_COOKIE)?.value;
  if (!token) return null;
  return validateSantriSession(token);
}

export function psbSessionCookieOptions(token: string) {
  return {
    name: PSB_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  };
}
