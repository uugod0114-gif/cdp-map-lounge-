"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/common/button";
import { Card } from "@/components/common/card";
import { useDemoUser } from "@/features/auth/role-context";
import { createMaterialsBulkAction, deleteMaterialAction } from "@/features/materials/actions";
import type { MaterialItem, SessionRecord } from "@/types/content";

export function MaterialsAdminForm({
  sessions,
  materials,
}: {
  sessions: SessionRecord[];
  materials: MaterialItem[];
}) {
  const { actualUser } = useDemoUser();
  const router = useRouter();
  const [sessionId, setSessionId] = React.useState(sessions[0]?.id ?? "");
  const [rawText, setRawText] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!sessionId || !rawText.trim()) return;
    setSubmitting(true);
    const res = await createMaterialsBulkAction(sessionId, rawText, actualUser.name, actualUser.role);
    setSubmitting(false);

    if (!res.ok) {
      setResult(res.message ?? "등록에 실패했습니다.");
      return;
    }
    setResult(
      `${res.createdCount}건 등록 완료${res.skipped?.length ? ` (형식이 맞지 않아 건너뛴 줄: ${res.skipped.length}건)` : ""}`,
    );
    setRawText("");
    router.refresh();
  }

  async function handleDelete(materialId: string) {
    await deleteMaterialAction(materialId, actualUser.name, actualUser.role);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-map-navy/10">
        <h3 className="mb-3 font-semibold text-map-ink">회차별 자료 일괄 등록</h3>
        <p className="mb-4 text-sm text-slate-500">
          웍스드라이브 등에서 각 파일의 <b>개별 공유 링크</b>를 복사해서, 한 줄에 하나씩
          <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">제목 | 링크</code>
          형식으로 붙여넣으면 한 번에 등록됩니다. (제목 생략하고 링크만 넣어도 됩니다)
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">회차 선택</label>
            <select
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.week}회차 · {s.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">
              자료 목록 (한 줄에 하나씩)
            </label>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder={"1회차 오리엔테이션 자료 | https://worksdrive.company.com/file/abc123\nUBIST 실전 자료 | https://worksdrive.company.com/file/def456"}
              className="min-h-32 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono"
            />
          </div>
          <Button type="submit" variant="primary" disabled={submitting} className="self-start">
            {submitting ? "등록 중…" : "일괄 등록"}
          </Button>
          {result && <p className="text-sm text-map-navy">{result}</p>}
        </form>
      </Card>

      <Card className="border-map-navy/10">
        <h3 className="mb-3 font-semibold text-map-ink">등록된 자료</h3>
        {materials.length === 0 ? (
          <p className="text-sm text-slate-400">아직 등록된 자료가 없습니다.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {materials.map((m) => {
              const session = sessions.find((s) => s.id === m.sessionId);
              return (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm"
                >
                  <div>
                    <span className="mr-2 text-xs font-semibold text-map-navy-mute">
                      {session ? `${session.week}회차` : "미지정"}
                    </span>
                    <span className="font-medium text-map-ink">{m.title}</span>
                    {m.flipbookEnabled && (
                      <span className="ml-2 rounded-full bg-map-gold-soft px-2 py-0.5 text-xs text-amber-700">
                        플립북
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(m.id)}
                    className="text-slate-300 hover:text-red-500"
                    aria-label="삭제"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
