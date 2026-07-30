"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/common/button";
import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { AnonAvatar } from "@/components/common/anon-avatar";
import { useDemoUser } from "@/features/auth/role-context";
import { isStaff, ROLE_LABEL } from "@/lib/permissions/roles";
import { submitQuestionAction, answerQuestionAction } from "@/features/feedback/qna-actions";
import type { SessionQuestion } from "@/types/content";

/**
 * 회차별 Q&A. 서버(content-service) 메모리에 저장되어 같은 배포를 보는
 * 모든 사람에게 "새로고침 시" 함께 보인다. (Phase 1)
 * 실시간 push는 Phase 2에서 Supabase Realtime 채널로 교체하면 된다.
 */
export function SessionQnaPanel({
  sessionId,
  questions,
}: {
  sessionId: string;
  questions: SessionQuestion[];
}) {
  const { user, isLoggedIn } = useDemoUser();
  const router = useRouter();
  const [message, setMessage] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [answerDrafts, setAnswerDrafts] = React.useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    await submitQuestionAction(sessionId, user.name, user.role, message.trim());
    setSubmitting(false);
    setMessage("");
    router.refresh();
  }

  async function handleAnswer(questionId: string) {
    const answer = answerDrafts[questionId];
    if (!answer?.trim()) return;
    await answerQuestionAction(questionId, sessionId, answer.trim(), user.name);
    setAnswerDrafts((prev) => ({ ...prev, [questionId]: "" }));
    router.refresh();
  }

  return (
    <Card className="border-map-navy/10">
      <div className="mb-4 flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-map-navy" />
        <h3 className="font-semibold text-map-ink">운영진에게 Q&A 남기기</h3>
      </div>

      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="mb-5 flex flex-col gap-2 sm:flex-row">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="궁금한 점을 남겨주세요 · 익명 아이콘으로 표시됩니다"
            className="flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
          />
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "등록 중…" : "질문 등록"}
          </Button>
        </form>
      ) : (
        <p className="mb-5 text-sm text-slate-400">질문을 남기려면 먼저 로그인해 주세요.</p>
      )}

      {questions.length === 0 ? (
        <p className="text-sm text-slate-400">아직 등록된 질문이 없습니다.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {questions.map((q) => (
            <div key={q.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-sm font-semibold text-map-ink">
                  {/* 익명 표시: 실명 대신 작성자별 고정 아이콘 아바타 */}
                  <AnonAvatar seed={q.authorName} size={28} showLabel />
                  <Badge variant="neutral">{ROLE_LABEL[q.authorRole]}</Badge>
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(q.createdAt).toLocaleString("ko-KR", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{q.message}</p>

              {q.answer ? (
                <div className="mt-3 rounded-lg bg-white p-3 text-sm">
                  <p className="font-semibold text-map-navy">
                    {q.answeredBy}의 답변
                  </p>
                  <p className="mt-1 text-slate-600">{q.answer}</p>
                </div>
              ) : isStaff(user.role) ? (
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <input
                    value={answerDrafts[q.id] ?? ""}
                    onChange={(e) =>
                      setAnswerDrafts((prev) => ({ ...prev, [q.id]: e.target.value }))
                    }
                    placeholder="답변을 입력해 주세요"
                    className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                  <Button size="sm" variant="outline" onClick={() => handleAnswer(q.id)}>
                    답변 등록
                  </Button>
                </div>
              ) : (
                <p className="mt-3 text-xs text-slate-400">아직 운영진 답변 대기 중입니다.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
