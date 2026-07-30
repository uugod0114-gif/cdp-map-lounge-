"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Button } from "@/components/common/button";
import { Card } from "@/components/common/card";
import { useDemoUser } from "@/features/auth/role-context";
import { updateSessionScheduleAction } from "@/features/schedule/actions";
import type { SessionRecord } from "@/types/content";

type EditableField = "title" | "summary" | "date" | "startTime" | "endTime" | "location";

export function ScheduleEditorTable({ sessions }: { sessions: SessionRecord[] }) {
  const { actualUser } = useDemoUser();
  const router = useRouter();
  const [drafts, setDrafts] = React.useState<Record<string, SessionRecord>>(
    Object.fromEntries(sessions.map((s) => [s.id, s])),
  );
  const [savingId, setSavingId] = React.useState<string | null>(null);
  const [savedId, setSavedId] = React.useState<string | null>(null);

  function updateField(sessionId: string, field: EditableField, value: string) {
    setDrafts((prev) => ({ ...prev, [sessionId]: { ...prev[sessionId], [field]: value } }));
    setSavedId(null);
  }

  async function handleSave(sessionId: string) {
    const draft = drafts[sessionId];
    setSavingId(sessionId);
    await updateSessionScheduleAction(
      sessionId,
      {
        title: draft.title,
        summary: draft.summary,
        date: draft.date,
        startTime: draft.startTime,
        endTime: draft.endTime,
        location: draft.location,
      },
      actualUser.name,
      actualUser.role,
    );
    setSavingId(null);
    setSavedId(sessionId);
    router.refresh();
  }

  const inputClass =
    "w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm focus:border-map-navy";

  return (
    <div className="flex flex-col gap-4">
      {sessions.map((s) => {
        const draft = drafts[s.id];
        return (
          <Card key={s.id} className="border-map-navy/10">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-map-navy-mute">{s.week}회차</span>
              <Button
                size="sm"
                variant={savedId === s.id ? "subtle" : "primary"}
                onClick={() => handleSave(s.id)}
                disabled={savingId === s.id}
              >
                <Save className="h-4 w-4" />
                {savingId === s.id ? "저장 중…" : savedId === s.id ? "저장됨" : "저장"}
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-500">세션 제목</label>
                <input
                  className={inputClass}
                  value={draft.title}
                  onChange={(e) => updateField(s.id, "title", e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-500">한 줄 소개</label>
                <input
                  className={inputClass}
                  value={draft.summary}
                  onChange={(e) => updateField(s.id, "summary", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">날짜</label>
                <input
                  type="date"
                  className={inputClass}
                  value={draft.date}
                  onChange={(e) => updateField(s.id, "date", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">장소</label>
                <input
                  className={inputClass}
                  value={draft.location}
                  onChange={(e) => updateField(s.id, "location", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">시작 시간</label>
                <input
                  type="time"
                  className={inputClass}
                  value={draft.startTime}
                  onChange={(e) => updateField(s.id, "startTime", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">종료 시간</label>
                <input
                  type="time"
                  className={inputClass}
                  value={draft.endTime}
                  onChange={(e) => updateField(s.id, "endTime", e.target.value)}
                />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
