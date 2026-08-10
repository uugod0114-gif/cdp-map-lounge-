// 운영진 CMS가 다루는 콘텐츠 블록 / 도메인 타입 정의
// 이 파일의 타입은 이후 Supabase 테이블(page_blocks, session_blocks 등)의
// draft_content / published_content(JSONB) 구조와 1:1로 대응합니다.

export type UserRole =
  | "super_admin"
  | "operator"
  | "editor"
  | "learner"
  | "auditor"
  | "mentor"
  | "instructor";

export type StaffRole = Extract<
  UserRole,
  "super_admin" | "operator" | "editor"
>;

export const ALL_ROLES: UserRole[] = [
  "super_admin",
  "operator",
  "editor",
  "learner",
  "auditor",
  "mentor",
  "instructor",
];

export type ContentStatus =
  | "draft"
  | "in_review"
  | "approved"
  | "published"
  | "archived";

// 운영진이 CMS에서 추가할 수 있는 콘텐츠 블록 유형
// (기획서 8장 30종 중 Phase 1에서 실제 렌더러를 구현한 유형)
export type BlockType =
  | "heading"
  | "text"
  | "richtext"
  | "image"
  | "banner"
  | "button"
  | "link"
  | "linkList"
  | "card"
  | "cardGrid"
  | "notice"
  | "quote"
  | "schedule"
  | "instructor"
  | "profileCard"
  | "fileDownload"
  | "pdfViewer"
  | "flipbook"
  | "video"
  | "embed"
  | "formEmbed"
  | "accordion"
  | "faq"
  | "divider"
  | "spacer"
  | "progress"
  | "statCard"
  | "recentNotices"
  | "recentMaterials"
  | "recentActivity";

export type Alignment = "left" | "center" | "right";
export type BlockWidth = "narrow" | "default" | "wide" | "full";
export type SpacingSize = "none" | "sm" | "md" | "lg" | "xl";
export type LinkTarget = "_self" | "_blank";

// 모든 블록이 공통으로 갖는 편집 항목 (기획서 8장 "공통 입력 항목")
export interface BlockCommonFields {
  blockName?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  backgroundImageUrl?: string;
  icon?: string;
  buttonLabel?: string;
  buttonUrl?: string;
  secondaryButtonLabel?: string;
  secondaryButtonUrl?: string;
  linkTarget?: LinkTarget;
  align?: Alignment;
  width?: BlockWidth;
  spacing?: SpacingSize;
  highlighted?: boolean;
  visibilityRoles: UserRole[];
  publishAt?: string | null;
  expireAt?: string | null;
  isActive: boolean;
  /** 허용된 Tailwind 클래스만 검증 후 저장되는 고급 옵션 */
  extraClassName?: string;
}

export interface ContentBlock {
  id: string;
  type: BlockType;
  order: number;
  fields: BlockCommonFields;
  /** 블록별 세부 데이터 (카드 목록, 일정 항목, 임베드 정보 등) */
  data?: Record<string, unknown>;
  hidden: boolean;
}

export type EmbedKind =
  | "youtube"
  | "vimeo"
  | "googleDrive"
  | "googleDocs"
  | "googleSlides"
  | "googleForms"
  | "microsoftForms"
  | "sharepoint"
  | "pdf"
  | "flipbook"
  | "image"
  | "iframe"
  | "link";

export interface EmbedResource {
  kind: EmbedKind;
  rawUrl: string;
  rawEmbedCode?: string;
  sanitizedEmbedCode?: string;
  title?: string;
  description?: string;
  visibilityRoles: UserRole[];
}

export interface PageContent {
  id: string;
  slug: string;
  title: string;
  pageType:
    | "main"
    | "lounge_common"
    | "lounge_learner"
    | "lounge_auditor"
    | "lounge_mentor"
    | "lounge_instructor"
    | "about"
    | "apply"
    | "faq"
    | "completion";
  status: ContentStatus;
  draftBlocks: ContentBlock[];
  publishedBlocks: ContentBlock[];
  updatedBy: string;
  updatedAt: string;
}

export interface SessionAgendaItem {
  time: string;
  minutes?: string;
  title: string;
  instructor: string;
}

