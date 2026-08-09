"use server";

import { revalidatePath } from "next/cache";
import {
  getMyMentorMatch,
  getSubmission,
  getSubmissionById,
  giveMentorFeedback,
  listMyLearners,
  listSubmissionsByLearner,
  reopenSubmission,
  saveAssignmentDraft,
  submitAssignment,
} from "@/services/content-service";

export async function getMyMentorMatchAction(learnerName: string) {
  if (!learnerName.trim()) return undefined;
  return getMyMentorMatch(learnerName);
}

export async function listMyLearnersAction(mentorName: string) {
  if (!mentorName.trim()) return [];
  return listMyLearners(mentorName);
}

export async function getMySubmissionAction(assignmentId: string, learnerName: string) {
  if (!learnerName.trim()) return undefined;
  return getSubmission(assignmentId, learnerName);
}

export async function getSubmissionByIdAction(submissionId: string) {
  return getSubmissionById(submissionId);
}

/** 목록 화면에서 회차별 상태(미작성/임시저장/제출완료)를 한 번에 계산하기 위한 조회 */
export async function listSubmissionsByLearnerAction(learnerName: string) {
  if (!learnerName.trim()) return [];
  return listSubmissionsByLearner(learnerName);
}

export async function saveDraftAction(assignmentId: string, learnerName: string, content: string) {
  if (!learnerName.trim()) {
    return { ok: false, message: "로그인 정보가 없어 저장할 수 없습니다." };
  }
  const submission = await saveAssignmentDraft(assignmentId, learnerName, content);
  revalidatePath("/learner/assignments");
  revalidatePath(`/learner/assignments/${assignmentId}`);
  return { ok: true, submission };
}

export async function submitAssignmentAction(assignmentId: string, learnerName: string, content: string) {
  if (!learnerName.trim()) {
    return { ok: false, message: "로그인 정보가 없어 제출할 수 없습니다." };
  }
  if (!content.trim()) {
    return { ok: false, message: "내용을 입력한 뒤 제출해 주세요." };
  }
  const submission = await submitAssignment(assignmentId, learnerName, content);
  revalidatePath("/learner/assignments");
  revalidatePath(`/learner/assignments/${assignmentId}`);
  revalidatePath("/mentor/assignments");
  return { ok: true, submission };
}

export async function reopenSubmissionAction(
  submissionId: string,
  assignmentId: string,
  actor: string,
) {
  const submission = await reopenSubmission(submissionId, actor);
  revalidatePath("/learner/assignments");
  revalidatePath(`/learner/assignments/${assignmentId}`);
  revalidatePath("/mentor/assignments");
  return { ok: true, submission };
}

export async function giveMentorFeedbackAction(
  submissionId: string,
  feedback: string,
  mentorName: string,
) {
  if (!feedback.trim()) {
    return { ok: false, message: "피드백 내용을 입력해 주세요." };
  }
  const submission = await giveMentorFeedback(submissionId, feedback.trim(), mentorName);
  revalidatePath("/mentor/assignments");
  revalidatePath(`/mentor/assignments/${submissionId}`);
  revalidatePath("/learner/assignments");
  return { ok: true, submission };
}
