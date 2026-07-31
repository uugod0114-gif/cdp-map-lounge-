"use server";

import { revalidatePath } from "next/cache";
import {
  addLoungeComment,
  addLoungePost,
  toggleLoungeLike,
  toggleLoungePin,
} from "@/services/content-service";
import type { LoungeBoard, UserRole } from "@/types/content";

const BOARD_PATH: Record<LoungeBoard, string> = {
  auditor: "/feedback",
  learner: "/feedback",
};

export async function submitLoungePostAction(
  board: LoungeBoard,
  authorName: string,
  authorRole: UserRole,
  message: string,
  sessionTag?: string,
) {
  if (!message.trim()) return { ok: false, message: "내용을 입력해 주세요." };
  await addLoungePost(board, authorName || "익명", authorRole, message.trim(), sessionTag);
  revalidatePath(BOARD_PATH[board]);
  return { ok: true };
}

export async function submitLoungeCommentAction(
  board: LoungeBoard,
  postId: string,
  authorName: string,
  authorRole: UserRole,
  message: string,
) {
  if (!message.trim()) return { ok: false, message: "댓글 내용을 입력해 주세요." };
  await addLoungeComment(postId, authorName || "익명", authorRole, message.trim());
  revalidatePath(BOARD_PATH[board]);
  return { ok: true };
}

export async function toggleLoungeLikeAction(
  board: LoungeBoard,
  postId: string,
  memberName: string,
) {
  await toggleLoungeLike(postId, memberName || "익명");
  revalidatePath(BOARD_PATH[board]);
  return { ok: true };
}

export async function toggleLoungePinAction(
  board: LoungeBoard,
  postId: string,
  actor: string,
) {
  await toggleLoungePin(postId, actor);
  revalidatePath(BOARD_PATH[board]);
  return { ok: true };
}
