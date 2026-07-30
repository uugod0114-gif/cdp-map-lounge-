"use server";

import { findRosterMemberByName } from "@/lib/roster/google-sheet";
import { recordLogin } from "@/services/content-service";

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
      message:
        "라운지 명단에서 이름을 찾을 수 없어요. 구글시트에 등록된 이름과 정확히 같은지 확인해 주세요.",
    };
  }

  await recordLogin(member.name, member.role);
  return { ok: true, name: member.name, role: member.role };
}
