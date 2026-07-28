"use server";

import { revalidatePath } from "next/cache";
import {
  publishPage,
  requestPageReview,
  revertPageToRevision,
  saveDraftBlocks,
  unpublishPage,
} from "@/services/content-service";
import { assertPermission } from "@/lib/permissions/roles";
import type { ContentBlock, UserRole } from "@/types/content";

/**
 * 모든 액션의 첫 줄에서 서버 측 권한을 재검증한다.
 * 화면에서 버튼을 숨기는 것과 별개로, 실제 요청은 여기서 다시 막는다.
 * Phase 2에서는 actorRole을 Supabase 세션에서 직접 조회하도록 교체한다.
 */

export async function saveDraftAction(
  pageId: string,
  blocks: ContentBlock[],
  actorName: string,
  actorRole: UserRole,
) {
  assertPermission(actorRole, "page.edit");
  const page = await saveDraftBlocks(pageId, blocks, actorName);
  revalidatePath(`/admin/pages/${pageId}/edit`);
  revalidatePath("/admin/pages");
  return page;
}

export async function requestReviewAction(
  pageId: string,
  actorName: string,
  actorRole: UserRole,
) {
  assertPermission(actorRole, "page.edit");
  const page = await requestPageReview(pageId, actorName);
  revalidatePath(`/admin/pages/${pageId}/edit`);
  revalidatePath("/admin/pages");
  return page;
}

export async function publishPageAction(
  pageId: string,
  actorName: string,
  actorRole: UserRole,
) {
  assertPermission(actorRole, "page.publish");
  const page = await publishPage(pageId, actorName);
  revalidatePath(`/admin/pages/${pageId}/edit`);
  revalidatePath("/admin/pages");
  revalidatePath("/");
  return page;
}

export async function unpublishPageAction(
  pageId: string,
  actorName: string,
  actorRole: UserRole,
) {
  assertPermission(actorRole, "page.publish");
  const page = await unpublishPage(pageId, actorName);
  revalidatePath(`/admin/pages/${pageId}/edit`);
  revalidatePath("/admin/pages");
  return page;
}

export async function revertPageAction(
  pageId: string,
  revisionId: string,
  actorName: string,
  actorRole: UserRole,
) {
  assertPermission(actorRole, "page.edit");
  const page = await revertPageToRevision(pageId, revisionId, actorName);
  revalidatePath(`/admin/pages/${pageId}/edit`);
  return page;
}
