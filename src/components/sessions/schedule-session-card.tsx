"use client";

import * as React from "react";
import { CalendarDays, MapPin } from "lucide-react";
import { Card } from "@/components/common/card";
import { SessionAgendaTable } from "@/components/sessions/session-agenda-table";
import { cn } from "@/lib/utils/cn";
import type { SessionRecord } from "@/types/content";

export function ScheduleSessionList({ sessions }: { sessions: SessionRecord[] }) {
  const [activeIdx, setActiveIdx] = React.useState(0);
  const session = sessions[activeIdx];
  const hasAgenda = Boolean(session?.agenda && session.agenda.length > 0);

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

// 하위 호환용 (기존 단일 카드 사용처가 있을 경우)
export function ScheduleSessionCard({ session }: { session: SessionRecord }) {
  return <ScheduleSessionList sessions={[session]} />;
}
