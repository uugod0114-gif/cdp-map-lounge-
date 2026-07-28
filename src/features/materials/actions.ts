"use server";

import { revalidatePath } from "next/cache";
import { createMaterial, deleteMaterial } from "@/services/content-service";
import { assertPermission } from "@/lib/permissions/roles";
import { detectEmbedKind } from "@/lib/embeds/detect";
import type { UserRole } from "@/types/content";

/**
 * 운영진이 "제목 | 링크" 형태로 여러 줄을 붙여넣으면 한 번에 자료로 등록한다.
 * 구분자는 | 또는 탭(엑셀/시트에서 복사했을 때 대응) 둘 다 허용한다.
 *
 * 예시 입력:
 *   1회차 오리엔테이션 자료 | https://worksdrive.company.com/file/abc123
 *   UBIST 실전 자료 | https://worksdrive.company.com/file/def456
 */
export async function createMaterialsBulkAction(
  sessionId: string,
  rawText: string,
  actorName: string,
  actorRole: UserRole,
) {
  assertPermission(actorRole, "material.upload");

  const lines = rawText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return { ok: false, message: "등록할 자료가 없습니다. 한 줄에 하나씩 입력해 주세요." };
  }

  const created = [];
  const skipped: string[] = [];

  for (const line of lines) {
    const parts = line.split(/\||\t/).map((p) => p.trim());
    const [title, url] = parts.length >= 2 ? parts : [null, parts[0]];

    if (!url || !/^https?:\/\//.test(url)) {
      skipped.push(line);
      continue;
    }

    const kind = detectEmbedKind(url);
    const isFlipbookLike = kind === "pdf" || kind === "flipbook" || url.toLowerCase().includes(".pdf");

    const material = await createMaterial(
      {
        title: title || `자료 ${created.length + 1}`,
        description: "",
        fileType: "pdf",
        sessionId,
        visibilityRoles: ["learner", "auditor"],
        downloadAllowed: kind !== "flipbook",
        flipbookEnabled: isFlipbookLike,
        fileUrl: url,
      },
      actorName,
    );
    created.push(material);
  }

  revalidatePath("/admin/materials");
  revalidatePath("/materials");
  revalidatePath(`/sessions/${sessionId}`);

  return {
    ok: true,
    createdCount: created.length,
    skipped,
  };
}

export async function deleteMaterialAction(
  materialId: string,
  actorName: string,
  actorRole: UserRole,
) {
  assertPermission(actorRole, "material.delete");
  await deleteMaterial(materialId, actorName);
  revalidatePath("/admin/materials");
  revalidatePath("/materials");
}
