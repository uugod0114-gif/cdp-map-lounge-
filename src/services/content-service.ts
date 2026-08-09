import "server-only";
import {
  mockAnnouncements,
  mockAssignments,
  mockLearnerMentorMatches,
  mockMaterials,
  mockPages,
  mockSessionTemplates,
  mockSessions,
  mockStaff,
} from "@/lib/mock/seed";
import type {
  ActivityLog,
  Assignment,
  AssignmentSubmission,
  AttendanceRecord,
  Announcement,
  ContentBlock,
  ContentStatus,
  LearnerMentorMatch,
  MaterialItem,
  PageContent,
  RevisionRecord,
  SessionQuestion,
  SessionRecord,
  SessionTemplate,
  StaffMember,
  UserRole,
} from "@/types/content";

/**
 * Phase 1 데이터 저장소.
 *
 * 지금은 서버 프로세스 메모리에 데이터를 보관하는 "가짜 DB"이지만,
 * 함수 시그니처(async, id 기반 조회/수정)는 Supabase 테이블 구조와
 * 동일하게 맞춰두었다. Phase 2에서는 이 파일 내부 구현만
 * `supabase.from("pages")...` 형태로 교체하면 되고,
 * 이 서비스를 호출하는 화면(컴포넌트) 코드는 수정할 필요가 없다.
 */

interface Store {
  pages: PageContent[];
  sessions: SessionRecord[];
  templates: SessionTemplate[];
  announcements: Announcement[];
  materials: MaterialItem[];
  staff: StaffMember[];
  revisions: RevisionRecord[];
  questions: SessionQuestion[];
  attendance: AttendanceRecord[];
  activityLogs: ActivityLog[];
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  learnerMentorMatches: LearnerMentorMatch[];
}

const globalForStore = globalThis as unknown as { __cdpMapStore?: Store };

function createStore(): Store {
  return {
    pages: mockPages,
    sessions: mockSessions,
    templates: mockSessionTemplates,
    announcements: mockAnnouncements,
    materials: mockMaterials,
    staff: mockStaff,
    revisions: [],
    activityLogs: [],
    questions: [],
    attendance: [],
    assignments: mockAssignments,
    submissions: [],
    learnerMentorMatches: mockLearnerMentorMatches,
  };
}

// Next.js dev 서버의 HMR로 모듈이 재평가되어도 데이터가 초기화되지 않도록
// globalThis에 싱글턴으로 보관한다.
const store = globalForStore.__cdpMapStore ?? (globalForStore.__cdpMapStore = createStore());

const delay = (ms = 30) => new Promise((resolve) => setTimeout(resolve, ms));
const nextId = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

function logActivity(actor: string, action: string, targetType: string, targetId: string) {
  store.activityLogs.unshift({
    id: nextId("log"),
    actor,
    action,
    targetType,
    targetId,
    createdAt: new Date().toISOString(),
  });
}

// ================= Pages =================
export async function listPages(): Promise<PageContent[]> {
  await delay();
  return store.pages;
}

export async function getPageBySlug(slug: string): Promise<PageContent | undefined> {
  await delay();
  return store.pages.find((p) => p.slug === slug);
}

export async function getPageById(id: string): Promise<PageContent | undefined> {
  await delay();
  return store.pages.find((p) => p.id === id);
}

export async function saveDraftBlocks(
  pageId: string,
  blocks: ContentBlock[],
  actor: string,
): Promise<PageContent | undefined> {
  await delay();
  const page = store.pages.find((p) => p.id === pageId);
  if (!page) return undefined;
  page.draftBlocks = blocks;
  page.updatedBy = actor;
  page.updatedAt = new Date().toISOString();
  if (page.status === "published") page.status = "draft";
  logActivity(actor, "콘텐츠 수정", "page", pageId);
  return page;
}

export async function requestPageReview(
  pageId: string,
  actor: string,
): Promise<PageContent | undefined> {
  await delay();
  const page = store.pages.find((p) => p.id === pageId);
  if (!page) return undefined;
  page.status = "in_review";
  logActivity(actor, "검토 요청", "page", pageId);
  return page;
}

