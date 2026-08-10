import { LoungeShell } from "@/components/layout/lounge-shell";
import { MentorLearnerBoard } from "@/components/assignments/mentor-learner-board";
import { listAssignments } from "@/services/content-service";

export default async function MentorAssignmentsPage() {
  const assignments = await listAssignments();
  return (
    <LoungeShell>
      <h1 className="mb-2 font-display text-2xl font-medium text-map-ink">내 수강자 과제</h1>
      <p className="mb-6 text-sm text-slate-500">
        담당 수강자의 회차별 과제 제출 현황을 한눈에 확인하고, 제출된 과제에 피드백을 남겨주세요.
      </p>
      <MentorLearnerBoard assignments={assignments} />
    </LoungeShell>
  );
}
