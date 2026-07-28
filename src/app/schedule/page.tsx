import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { LoungeShell } from "@/components/layout/lounge-shell";
import { Card } from "@/components/common/card";
import { StatusBadge } from "@/components/common/badge";
import { listSessions } from "@/services/content-service";

export default async function SchedulePage() {
  const sessions = await listSessions();
  return (
    <LoungeShell>
      <h1 className="mb-6 font-display text-2xl font-medium text-map-ink">교육 일정</h1>
      <div className="flex flex-col gap-4">
        {sessions.map((s) => (
          <Link key={s.id} href={`/sessions/${s.id}`}>
            <Card className="flex flex-col gap-2 hover:border-map-navy sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold text-map-navy-mute">{s.week}회차</p>
                <p className="text-lg font-bold text-map-ink">{s.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" /> {s.date} {s.startTime}-{s.endTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> {s.location || "미정"}
                  </span>
                </div>
              </div>
              <StatusBadge status={s.status} />
            </Card>
          </Link>
        ))}
      </div>
    </LoungeShell>
  );
}
