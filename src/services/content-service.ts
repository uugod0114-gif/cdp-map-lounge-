import "server-only";
import {
  mockAnnouncements,
  mockMaterials,
  mockPages,
  mockSessionTemplates,
  mockSessions,
  mockStaff,
} from "@/lib/mock/seed";
import type {
  ActivityLog,
  AttendanceRecord,
  Announcement,
  ContentBlock,
  ContentStatus,
  LoungeBoard,
  LoungeComment,
  LoungePost,
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
  loungePosts: LoungePost[];
}

/** 라운지 피드 시드 데이터 — 빈 화면 대신 사용 예시가 보이도록 */
function createLoungeSeed(): LoungePost[] {
  return [
    {
      id: "lounge_seed_1",
      board: "learner",
      authorName: "seed-user-a",
      authorRole: "learner",
      message:
        "\"평가하지 말고 관찰한 것을 말하라\" — 오늘의 한 문장. 다음 팀 미팅에서 바로 적용해 보겠습니다.",
      sessionTag: "1회차",
      likedBy: ["seed-user-b", "seed-user-c"],
      comments: [
        {
          id: "lounge_seed_1_c1",
          authorName: "seed-user-b",
          authorRole: "learner",
          message: "저도 이 문장 적어뒀어요. 실천 후기 공유해요!",
          createdAt: "2026-08-13T18:20:00+09:00",
        },
      ],
      pinnedByInstructor: true,
      createdAt: "2026-08-13T18:05:00+09:00",
    },
    {
      id: "lounge_seed_2",
      board: "auditor",
      authorName: "seed-user-d",
      authorRole: "auditor",
      message: "청강으로 들었는데 UBIST 파트가 특히 알찼습니다. 자료 열람 가능한가요?",
      sessionTag: "1회차",
      likedBy: ["seed-user-a"],
      comments: [],
      createdAt: "2026-08-13T19:10:00+09:00",
    },
  ];
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
    loungePosts: createLoungeSeed(),
  };
}

// Next.js dev 서버의 HMR로 모듈이 재평가되어도 데이터가 초기화되지 않도록
// globalThis에 싱글턴으로 보관한다.
const store = globalForStore.__cdpMapStore ?? (globalForStore.__cdpMapStore = createStore());
// HMR로 이전 버전 스토어가 남아 있을 때를 대비한 신규 필드 보정
store.loungePosts ??= createLoungeSeed();

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

// ================= 라운지 피드 (청강자/수강자 탭) =================
// Phase 1: 서버 메모리 저장. 같은 배포를 보는 모든 사용자에게 새로고침 시 반영된다.
// Phase 2: supabase.from("lounge_posts") / ("lounge_comments")로 내부 구현만 교체.

export async function listLoungePosts(board: LoungeBoard): Promise<LoungePost[]> {
  await delay();
  return store.loungePosts
    .filter((p) => p.board === board)
    .sort((a, b) => {
      // 교수자 추천 글을 먼저, 이후 최신순
      if (!!a.pinnedByInstructor !== !!b.pinnedByInstructor) {
        return a.pinnedByInstructor ? -1 : 1;
      }
      return a.createdAt < b.createdAt ? 1 : -1;
    });
}

export async function addLoungePost(
  board: LoungeBoard,
  authorName: string,
  authorRole: UserRole,
  message: string,
  sessionTag?: string,
): Promise<LoungePost> {
  await delay();
  const post: LoungePost = {
    id: nextId("lounge"),
    board,
    authorName,
    authorRole,
    message,
    sessionTag,
    likedBy: [],
    comments: [],
    createdAt: new Date().toISOString(),
  };
  store.loungePosts.unshift(post);
  logActivity(authorName, "라운지 글 등록", "lounge", post.id);
  return post;
}

export async function addLoungeComment(
  postId: string,
  authorName: string,
  authorRole: UserRole,
  message: string,
): Promise<LoungeComment | undefined> {
  await delay();
  const post = store.loungePosts.find((p) => p.id === postId);
  if (!post) return undefined;
  const comment: LoungeComment = {
    id: nextId("lcmt"),
    authorName,
    authorRole,
    message,
    createdAt: new Date().toISOString(),
  };
  post.comments.push(comment);
  logActivity(authorName, "라운지 댓글 등록", "lounge", postId);
  return comment;
}

export async function toggleLoungeLike(
  postId: string,
  memberName: string,
): Promise<LoungePost | undefined> {
  await delay();
  const post = store.loungePosts.find((p) => p.id === postId);
  if (!post) return undefined;
  const idx = post.likedBy.indexOf(memberName);
  if (idx >= 0) post.likedBy.splice(idx, 1);
  else post.likedBy.push(memberName);
  return post;
}

export async function toggleLoungePin(
  postId: string,
  actor: string,
): Promise<LoungePost | undefined> {
  await delay();
  const post = store.loungePosts.find((p) => p.id === postId);
  if (!post) return undefined;
  post.pinnedByInstructor = !post.pinnedByInstructor;
  logActivity(actor, post.pinnedByInstructor ? "라운지 글 추천" : "라운지 글 추천 해제", "lounge", postId);
  return post;
}
