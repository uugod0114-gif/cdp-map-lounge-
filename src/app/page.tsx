import Link from "next/link";
import { PublicShell } from "@/components/layout/public-shell";
import { BlockList } from "@/components/cms/block-renderer";
import { Card } from "@/components/common/card";
import { Button } from "@/components/common/button";
import { CalendarDays, MapPin, PlayCircle } from "lucide-react";
import { getPageBySlug, listSessions } from "@/services/content-service";

export default async function HomePage() {
  const page = await getPageBySlug("main");
  const sessions = await listSessions();

  return (
    <PublicShell>
      <BlockList blocks={page?.publishedBlocks ?? []} role="auditor" />

      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-map-navy">강의 일정</p>
            <h2 className="mt-1 font-display text-2xl font-medium text-map-ink">1~5회차 교육 일정</h2>
          </div>
          <Link href="/schedule">
            <Button variant="outline" size="sm">
              전체 일정 보기
            </Button>
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          {sessions.map((session) => (
            <Card key={session.id} className="flex flex-col gap-4 border-map-navy/10">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-map-navy">{session.week}회차</p>
                  <h3 className="mt-1 text-lg font-bold text-map-ink">{session.title}</h3>
                  <p className="mt-2 text-sm text-slate-500">{session.summary}</p>
                </div>
                <span className="rounded-full bg-map-gold-soft/50 px-3 py-1 text-xs font-semibold text-map-navy">
                  {session.date}
                </span>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" /> {session.startTime}-{session.endTime}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> {session.location || "미정"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/sessions/${session.id}`}>
                  <Button variant="primary" size="sm">
                    <PlayCircle className="h-4 w-4" /> 회차별 세부 아젠다 보러가기
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}