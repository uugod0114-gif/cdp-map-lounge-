"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, MessageSquare, Target } from "lucide-react";
import { Card } from "@/components/common/card";
import { Badge, type BadgeProps } from "@/components/common/badge";
import { useDemoUser } from "@/features/auth/role-context";
import {
  listMyLearnersAction,
  listSubmissionsByLearnerAction,
} from "@/features/assignments/actions";
import type { Assignment, AssignmentSubmission, LearnerMentorMatch } from "@/types/content";

type DisplayStatus = "not_started" | "draft" | "submitted";

const STATUS_META: Record<DisplayStatus, { label: string; variant: BadgeProps["variant"] }> = {
  not_started: { label: "미작성", variant: "neutral" },
  draft: { label: "임시저장", variant: "warning" },
  submitted: { label: "제출완료", variant: "success" },
};

export function MentorLearnerBoard({ assignments }: { assignments: Assignment[] }) {
  const { user, isLoggedIn } = useDemoUser();
  const [learners, setLearners] = React.useState<LearnerMentorMatch[]>([]);
  const [submissionsByLearner, setSubmissionsByLearner] = React.useState<
    Record<string, AssignmentSubmission[]>
  >({});
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!isLoggedIn) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- 로그인 상태(외부 컨텍스트) 변화에 따른 동기화
      setLoading(false);
      return;
    }
    listMyLearnersAction(user.name).then(async (myLearners) => {
      setLearners(myLearners);
      const entries = await Promise.all(
        myLearners.map(
          async (learner) =>
            [learner.learnerName, await listSubmissionsByLearnerAction(learner.learnerName)] as const,
        ),
      );
      setSubmissionsByLearner(Object.fromEntries(entries));
      setLoading(false);
    });
  }, [user.name, isLoggedIn]);

  if (!isLoggedIn) {
    return <Card className="text-center text-slate-400">로그인 후 이용할 수 있습니다.</Card>;
  }
  if (loading) {
    return <Card className="text-center text-slate-400">불러오는 중…</Card>;
  }
  if (learners.length === 0) {
    return <Card className="text-center text-slate-400">아직 배정된 수강자가 없습니다.</Card>;
  }

  return (
    <div className="flex flex-col gap-6">
      {learners.map((learner) => {
        const submissions = submissionsByLearner[learner.learnerName] ?? [];
        return (
          <Card key={learner.learnerName} className="border-map-navy/10">
            <div className="mb-4">
              <p className="font-semibold text-map-ink">{learner.learnerName}</p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                <Target className="h-3 w-3" /> 도전품목: {learner.challengeItem}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {assignments.map((assignment) => {
                const submission = submissions.find((s) => s.assignmentId === assignment.id);
                const status: DisplayStatus = submission?.status ?? "not_started";
                const meta = STATUS_META[status];
                const row = (
                  <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 transition hover:border-map-navy/30">
                    <div>
                      <p className="text-xs font-semibold text-map-navy-mute">{assignment.week}회차</p>
                      <p className="text-sm font-medium text-map-ink">{assignment.title}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {submission?.mentorFeedback && (
                        <MessageSquare className="h-3.5 w-3.5 text-map-navy" />
                      )}
                      <Badge variant={meta.variant}>{meta.label}</Badge>
                      {submission && <ChevronRight className="h-4 w-4 text-slate-300" />}
                    </div>
                  </div>
                );
                return submission ? (
                  <Link key={assignment.id} href={`/mentor/assignments/${submission.id}`}>
                    {row}
                  </Link>
                ) : (
                  <div key={assignment.id}>{row}</div>
                );
              })}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
