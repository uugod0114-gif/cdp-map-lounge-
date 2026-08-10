"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Save, Send } from "lucide-react";
import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import { useDemoUser } from "@/features/auth/role-context";
import { useToast } from "@/components/common/toast";
import {
  getMySubmissionAction,
  reopenSubmissionAction,
  saveDraftAction,
  submitAssignmentAction,
} from "@/features/assignments/actions";
import type { Assignment, AssignmentSubmission } from "@/types/content";

export function AssignmentSubmissionForm({ assignment }: { assignment: Assignment }) {
  const { user, isLoggedIn } = useDemoUser();
  const { show } = useToast();
  const [submission, setSubmission] = React.useState<AssignmentSubmission | null>(null);
  const [content, setContent] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!isLoggedIn) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- 로그인 상태(외부 컨텍스트) 변화에 따른 동기화
      setLoading(false);
      return;
    }
    getMySubmissionAction(assignment.id, user.name).then((existing) => {
      setSubmission(existing ?? null);
      setContent(existing?.content ?? "");
      setLoading(false);
    });
  }, [assignment.id, user.name, isLoggedIn]);

  const isSubmitted = submission?.status === "submitted";

  async function handleSaveDraft() {
    setSaving(true);
    const result = await saveDraftAction(assignment.id, user.name, content);
    setSaving(false);
    if (result.ok && result.submission) {
      setSubmission(result.submission);
      show("임시저장했어요.");
    } else {
      show(result.message ?? "저장에 실패했어요.", "error");
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    const result = await submitAssignmentAction(assignment.id, user.name, content);
    setSubmitting(false);
    if (result.ok && result.submission) {
      setSubmission(result.submission);
      show("과제를 제출했어요.");
    } else {
      show(result.message ?? "제출에 실패했어요.", "error");
    }
  }

  async function handleReopen() {
    if (!submission) return;
    const result = await reopenSubmissionAction(submission.id, assignment.id, user.name);
    if (result.submission) {
      setSubmission(result.submission);
      show("다시 작성할 수 있어요.");
    }
  }

  if (!isLoggedIn) {
    return <Card className="text-center text-slate-400">로그인 후 이용할 수 있습니다.</Card>;
  }
  if (loading) {
    return <Card className="text-center text-slate-400">불러오는 중…</Card>;
  }

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/learner/assignments"
        className="flex w-fit items-center gap-1 text-sm text-slate-500 hover:text-map-navy"
      >
        <ArrowLeft className="h-4 w-4" /> 과제 목록으로
      </Link>

      <Card className="border-map-navy/10">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-map-ink">내 작성 내용</span>
          {isSubmitted ? (
            <Badge variant="success">제출완료</Badge>
          ) : submission ? (
            <Badge variant="warning">임시저장됨</Badge>
          ) : (
            <Badge variant="neutral">미작성</Badge>
          )}
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitted}
          rows={14}
          placeholder="자기소개서를 작성하듯, 이번 회차 과제 내용을 편하게 적어주세요. 중간에 임시저장해두면 나중에 이어서 쓸 수 있어요."
          className="w-full resize-y rounded-xl border border-slate-200 p-4 text-sm leading-relaxed text-map-ink outline-none focus:border-map-navy disabled:bg-slate-50 disabled:text-slate-500"
        />

        {submission?.updatedAt && (
          <p className="mt-2 text-xs text-slate-400">
            마지막 저장: {new Date(submission.updatedAt).toLocaleString("ko-KR")}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {!isSubmitted ? (
            <>
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                disabled={saving || !content.trim()}
              >
                <Save className="h-4 w-4" /> {saving ? "저장 중…" : "임시저장"}
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={submitting || !content.trim()}
              >
                <Send className="h-4 w-4" /> {submitting ? "제출 중…" : "제출하기"}
              </Button>
            </>
          ) : (
            <Button variant="subtle" onClick={handleReopen}>
              수정하기 (제출 취소하고 다시 작성)
            </Button>
          )}
        </div>
      </Card>

      {submission?.mentorFeedback && (
        <Card className="border-map-navy-mute/40 bg-map-gold-soft/30">
          <div className="mb-2 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-map-navy" />
            <span className="text-sm font-semibold text-map-ink">{submission.feedbackBy}의 피드백</span>
          </div>
          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
            {submission.mentorFeedback}
          </p>
        </Card>
      )}
    </div>
  );
}
