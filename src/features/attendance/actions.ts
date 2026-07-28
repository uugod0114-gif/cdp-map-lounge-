"use server";

import { revalidatePath } from "next/cache";
import { checkAttendance, getAttendanceForMember } from "@/services/content-service";

export async function checkAttendanceAction(
  sessionId: string,
  memberName: string,
  period: "am" | "pm",
) {
  if (!memberName.trim()) {
    return { ok: false, message: "이름 정보가 없어 출석 체크를 할 수 없습니다." };
  }
  const record = await checkAttendance(sessionId, memberName, period);
  revalidatePath("/learner/attendance");
  return { ok: true, record };
}

export async function getMyAttendanceAction(memberName: string) {
  if (!memberName.trim()) return [];
  return getAttendanceForMember(memberName);
}
