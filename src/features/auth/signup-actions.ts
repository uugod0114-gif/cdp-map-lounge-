"use server";

import { findRosterMemberByEmail } from "@/lib/roster/google-sheet";
import { appendRosterRow } from "@/lib/roster/append-webhook";
import { sendVerificationEmailViaAppsScript } from "@/lib/email/apps-script-mailer";
import { createPendingCode, verifyPendingCode } from "@/services/auth-service";
import { recordLogin } from "@/services/content-service";
import type { UserRole } from "@/types/content";

const CATEGORY_LABEL: Record<"learner" | "auditor", string> = {
  learner: "수강",
  auditor: "청강",
};

export interface RequestCodeResult {
  ok: boolean;
  message?: string;
}

/** 1단계: 이름 + 그룹웨어 이메일 + 수강/청강 선택 → 바로 인증코드 발송 (명단 사전 확인 없음) */
export async function requestSignupCode(
  name: string,
  email: string,
  category: "learner" | "auditor",
): Promise<RequestCodeResult> {
  const trimmedName = name.trim();
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedName || !trimmedEmail) {
    return { ok: false, message: "이름과 이메일을 모두 입력해 주세요." };
  }
  if (!trimmedEmail.includes("@")) {
    return { ok: false, message: "올바른 이메일 형식이 아니에요." };
  }

  const code = createPendingCode(trimmedName, trimmedEmail, category);
  const emailResult = await sendVerificationEmailViaAppsScript(trimmedEmail, code);

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

/** 2단계: 인증코드 확인 → 통과하면 "라운지 명단" 시트에 자동으로 한 줄 추가(회원가입 완료) */
export async function verifySignupCode(email: string, code: string): Promise<VerifySignupResult> {
  const result = verifyPendingCode(email, code);
  if (!result.ok) {
    return { ok: false, message: result.message };
  }

  const role = result.role as "learner" | "auditor";
  const appendResult = await appendRosterRow(CATEGORY_LABEL[role], result.name, email.trim().toLowerCase());
  if (!appendResult.ok) {
    return {
      ok: false,
      message: appendResult.message ?? "명단 등록에 실패했어요. 운영진에게 문의해 주세요.",
    };
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

/** 재로그인: "라운지 명단" 시트를 기준으로 이메일이 있는지 확인 (시트가 곧 회원 명단) */
export async function loginWithEmail(email: string): Promise<EmailLoginResult> {
  const trimmedEmail = email.trim().toLowerCase();
  if (!trimmedEmail) {
    return { ok: false, message: "이메일을 입력해 주세요." };
  }

  const member = await findRosterMemberByEmail(trimmedEmail);
  if (!member) {
    return {
      ok: false,
      message: "가입된 이메일을 찾을 수 없어요. 먼저 회원가입을 진행해 주세요.",
    };
  }

  const role = member.role as UserRole;
  await recordLogin(member.name, role);
  return { ok: true, name: member.name, role };
}