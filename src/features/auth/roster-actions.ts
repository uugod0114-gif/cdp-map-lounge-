"use server";

import { findRosterMemberByName } from "@/lib/roster/google-sheet";

export interface RosterLoginResult {
  ok: boolean;
  name?: string;
  role?: string;
  message?: string;
}

export async function loginWithRosterName(name: string): Promise<RosterLoginResult> {
  const trimmed = name.trim();
  if (!trimmed) {
    return { ok: false, message: "이름을 입력해 주세요." };
  }

  const member = await findRosterMemberByName(trimmed);
  if (!member) {
    return {
      ok: false,
      message: "신청 접수한 이름과 정확히 같은지 확인해 주세요.",
    };
  }

  return { ok: true, name: member.name, role: member.role };
}
