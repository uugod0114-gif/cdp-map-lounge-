"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, FileText, MessageSquare, Target, User } from "lucide-react";
import { Card } from "@/components/common/card";
import { Badge, type BadgeProps } from "@/components/common/badge";
import { useDemoUser } from "@/features/auth/role-context";
import {
  getMyMentorMatchAction,
  listSubmissionsByLearnerAction,
} from "@/features/assignments/actions";
import type { Assignment, AssignmentSubmission, LearnerMentorMatch } from "@/types/content";

type DisplayStatus = "not_started" | "draft" | "submitted";

const STATUS_META: Record<DisplayStatus, { label: string; variant: BadgeProps["variant"] }> = {
  not_started: { label: "미작성", variant: "neutral" },
  draft: { label: "임시저장", variant: "warning" },
  submitted: { label: "제출완료", variant: "success" },
};

export function AssignmentListBoard({ assignments }: { assignments: Assignment[] }) {
  const { user, isLoggedIn } = useDemoUser();
  const [match, setMatch] = React.useState<LearnerMentorMatch | null>(null);
  const [submissions, setSubmissions] = React.useState<AssignmentSubmission[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!isLoggedIn) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- 로그인 상태(외부 컨텍스트) 변화에 따른 동기화
      setLoading(false);
      return;
    }
    Promise.all([
      getMyMentorMatchAction(user.name),
      listSubmissionsByLearnerAction(user.name),
    ]).then(([myMatch, mySubmissions]) => {
      setMatch(myMatch ?? null);
      setSubmissions(mySubmissions);
      setLoading(false);
    });
  }, [user.name, isLoggedIn]);

  if (!isLoggedIn) {
    return <Card className="text-center text-slate-400">로그인 후 이용할 수 있습니다.</Card>;
  }
  if (loading) {
    return <Card className="text-center text-slate-400">과제 정보를 불러오는 중…</Card>;
  }

  const submissionFor = (assignmentId: string) =>
    submissions.find((s) => s.assignmentId === assignmentId);

  return (
    <div className="flex flex-col gap-6">
      {match && (
        <Card className="border-map-navy-mute/40 bg-map-gold-soft/40">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-map-navy" />
              <span className="text-sm text-slate-500">담당 멘토</span>
              <span className="font-semibold text-map-ink">{match.mentorName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-map-navy" />
              <span className="text-sm text-slate-500">도전품목</span>
              <span className="font-semibold text-map-ink">{match.challengeItem}</span>
            </div>
          </div>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {assignments.map((assignment) => {
          const submission = submissionFor(assignment.id);
          const status: DisplayStatus = submission?.status ?? "not_started";
          const meta = STATUS_META[status];
          return (
            <Link key={assignment.id} href={`/learner/assignments/${assignment.id}`}>
              <Card className="flex items-center justify-between gap-4 border-map-navy/10 hover:border-map-navy">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-map-navy/10 text-map-navy">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-map-navy-mute">{assignment.week}회차</p>
                    <p className="font-semibold text-map-ink">{assignment.title}</p>
                    {submission?.mentorFeedback && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-map-navy">
                        <MessageSquare className="h-3 w-3" /> 멘토 피드백 도착
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Badge variant={meta.variant}>{meta.label}</Badge>
                  <ChevronRight className="h-4 w-4 text-slate-300" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