export async function publishPage(
  pageId: string,
  actor: string,
): Promise<PageContent | undefined> {
  await delay();
  const page = store.pages.find((p) => p.id === pageId);
  if (!page) return undefined;

  store.revisions.push({
    id: nextId("rev"),
    targetType: "page",
    targetId: pageId,
    version: store.revisions.filter((r) => r.targetId === pageId).length + 1,
    beforeData: page.publishedBlocks,
    afterData: page.draftBlocks,
    changeNote: "공개 버전 업데이트",
    status: "published",
    createdBy: actor,
    reviewedBy: actor,
    createdAt: new Date().toISOString(),
    reviewedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
  });

  page.publishedBlocks = page.draftBlocks;
  page.status = "published";
  page.updatedBy = actor;
  page.updatedAt = new Date().toISOString();
  logActivity(actor, "콘텐츠 공개", "page", pageId);
  return page;
}

export async function unpublishPage(pageId: string, actor: string) {
  await delay();
  const page = store.pages.find((p) => p.id === pageId);
  if (!page) return undefined;
  page.status = "draft";
  logActivity(actor, "공개 취소", "page", pageId);
  return page;
}

export async function revertPageToRevision(
  pageId: string,
  revisionId: string,
  actor: string,
): Promise<PageContent | undefined> {
  await delay();
  const page = store.pages.find((p) => p.id === pageId);
  const revision = store.revisions.find((r) => r.id === revisionId);
  if (!page || !revision) return undefined;
  page.draftBlocks = revision.afterData as ContentBlock[];
  logActivity(actor, "이전 버전 복구", "page", pageId);
  return page;
}

// ================= Sessions =================
export async function listSessions(): Promise<SessionRecord[]> {
  await delay();
  return [...store.sessions].sort((a, b) => a.week - b.week);
}

export async function getSessionById(id: string): Promise<SessionRecord | undefined> {
  await delay();
  return store.sessions.find((s) => s.id === id);
}

export async function listSessionTemplates(): Promise<SessionTemplate[]> {
  await delay();
  return store.templates;
}

export async function createSessionFromTemplate(
  templateId: string,
  base: Pick<SessionRecord, "title" | "week" | "courseId" | "date" | "startTime" | "endTime" | "instructor">,
  actor: string,
): Promise<SessionRecord> {
  await delay();
  const template = store.templates.find((t) => t.id === templateId);
  const blocks: ContentBlock[] = (template?.defaultBlocks ?? []).map((b, index) => ({
    ...b,
    id: nextId("blk"),
    order: index,
  }));

  const session: SessionRecord = {
    id: nextId("sess"),
    courseId: base.courseId,
    week: base.week,
    title: base.title,
    summary: "",
    description: "",
    objectives: [],
    preparation: [],
    date: base.date,
    startTime: base.startTime,
    endTime: base.endTime,
    location: "",
    instructor: base.instructor,
    status: "draft",
    visibilityRoles: ["learner", "auditor"],
    templateId,
    draftBlocks: blocks,
    publishedBlocks: [],
    updatedAt: new Date().toISOString(),
  };
  store.sessions.push(session);
  logActivity(actor, "세션 생성", "session", session.id);
  return session;
}

export async function duplicateSession(sessionId: string, actor: string) {
  await delay();
  const original = store.sessions.find((s) => s.id === sessionId);
  if (!original) return undefined;
  const copy: SessionRecord = {
    ...original,
    id: nextId("sess"),
    title: `${original.title} (복사본)`,
    status: "draft",
    week: original.week + 1,
    draftBlocks: original.draftBlocks.map((b) => ({ ...b, id: nextId("blk") })),
    publishedBlocks: [],
    updatedAt: new Date().toISOString(),
  };
  store.sessions.push(copy);
  logActivity(actor, "세션 복제", "session", copy.id);
  return copy;
}

export async function saveSessionDraft(
  sessionId: string,
  patch: Partial<SessionRecord>,
  actor: string,
): Promise<SessionRecord | undefined> {
  await delay();
  const session = store.sessions.find((s) => s.id === sessionId);
  if (!session) return undefined;
  Object.assign(session, patch);
  session.updatedAt = new Date().toISOString();
  logActivity(actor, "세션 수정", "session", sessionId);
  return session;
}

export async function updateSessionStatus(
  sessionId: string,
  status: ContentStatus,
  actor: string,
): Promise<SessionRecord | undefined> {
  await delay();
  const session = store.sessions.find((s) => s.id === sessionId);
  if (!session) return undefined;
  session.status = status;
  if (status === "published") session.publishedBlocks = session.draftBlocks;
  logActivity(actor, `세션 상태 변경(${status})`, "session", sessionId);
  return session;
}

// ================= Announcements / Materials =================
export async function listAnnouncements(): Promise<Announcement[]> {
  await delay();
  return store.announcements;
}

export async function listMaterials(): Promise<MaterialItem[]> {
  await delay();
  return store.materials;
}

