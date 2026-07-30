"use server";

import {
  findRosterMemberByNameAndEmail,
  findRosterMemberByEmail,
} from "@/lib/roster/google-sheet";
import { sendVerificationEmail } from "@/lib/email/resend";
import {
  createPendingCode,
  verifyPendingCode,
  findRegisteredUserByEmail,
} from "@/services/auth-service";
import { recordLogin } from "@/services/content-service";

export interface RequestCodeResult {
  ok: boolean;
  message?: string;
}

/** 1단계: 이름 + 그룹웨어 이메일로 인증코드 발송 요청 */
export async function requestSignupCode(name: string, email: string): Promise<RequestCodeResult> {
  const trimmedName = name.trim();
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedName || !trimmedEmail) {
    return { ok: false, message: "이름과 이메일을 모두 입력해 주세요." };
  }
  if (!trimmedEmail.includes("@")) {
    return { ok: false, message: "올바른 이메일 형식이 아니에요." };
  }

  const member = await findRosterMemberByNameAndEmail(trimmedName, trimmedEmail);
  if (!member) {
    return {
      ok: false,
      message: "명단에서 이름과 이메일이 일치하는 정보를 찾을 수 없어요. 정확히 입력했는지 확인해 주세요.",
    };
  }

  const code = createPendingCode(member.name, member.email, member.role);
  const emailResult = await sendVerificationEmail(member.email, code);

  if (!emailResult.ok) {
    return {
      ok: false,
      message: emailResult.message ?? "인증코드 발송에 실패했어요. 잠시 후 다시 시도해 주세요.",
    };
  }

  return { ok: true };
}

export interface VerifySignupResult {
  ok: boolean;
  name?: string;
  role?: string;
  message?: string;
}

/** 2단계: 이메일로 받은 인증코드 확인 → 최초 1회 완료 시 회원가입 처리 */
export async function verifySignupCode(email: string, code: string): Promise<VerifySignupResult> {
  const result = verifyPendingCode(email, code);
  if (!result.ok) {
    return { ok: false, message: result.message };
  }
  await recordLogin(result.name, result.role);
  return { ok: true, name: result.name, role: result.role };
}

export interface EmailLoginResult {
  ok: boolean;
  name?: string;
  role?: string;
  message?: string;
}

/** 이미 가입된 사용자의 이메일 로그인 (재인증 코드 없이 바로) */
export async function loginWithEmail(email: string): Promise<EmailLoginResult> {
  const trimmedEmail = email.trim().toLowerCase();
  if (!trimmedEmail) {
    return { ok: false, message: "이메일을 입력해 주세요." };
  }

  const registered = findRegisteredUserByEmail(trimmedEmail);
  if (!registered) {
    // 아직 가입 전이더라도 명단에 있으면 "가입이 필요하다"는 걸 구분해서 알려준다.
    const rosterMember = await findRosterMemberByEmail(trimmedEmail);
    if (rosterMember) {
      return { ok: false, message: "아직 회원가입 전이에요. 먼저 회원가입을 진행해 주세요." };
    }
    return { ok: false, message: "가입된 계정을 찾을 수 없어요." };
  }

  await recordLogin(registered.name, registered.role);
  return { ok: true, name: registered.name, role: registered.role };
}
