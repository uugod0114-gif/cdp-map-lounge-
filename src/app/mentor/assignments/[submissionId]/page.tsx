import { notFound } from "next/navigation";
import { PublicShell } from "@/components/layout/public-shell";
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
    <PublicShell><div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <p className="mb-1 text-xs font-semibold text-map-navy-mute">
        {assignment.week}회차 · {submission.learnerName}
      </p>
      <h1 className="mb-6 font-display text-2xl font-medium text-map-ink">{assignment.title}</h1>
      <MentorFeedbackForm submission={submission} />
    </div></PublicShell>
  );
}
