import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { LoungeShell } from "@/components/layout/lounge-shell";
import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { listSessionQuestions, listSessions } from "@/services/content-service";

export default async function InstructorFeedbackOverviewPage() {
  const allSessions = await listSessions();
  // Phase 1: 데모 로그인 이름과 세션의 instructor 필드를 그대로 비교합니다.
  // (실 서비스에서는 로그인 세션의 실제 이름과 비교하도록 클라이언트 쪽에서 필터링하는 게 안전합니다)
  const sessionsWithCounts = await Promise.all(
    allSessions.map(async (s) => ({
      session: s,
      questions: await listSessionQuestions(s.id),
    })),
  );

  return (
    <LoungeShell>
      <div className="mb-2 flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-map-navy" />
        <h1 className="font-display text-2xl font-medium text-map-ink">내 강의 질문 / 피드백</h1>
      </div>
      <p className="mb-6 text-sm text-slate-500">
        담당하신 회차에 달린 질문을 확인하고 답변할 수 있어요. (본인 담당 회차만 표시되도록
        추가 필터링은 3번 담당자가 이어서 작업합니다)
      </p>
      <div className="flex flex-col gap-3">
        {sessionsWithCounts.map(({ session, questions }) => {
          const unanswered = questions.filter((q) => !q.answer).length;
          return (
            <Link key={session.id} href={`/sessions/${session.id}`}>
              <Card className="flex items-center justify-between border-map-navy/10 hover:border-map-navy">
                <div>
                  <p className="text-xs font-semibold text-map-navy">{session.week}회차</p>
                  <p className="font-semibold text-map-ink">{session.title}</p>
                  <p className="mt-1 text-xs text-slate-400">담당 강사: {session.instructor}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="neutral">질문 {questions.length}건</Badge>
                  {unanswered > 0 && <Badge variant="warning">미답변 {unanswered}건</Badge>}
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </LoungeShell>
  );
}
