"use client";

import * as React from "react";
import type { UserRole } from "@/types/content";
import { isStaff } from "@/lib/permissions/roles";

interface CurrentUser {
  name: string;
  role: UserRole;
}

const DEMO_USERS: Record<UserRole, CurrentUser> = {
  super_admin: { name: "박서연", role: "super_admin" },
  operator: { name: "이하준", role: "operator" },
  editor: { name: "최지우", role: "editor" },
  learner: { name: "김민준", role: "learner" },
  auditor: { name: "정하은", role: "auditor" },
  mentor: { name: "김도윤 PM", role: "mentor" },
  instructor: { name: "정민아 CMO", role: "instructor" },
};

const GUEST_USER: CurrentUser = { name: "게스트", role: "auditor" };

interface RoleContextValue {
  /** 실제로 화면에 표시/필터링에 쓰이는 사용자 (운영진이 미리보기 중이면 미리보기 역할) */
  user: CurrentUser;
  /** 실제 로그인한 사용자 (미리보기와 무관하게 고정) */
  actualUser: CurrentUser;
  isLoggedIn: boolean;
  /** 운영진 여부 - 이 값이 true일 때만 "~로 보기" 미리보기 전환 UI를 노출한다 */
  isStaffUser: boolean;
  /** 현재 적용 중인 미리보기 역할 (null이면 미리보기 중이 아님) */
  previewRole: UserRole | null;
  /** 구글시트 명단 기반 로그인 - 이름과 역할을 함께 확정한다. */
  loginAs: (user: CurrentUser) => void;
  /** 개발/운영진 테스트용 빠른 로그인 (이 계정 자체로 로그인). */
  setRole: (role: UserRole) => void;
  /** 운영진 전용: 다른 역할의 화면이 어떻게 보이는지 미리보기 (실제 권한은 바뀌지 않음). */
  setPreviewRole: (role: UserRole | null) => void;
  logout: () => void;
}

const RoleContext = React.createContext<RoleContextValue | null>(null);

const ROLE_KEY = "cdp-map-role";
const NAME_KEY = "cdp-map-name";

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = React.useState<UserRole>(GUEST_USER.role);
  const [name, setNameState] = React.useState<string>(GUEST_USER.name);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [previewRole, setPreviewRoleState] = React.useState<UserRole | null>(null);

  React.useEffect(() => {
    const savedRole = window.localStorage.getItem(ROLE_KEY) as UserRole | null;
    const savedName = window.localStorage.getItem(NAME_KEY);
    if (savedRole && DEMO_USERS[savedRole]) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage(외부 시스템) 초기 동기화
      setRoleState(savedRole);
      setNameState(savedName?.trim() || DEMO_USERS[savedRole].name);
      setIsLoggedIn(true);
    }
  }, []);

  const loginAs = React.useCallback((next: CurrentUser) => {
    setRoleState(next.role);
    setNameState(next.name);
    setIsLoggedIn(true);
    setPreviewRoleState(null);
    window.localStorage.setItem(ROLE_KEY, next.role);
    window.localStorage.setItem(NAME_KEY, next.name);
  }, []);

  const setRole = React.useCallback((next: UserRole) => {
    setRoleState(next);
    setNameState(DEMO_USERS[next].name);
    setIsLoggedIn(true);
    setPreviewRoleState(null);
    window.localStorage.setItem(ROLE_KEY, next);
    window.localStorage.setItem(NAME_KEY, DEMO_USERS[next].name);
  }, []);

  const setPreviewRole = React.useCallback((next: UserRole | null) => {
    setPreviewRoleState(next);
  }, []);

  const logout = React.useCallback(() => {
    setRoleState(GUEST_USER.role);
    setNameState(GUEST_USER.name);
    setIsLoggedIn(false);
    setPreviewRoleState(null);
    window.localStorage.removeItem(ROLE_KEY);
    window.localStorage.removeItem(NAME_KEY);
  }, []);

  const isStaffUser = isLoggedIn && isStaff(role);
  const effectiveRole = isStaffUser && previewRole ? previewRole : role;

  const value = React.useMemo(
    () => ({
      user: { name, role: effectiveRole },
      actualUser: { name, role },
      isLoggedIn,
      isStaffUser,
      previewRole,
      loginAs,
      setRole,
      setPreviewRole,
      logout,
    }),
    [name, role, effectiveRole, isLoggedIn, isStaffUser, previewRole, loginAs, setRole, setPreviewRole, logout],
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useDemoUser() {
  const ctx = React.useContext(RoleContext);
  if (!ctx) throw new Error("useDemoUser must be used within RoleProvider");
  return ctx;
}

export const DEMO_ROLE_OPTIONS: { role: UserRole; label: string }[] = [
  { role: "learner", label: "수강자" },
  { role: "auditor", label: "청강자" },
  { role: "mentor", label: "멘토" },
  { role: "instructor", label: "교수자" },
  { role: "super_admin", label: "운영자" },
];