export async function getMaterialById(id: string): Promise<MaterialItem | undefined> {
  await delay();
  return store.materials.find((m) => m.id === id);
}

export async function listMaterialsBySession(sessionId: string): Promise<MaterialItem[]> {
  await delay();
  return store.materials.filter((m) => m.sessionId === sessionId);
}

export async function createMaterial(
  input: Omit<MaterialItem, "id">,
  actor: string,
): Promise<MaterialItem> {
  await delay();
  const material: MaterialItem = { id: nextId("mat"), ...input };
  store.materials.push(material);
  logActivity(actor, "자료 등록", "material", material.id);
  return material;
}

export async function deleteMaterial(id: string, actor: string): Promise<void> {
  await delay();
  store.materials = store.materials.filter((m) => m.id !== id);
  logActivity(actor, "자료 삭제", "material", id);
}

// ================= Staff =================
export async function listStaff(): Promise<StaffMember[]> {
  await delay();
  return store.staff;
}

// ================= Revisions / Activity =================
export async function listRevisions(targetId?: string): Promise<RevisionRecord[]> {
  await delay();
  return targetId
    ? store.revisions.filter((r) => r.targetId === targetId)
    : store.revisions;
}

export async function listActivityLogs(limit = 20): Promise<ActivityLog[]> {
  await delay();
  return store.activityLogs.slice(0, limit);
}

// ================= Dashboard 통계 (기획서 20장 요약) =================
export async function getDashboardStats() {
  await delay();
  return {
    applicants: 58,
    learners: 24,
    auditors: 34,
    attendanceRate: 91,
    feedbackResponseRate: 78,
    materialViews: 412,
    materialDownloads: 187,
    assignmentSubmissionRate: 88,
    assignmentCompletionRate: 76,
    mentorAvgResponseHours: 6.4,
    pendingReviews: store.pages.filter((p) => p.status === "in_review").length +
      store.sessions.filter((s) => s.status === "in_review").length,
  };
}

