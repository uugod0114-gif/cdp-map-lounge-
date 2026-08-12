"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, LogOut } from "lucide-react";
import { Button } from "@/components/common/button";
import { Badge } from "@/components/common/badge";
import { useDemoUser } from "@/features/auth/role-context";
import { ROLE_LABEL } from "@/lib/permissions/roles";
import type { UserRole } from "@/types/content";

const BASE_NAV = [
  { href: "/#schedule", label: "강의 일정" },
  { href: "/survey", label: "피드백" },
];

/** 로그인한 역할에 따라 상단 메뉴에 추가되는 항목 */
const ROLE_EXTRA_NAV: Partial<Record<UserRole, { href: string; label: string }[]>> = {
  learner: [
    { href: "/learner/assignments", label: "과제 관리" },
    { href: "/learner/attendance", label: "출석" },
  ],
  mentor: [{ href: "/mentor/assignments", label: "과제 관리" }],
  instructor: [{ href: "/instructor/feedback-overview", label: "내 강의 질문/피드백" }],
};

export function SiteHeader() {
  const { user, isLoggedIn, isStaffUser, logout } = useDemoUser();
  const router = useRouter();

  const nav = [
    ...BASE_NAV,
    ...(isLoggedIn ? ROLE_EXTRA_NAV[user.role] ?? [] : []),
    ...(isStaffUser ? [{ href: "/admin", label: "운영 CMS" }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-map-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-map-navy font-display text-sm font-semibold text-white">
              MAP
            </span>
            <span className="hidden font-display text-base font-medium tracking-tight text-map-ink sm:inline">
              CDP MAP Lounge
            </span>
          </Link>

          <nav className="hidden items-center gap-5 md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap text-sm font-semibold text-slate-600 transition hover:text-map-navy"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="relative flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link href="/notifications" className="text-slate-400 hover:text-map-navy">
                <Bell className="h-5 w-5" />
              </Link>
              <Badge variant="navy">
                {user.name} · {ROLE_LABEL[user.role]}
              </Badge>
              <button
                type="button"
                className="text-slate-400 hover:text-map-navy"
                aria-label="로그아웃"
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            null
          )}
        </div>
      </div>
    </header>
  );
}