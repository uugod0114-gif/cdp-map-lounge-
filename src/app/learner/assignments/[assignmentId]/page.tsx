import { notFound } from "next/navigation";
import { LoungeShell } from "@/components/layout/lounge-shell";
import { AssignmentSubmissionForm } from "@/components/assignments/assignment-submission-form";
import { listAssignments } from "@/services/content-service";

export default async function LearnerAssignmentDetailPage({
  params,
}: {
  params: Promise<{ assignmentId: string }>;
}) {
  const { assignmentId } = await params;
  const assignments = await listAssignments();
  const assignment = assignments.find((a) => a.id === assignmentId);
  if (!assignment) notFound();

  return (
    <LoungeShell>
      <p className="mb-1 text-xs font-semibold text-map-navy-mute">{assignment.week}회차 과제</p>
      <h1 className="mb-2 font-display text-2xl font-medium text-map-ink">{assignment.title}</h1>
      <p className="mb-6 whitespace-pre-line text-sm leading-relaxed text-slate-500">
        {assignment.description}
      </p>
      <AssignmentSubmissionForm assignment={assignment} />
    </LoungeShell>
  );
}
