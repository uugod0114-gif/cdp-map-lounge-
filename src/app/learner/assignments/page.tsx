import { PublicShell } from "@/components/layout/public-shell";
import { AssignmentListBoard } from "@/components/assignments/assignment-list-board";
import { listAssignments } from "@/services/content-service";

export default async function LearnerAssignmentsPage() {
  const assignments = await listAssignments();
  return (
    <PublicShell><div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-2 font-display text-2xl font-medium text-map-ink">과제</h1>
      <p className="mb-6 text-sm text-slate-500">
        회차별로 과제를 작성해 주세요. 자기소개서 쓰듯 편하게 임시저장해두고 이어서 작성한 뒤, 완성되면
        제출하면 됩니다.
      </p>
      <AssignmentListBoard assignments={assignments} />
    </div></PublicShell>
  );
}
