import "server-only";
import type { UserRole } from "@/types/content";

export interface RegisteredUser {
  email: string;
  name: string;
  role: UserRole;
  registeredAt: string;
}

interface VerificationEntry {
  code: string;
  name: string;
  email: string;
  role: UserRole;
  expiresAt: number;
  attempts: number;
}

interface AuthStore {
  registeredUsers: RegisteredUser[];
  pendingCodes: Map<string, VerificationEntry>;
}

const globalForAuth = globalThis as unknown as { __cdpMapAuthStore?: AuthStore };

const store: AuthStore =
  globalForAuth.__cdpMapAuthStore ??
  (globalForAuth.__cdpMapAuthStore = { registeredUsers: [], pendingCodes: new Map() });

const CODE_TTL_MS = 10 * 60 * 1000; // 10분
const MAX_ATTEMPTS = 5;

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function createPendingCode(name: string, email: string, role: UserRole): string {
  const code = generateCode();
  store.pendingCodes.set(email.toLowerCase(), {
    code,
    name,
    email: email.toLowerCase(),
    role,
    expiresAt: Date.now() + CODE_TTL_MS,
    attempts: 0,
  });
  return code;
}

export type VerifyCodeResult =
  | { ok: true; name: string; role: UserRole }
  | { ok: false; message: string };

export function verifyPendingCode(email: string, code: string): VerifyCodeResult {
  const key = email.toLowerCase();
  const entry = store.pendingCodes.get(key);

  if (!entry) {
    return { ok: false, message: "인증을 먼저 요청해 주세요." };
  }
  if (Date.now() > entry.expiresAt) {
    store.pendingCodes.delete(key);
    return { ok: false, message: "인증코드가 만료됐어요. 다시 요청해 주세요." };
  }
  if (entry.attempts >= MAX_ATTEMPTS) {
    store.pendingCodes.delete(key);
    return { ok: false, message: "시도 횟수를 초과했어요. 다시 요청해 주세요." };
  }
  if (entry.code !== code.trim()) {
    entry.attempts += 1;
    return { ok: false, message: "인증코드가 올바르지 않아요." };
  }

  store.pendingCodes.delete(key);

  const existing = store.registeredUsers.find((u) => u.email === key);
  if (!existing) {
    store.registeredUsers.push({
      email: key,
      name: entry.name,
      role: entry.role,
      registeredAt: new Date().toISOString(),
    });
  }

  return { ok: true, name: entry.name, role: entry.role };
}

export function findRegisteredUserByEmail(email: string): RegisteredUser | undefined {
  return store.registeredUsers.find((u) => u.email === email.trim().toLowerCase());
}
