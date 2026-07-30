"use server";

import { revalidatePath } from "next/cache";
import { saveSessionDraft } from "@/services/content-service";
import { assertPermission } from "@/lib/permissions/roles";
import type { SessionRecord, UserRole } from "@/types/content";

export async function updateSessionScheduleAction(
  sessionId: string,
  patch: Pick<
    SessionRecord,
    "title" | "summary" | "date" | "startTime" | "endTime" | "location"
  >,
  actorName: string,
  actorRole: UserRole,
) {
  assertPermission(actorRole, "session.edit");
  const session = await saveSessionDraft(sessionId, patch, actorName);
  revalidatePath("/admin/schedule");
  revalidatePath("/schedule");
  revalidatePath("/");
  revalidatePath(`/sessions/${sessionId}`);
  return { ok: Boolean(session) };
}