export interface SessionRecord {
  id: string;
  courseId: string;
  week: number;
  title: string;
  summary: string;
  description: string;
  objectives: string[];
  preparation: string[];
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  onlineUrl?: string;
  instructor: string;
  coverImageUrl?: string;
  status: ContentStatus;
  visibilityRoles: UserRole[];
  templateId?: string;
  /** 회차별 상세 아젠다표 (일자/시간/강의제목/강사) */
  agenda?: SessionAgendaItem[];
  /** 사전과제/과제 안내 문구 */
  assignmentNote?: string;
  draftBlocks: ContentBlock[];
  publishedBlocks: ContentBlock[];
  updatedAt: string;
}

export interface SessionQuestion {
  id: string;
  sessionId: string;
  authorName: string;
  authorRole: UserRole;
  message: string;
  answer?: string;
  answeredBy?: string;
  answeredAt?: string;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  memberName: string;
  period: "am" | "pm";
  checkedAt: string;
}

export interface SessionTemplate {
  id: string;
  name: string;
  description: string;
  defaultBlocks: Omit<ContentBlock, "id" | "order">[];
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  pinned: boolean;
  visibilityRoles: UserRole[];
  createdAt: string;
}

export interface MaterialItem {
  id: string;
  title: string;
  description: string;
  fileType: "pdf" | "pptx" | "docx" | "xlsx" | "video" | "zip";
  sessionId?: string;
  visibilityRoles: UserRole[];
  downloadAllowed: boolean;
  flipbookEnabled: boolean;
  /** 플립북/뷰어용 링크 (예: FlipHTML5, 웍스드라이브 PDF 링크) */
  fileUrl: string;
  /** 다운로드 전용 링크. 없으면 fileUrl로 다운로드한다. */
  downloadUrl?: string;
  coverImageUrl?: string;
}

export interface RevisionRecord {
  id: string;
  targetType: "page" | "session" | "announcement" | "material";
  targetId: string;
  version: number;
  beforeData: unknown;
  afterData: unknown;
  changeNote: string;
  status: ContentStatus;
  createdBy: string;
  reviewedBy?: string;
  createdAt: string;
  reviewedAt?: string;
  publishedAt?: string;
}

export interface ActivityLog {
  id: string;
  actor: string;
  action: string;
  targetType: string;
  targetId: string;
  createdAt: string;
}

// ================= 과제 (회차별 수강자 과제 · 멘토 피드백) =================
export type AssignmentSubmissionStatus = "draft" | "submitted";

export interface Assignment {
  id: string;
  sessionId: string;
  /** 몇 회차 과제인지 (세션과 동일 주차) */
  week: number;
  title: string;
  description: string;
  dueDate?: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  learnerName: string;
  /** 자기소개서 작성하듯 자유 서술하는 본문 */
  content: string;
  status: AssignmentSubmissionStatus;
  submittedAt?: string;
  updatedAt: string;
  mentorFeedback?: string;
  feedbackBy?: string;
  feedbackAt?: string;
}

/** 수강자-멘토 매칭 (도전품목 포함). Phase 2에서는 운영진 CMS에서 배정한다. */
export interface LearnerMentorMatch {
  learnerName: string;
  mentorName: string;
  /** 도전품목: 이번 기수 동안 집중적으로 다루는 과제 품목 */
  challengeItem: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  permissions: string[];
  scope: "all" | "course" | "session";
}
<<<<<<< HEAD
=======

/** 라운지 피드 관련 타입 */
export type LoungeBoard = "auditor" | "learner";

export interface LoungeComment {
  id: string;
  postId: string;
  authorName: string;
  authorRole: UserRole;
  message: string;
  createdAt: string;
}

export interface LoungePost {
  id: string;
  board: LoungeBoard;
  authorName: string;
  authorRole: UserRole;
  message: string;
  sessionTag?: string;
  likes: string[];
  likedBy: string[];
  pinned: boolean;
  pinnedByInstructor: boolean;
  comments: LoungeComment[];
  createdAt: string;
<<<<<<< HEAD
}
=======
}
>>>>>>> 93db603 (수강자,멘토공간)
>>>>>>> ce3dae6dd78a2e04f827bebe38aaaa8e4f8643bc
