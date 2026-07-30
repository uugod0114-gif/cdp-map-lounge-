"use client";

import * as React from "react";
import { ChevronDown, CalendarDays, MapPin } from "lucide-react";
import { Card } from "@/components/common/card";
import { SessionAgendaTable } from "@/components/sessions/session-agenda-table";
import { cn } from "@/lib/utils/cn";
import type { SessionRecord } from "@/types/content";

export function ScheduleSessionCard({ session }: { session: SessionRecord }) {
  const [open, setOpen] = React.useState(false);
  const hasAgenda = Boolean(session.agenda && session.agenda.length > 0);

  return (
    <Card className="border-map-navy/10">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-map-navy">{session.week}회차</p>
          <p className="mt-1 text-lg font-bold text-map-ink">{session.title}</p>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500">
        <span className="flex items-center gap-1">
          <CalendarDays className="h-4 w-4" /> {session.date} {session.startTime}-{session.endTime}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="h-4 w-4" /> {session.location || "미정"}
        </span>
      </div>

      {hasAgenda && (
        <>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="mt-3 flex items-center gap-1 text-sm font-semibold text-map-navy"
          >
            아젠다 {open ? "접기" : "보기"}
            <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
          </button>
          {open && (
            <div className="mt-4">
              <SessionAgendaTable agenda={session.agenda ?? []} />
            </div>
          )}
        </>
      )}
    </Card>
  );
}
