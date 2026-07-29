import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { LoungeShell } from "@/components/layout/lounge-shell";
import { Card } from "@/components/common/card";
import { listSessions } from "@/services/content-service";

export default async function FeedbackHubPage() {
  const sessions = await listSessions();

  return (
    <LoungeShell>
      <h1 className="mb-2 font-display text-2xl font-medium text-map-ink">실시간 피드백</h1>
      <p className="mb-6 text-sm text-slate-500">
        회차를 선택하면 해당 강의의 실시간 피드백/Q&A 공간으로 이동합니다.
      </p>
      <div className="flex flex-col gap-3">
        {sessions.map((s) => (
          <Link key={s.id} href={`/sessions/${s.id}`}>
            <Card className="flex items-center justify-between border-map-navy/10 hover:border-map-navy">
              <div>
                <p className="text-xs font-semibold text-map-navy-mute">{s.week}회차</p>
                <p className="font-semibold text-map-ink">{s.title}</p>
              </div>
              <span className="flex items-center gap-1 text-sm text-map-navy">
                <MessageCircle className="h-4 w-4" /> 피드백 남기기
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </LoungeShell>
  );
}