import type { UserRole } from "@/types/content";

/** CMS(운영진 화면) 접근이 가능한 역할 */
export const STAFF_ROLES: UserRole[] = ["super_admin", "operator", "editor"];

/** 콘텐츠를 최종 공개할 수 있는 역할 (editor는 검토 요청만 가능) */
export const PUBLISH_ROLES: UserRole[] = ["super_admin", "operator"];

export const ROLE_LABEL: Record<UserRole, string> = {
  super_admin: "최고 관리자",
  operator: "교육 운영진",
  editor: "콘텐츠 편집자",
  learner: "수강자",
  auditor: "청강자",
  mentor: "멘토",
  instructor: "강사",
};

export function isStaff(role: UserRole): boolean {
  return STAFF_ROLES.includes(role);
}

export function canPublish(role: UserRole): boolean {
  return PUBLISH_ROLES.includes(role);
}

export function canViewBlock(
  visibilityRoles: UserRole[],
  role: UserRole,
): boolean {
  if (!visibilityRoles || visibilityRoles.length === 0) return true;
  return visibilityRoles.includes(role);
}

/**
 * 세부 권한 키 (기획서 22장) - Phase 2에서 staff_permissions 테이블과 연동.
 * Phase 1에서는 역할 기반 매핑으로 서버 액션에서 1차 검증한다.
 */
export type PermissionKey =
  | "page.view"
  | "page.create"
  | "page.edit"
  | "page.publish"
  | "page.delete"
  | "session.view"
  | "session.create"
  | "session.edit"
  | "session.publish"
  | "material.upload"
  | "material.delete"
  | "application.review"
  | "mentor.match"
  | "feedback.view"
  | "analytics.view"
  | "user.manage"
  | "staff.manage";

const ROLE_PERMISSIONS: Record<UserRole, PermissionKey[]> = {
  super_admin: [
    "page.view",
    "page.create",
    "page.edit",
    "page.publish",
    "page.delete",
    "session.view",
    "session.create",
    "session.edit",
    "session.publish",
    "material.upload",
    "material.delete",
    "application.review",
    "mentor.match",
    "feedback.view",
    "analytics.view",
    "user.manage",
    "staff.manage",
  ],
  operator: [
    "page.view",
    "page.create",
    "page.edit",
    "page.publish",
    "session.view",
    "session.create",
    "session.edit",
    "session.publish",
    "material.upload",
    "material.delete",
    "application.review",
    "mentor.match",
    "feedback.view",
    "analytics.view",
  ],
  editor: [
    "page.view",
    "page.create",
    "page.edit",
    "session.view",
    "session.create",
    "session.edit",
    "material.upload",
    "feedback.view",
  ],
  learner: [],
  auditor: [],
  mentor: [],
  instructor: ["session.view"],
};

export function hasPermission(role: UserRole, permission: PermissionKey) {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/** 서버 액션/라우트 핸들러 진입부에서 사용하는 가드. 실패 시 예외를 던진다. */
export function assertPermission(role: UserRole, permission: PermissionKey) {
  if (!hasPermission(role, permission)) {
    throw new Error(
      `PERMISSION_DENIED: role="${role}" permission="${permission}"`,
    );
  }
}