// ================= 회차별 Q&A =================
// Phase 1: 서버 메모리에 저장되어 같은 배포/서버를 보는 모든 사용자에게
// 새로고침(또는 페이지 재방문) 시 함께 보인다. 소켓 기반의 진짜 "실시간" 반영은
// Phase 2에서 Supabase Realtime으로 교체하면 된다 (질문 등록 시 다른 접속자
// 화면에 새로고침 없이 뜨도록).
export async function listSessionQuestions(sessionId: string): Promise<SessionQuestion[]> {
  await delay();
  return store.questions
    .filter((q) => q.sessionId === sessionId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function addSessionQuestion(
  sessionId: string,
  authorName: string,
  authorRole: UserRole,
  message: string,
): Promise<SessionQuestion> {
  await delay();
  const question: SessionQuestion = {
    id: nextId("qna"),
    sessionId,
    authorName,
    authorRole,
    message,
    createdAt: new Date().toISOString(),
  };
  store.questions.unshift(question);
  logActivity(authorName, "질문 등록", "session", sessionId);
  return question;
}

export async function answerSessionQuestion(
  questionId: string,
  answer: string,
  answeredBy: string,
): Promise<SessionQuestion | undefined> {
  await delay();
  const question = store.questions.find((q) => q.id === questionId);
  if (!question) return undefined;
  question.answer = answer;
  question.answeredBy = answeredBy;
  question.answeredAt = new Date().toISOString();
  logActivity(answeredBy, "질문 답변", "session", question.sessionId);
  return question;
}

export async function listAllQuestions(): Promise<SessionQuestion[]> {
  await delay();
  return [...store.questions].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

// ================= 출석 도장(오전/오후) =================
export async function getAttendanceForMember(memberName: string): Promise<AttendanceRecord[]> {
  await delay();
  return store.attendance.filter((a) => a.memberName === memberName);
}

export async function checkAttendance(
  sessionId: string,
  memberName: string,
  period: "am" | "pm",
): Promise<AttendanceRecord> {
  await delay();
  const existing = store.attendance.find(
    (a) => a.sessionId === sessionId && a.memberName === memberName && a.period === period,
  );
  if (existing) return existing;

  const record: AttendanceRecord = {
    id: nextId("att"),
    sessionId,
    memberName,
    period,
    checkedAt: new Date().toISOString(),
  };
  store.attendance.push(record);
  logActivity(memberName, `출석 체크(${period === "am" ? "오전" : "오후"})`, "session", sessionId);
  return record;
}

export async function listAttendanceForSession(sessionId: string): Promise<AttendanceRecord[]> {
  await delay();
  return store.attendance.filter((a) => a.sessionId === sessionId);
}

// ================= 회차별 과제 · 제출 · 멘토 피드백 =================
// Phase 1: 서버 메모리 저장. 제출물은 (assignmentId, learnerName) 조합으로
// 유일하며, "임시저장"은 status를 draft로, "제출"은 submitted로 바꾼다.
export async function listAssignments(): Promise<Assignment[]> {
  await delay();
  return [...store.assignments].sort((a, b) => a.week - b.week);
}

export async function getAssignmentById(id: string): Promise<Assignment | undefined> {
  await delay();
  return store.assignments.find((a) => a.id === id);
}

/** 수강자 본인의 멘토 · 도전품목 매칭 정보 */
export async function getMyMentorMatch(learnerName: string): Promise<LearnerMentorMatch | undefined> {
  await delay();
  return store.learnerMentorMatches.find((m) => m.learnerName === learnerName);
}

/** 멘토가 담당하는 수강자 목록 (도전품목 포함) */
export async function listMyLearners(mentorName: string): Promise<LearnerMentorMatch[]> {
  await delay();
  return store.learnerMentorMatches.filter((m) => m.mentorName === mentorName);
}

export async function getSubmission(
  assignmentId: string,
  learnerName: string,
): Promise<AssignmentSubmission | undefined> {
  await delay();
  return store.submissions.find(
    (s) => s.assignmentId === assignmentId && s.learnerName === learnerName,
  );
}

export async function getSubmissionById(id: string): Promise<AssignmentSubmission | undefined> {
  await delay();
  return store.submissions.find((s) => s.id === id);
}

/** 특정 수강자의 회차별 제출 현황을 한 번에 조회 (목록 화면에서 사용) */
export async function listSubmissionsByLearner(learnerName: string): Promise<AssignmentSubmission[]> {
  await delay();
  return store.submissions.filter((s) => s.learnerName === learnerName);
}

export async function saveAssignmentDraft(
  assignmentId: string,
  learnerName: string,
  content: string,
): Promise<AssignmentSubmission> {
  await delay();
  const now = new Date().toISOString();
  let submission = store.submissions.find(
    (s) => s.assignmentId === assignmentId && s.learnerName === learnerName,
  );
  if (submission) {
    submission.content = content;
    submission.status = "draft";
    submission.updatedAt = now;
  } else {
    submission = {
      id: nextId("sub"),
      assignmentId,
      learnerName,
      content,
      status: "draft",
      updatedAt: now,
    };
    store.submissions.push(submission);
  }
  logActivity(learnerName, "과제 임시저장", "assignment", assignmentId);
  return submission;
}

export async function submitAssignment(
  assignmentId: string,
  learnerName: string,
  content: string,
): Promise<AssignmentSubmission> {
  await delay();
  const now = new Date().toISOString();
  let submission = store.submissions.find(
    (s) => s.assignmentId === assignmentId && s.learnerName === learnerName,
  );
  if (submission) {
    submission.content = content;
    submission.status = "submitted";
    submission.submittedAt = now;
    submission.updatedAt = now;
  } else {
    submission = {
      id: nextId("sub"),
      assignmentId,
      learnerName,
      content,
      status: "submitted",
      submittedAt: now,
      updatedAt: now,
    };
    store.submissions.push(submission);
  }
  logActivity(learnerName, "과제 제출", "assignment", assignmentId);
  return submission;
}

/** 제출완료 상태를 임시저장으로 되돌려 다시 작성할 수 있게 한다. */
export async function reopenSubmission(
  submissionId: string,
  actor: string,
): Promise<AssignmentSubmission | undefined> {
  await delay();
  const submission = store.submissions.find((s) => s.id === submissionId);
  if (!submission) return undefined;
  submission.status = "draft";
  submission.updatedAt = new Date().toISOString();
  logActivity(actor, "과제 재작성 시작", "assignment", submission.assignmentId);
  return submission;
}

export async function giveMentorFeedback(
  submissionId: string,
  feedback: string,
  mentorName: string,
): Promise<AssignmentSubmission | undefined> {
  await delay();
  const submission = store.submissions.find((s) => s.id === submissionId);
  if (!submission) return undefined;
  submission.mentorFeedback = feedback;
  submission.feedbackBy = mentorName;
  submission.feedbackAt = new Date().toISOString();
  logActivity(mentorName, "멘토 피드백 등록", "assignment", submission.assignmentId);
  return submission;
}
