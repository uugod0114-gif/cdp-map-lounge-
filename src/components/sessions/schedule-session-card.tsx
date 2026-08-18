"use client";

import * as React from "react";
import { CalendarDays, MapPin, ExternalLink } from "lucide-react";
import { Card } from "@/components/common/card";
import { SessionAgendaTable } from "@/components/sessions/session-agenda-table";
import { cn } from "@/lib/utils/cn";
import type { SessionRecord } from "@/types/content";

// 회차별 자료 링크 (자료가 생기면 여기에 추가)
const SESSION_MATERIAL_URL: Record<number, string> = {
  1: "https://works.do/FQiGHsY",
  2: "https://works.do/5NL8Nv0",
};

export function ScheduleSessionList({ sessions }: { sessions: SessionRecord[] }) {
  const [activeIdx, setActiveIdx] = React.useState(0);
  const session = sessions[activeIdx];
  const hasAgenda = Boolean(session?.agenda && session.agenda.length > 0);
  const materialUrl = SESSION_MATERIAL_URL[session?.week ?? 0];

  return (
    <div>
      {/* 회차 탭 */}
      <div className="mb-4 flex flex-wrap gap-2">
        {sessions.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveIdx(i)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-semibold transition",
              activeIdx === i
                ? "border-map-navy bg-map-navy text-white"
                : "border-map-line text-slate-500 hover:border-map-navy hover:text-map-navy",
            )}
          >
            {s.week}회차
          </button>
        ))}
      </div>

      {/* 선택된 회차 내용 */}
      {session && (
        <Card className="border-map-navy/10">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-map-navy">{session.week}회차</p>
              <p className="mt-1 text-lg font-bold text-map-ink">{session.title}</p>
              {session.summary && (
                <p className="mt-1 text-sm text-slate-500">{session.summary}</p>
              )}
            </div>
            {/* 자료 다운로드 버튼 */}
            {materialUrl && (
              <a href={materialUrl} target="_blank" rel="noreferrer" className="shrink-0">
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-full border border-map-navy px-4 py-2 text-xs font-semibold text-map-navy hover:bg-map-navy hover:text-white transition"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> 강의자료 다운로드
                </button>
              </a>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" /> {session.date} {session.startTime}-{session.endTime}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" /> {session.location || "미정"}
            </span>
          </div>

          {hasAgenda && (
            <div className="mt-5">
              <p className="mb-2 text-sm font-semibold text-map-navy">아젠다</p>
              <SessionAgendaTable agenda={session.agenda ?? []} />
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

export function ScheduleSessionCard({ session }: { session: SessionRecord }) {
  return <ScheduleSessionList sessions={[session]} />;
}