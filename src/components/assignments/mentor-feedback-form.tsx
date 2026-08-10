"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import { useDemoUser } from "@/features/auth/role-context";
import { useToast } from "@/components/common/toast";
import { giveMentorFeedbackAction } from "@/features/assignments/actions";
import type { AssignmentSubmission } from "@/types/content";

export function MentorFeedbackForm({ submission }: { submission: AssignmentSubmission }) {
  const { user } = useDemoUser();
  const { show } = useToast();
  const [current, setCurrent] = React.useState(submission);
  const [feedback, setFeedback] = React.useState(submission.mentorFeedback ?? "");
  const [saving, setSaving] = React.useState(false);

  async function handleSave() {
    setSaving(true);
    const result = await giveMentorFeedbackAction(current.id, feedback, user.name);
    setSaving(false);
    if (result.ok && result.submission) {
      setCurrent(result.submission);
      show("피드백을 남겼어요.");
    } else {
      show(result.message ?? "저장에 실패했어요.", "error");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/mentor/assignments"
        className="flex w-fit items-center gap-1 text-sm text-slate-500 hover:text-map-navy"
      >
        <ArrowLeft className="h-4 w-4" /> 수강자 목록으로
      </Link>

      <Card className="border-map-navy/10">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-map-ink">제출 내용</span>
          <Badge variant={current.status === "submitted" ? "success" : "warning"}>
            {current.status === "submitted" ? "제출완료" : "임시저장"}
          </Badge>
        </div>
        <p className="whitespace-pre-line rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-map-ink">
          {current.content || "아직 작성된 내용이 없습니다."}
        </p>
        {current.submittedAt && (
          <p className="mt-2 text-xs text-slate-400">
            제출 시각: {new Date(current.submittedAt).toLocaleString("ko-KR")}
          </p>
        )}
      </Card>

      <Card className="border-map-navy/10">
        <div className="mb-3 flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-map-navy" />
          <span className="text-sm font-semibold text-map-ink">멘토 피드백</span>
        </div>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={8}
          placeholder="이번 회차 과제에 대한 피드백을 남겨주세요."
          className="w-full resize-y rounded-xl border border-slate-200 p-4 text-sm leading-relaxed text-map-ink outline-none focus:border-map-navy"
        />
        <div className="mt-4">
          <Button variant="primary" onClick={handleSave} disabled={saving || !feedback.trim()}>
            {saving ? "저장 중…" : "피드백 저장"}
          </Button>
        </div>
        {current.feedbackAt && (
          <p className="mt-2 text-xs text-slate-400">
            마지막 업데이트: {new Date(current.feedbackAt).toLocaleString("ko-KR")}
          </p>
        )}
      </Card>
    </div>
  );
}
