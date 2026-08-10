import { notFound } from "next/navigation";
import { LoungeShell } from "@/components/layout/lounge-shell";
import { MentorFeedbackForm } from "@/components/assignments/mentor-feedback-form";
import { getSubmissionById, listAssignments } from "@/services/content-service";

export default async function MentorSubmissionDetailPage({
  params,
}: {
  params: Promise<{ submissionId: string }>;
}) {
  const { submissionId } = await params;
  const submission = await getSubmissionById(submissionId);
  if (!submission) notFound();

  const assignments = await listAssignments();
  const assignment = assignments.find((a) => a.id === submission.assignmentId);
  if (!assignment) notFound();

  return (
    <LoungeShell>
      <p className="mb-1 text-xs font-semibold text-map-navy-mute">
        {assignment.week}회차 · {submission.learnerName}
      </p>
      <h1 className="mb-6 font-display text-2xl font-medium text-map-ink">{assignment.title}</h1>
      <MentorFeedbackForm submission={submission} />
    </LoungeShell>
  );
}
