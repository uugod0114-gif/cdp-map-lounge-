"use server";

import { revalidatePath } from "next/cache";
import { addSessionQuestion, answerSessionQuestion } from "@/services/content-service";
import type { UserRole } from "@/types/content";

export async function submitQuestionAction(
  sessionId: string,
  authorName: string,
  authorRole: UserRole,
  message: string,
) {
  if (!message.trim()) return { ok: false, message: "질문 내용을 입력해 주세요." };
  await addSessionQuestion(sessionId, authorName || "익명", authorRole, message.trim());
  revalidatePath(`/sessions/${sessionId}`);
  revalidatePath("/admin/feedback");
  return { ok: true };
}

export async function answerQuestionAction(
  questionId: string,
  sessionId: string,
  answer: string,
  answeredBy: string,
) {
  if (!answer.trim()) return { ok: false, message: "답변 내용을 입력해 주세요." };
  await answerSessionQuestion(questionId, answer.trim(), answeredBy);
  revalidatePath(`/sessions/${sessionId}`);
  revalidatePath("/admin/feedback");
  return { ok: true };
}
