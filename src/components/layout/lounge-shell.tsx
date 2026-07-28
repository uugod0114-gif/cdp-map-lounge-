"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, LayoutGrid, LogOut } from "lucide-react";
import { DEMO_ROLE_OPTIONS, useDemoUser } from "@/features/auth/role-context";
import { ROLE_LABEL, isStaff } from "@/lib/permissions/roles";
import { Badge } from "@/components/common/badge";

const NAV = [
  { href: "/lounge", label: "종합 라운지" },
  { href: "/schedule", label: "일정" },
  { href: "/announcements", label: "공지" },
  { href: "/materials", label: "자료" },
];

export function LoungeShell({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn, isStaffUser, previewRole, setPreviewRole, logout } = useDemoUser();
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/lounge" className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-map-navy text-xs font-semibold text-map-gold">
                MAP
              </span>
              <span className="hidden font-display text-sm font-medium sm:inline">
                CDP MAP Lounge
              </span>
            </Link>
            <nav className="hidden items-center gap-5 md:flex">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="text-sm font-medium text-slate-600 hover:text-map-navy"
                >
                  {n.label}
                </Link>
              ))}
              {isStaff(user.role) && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1 text-sm font-semibold text-map-navy"
                >
                  <LayoutGrid className="h-4 w-4" /> 운영 CMS
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/notifications" className="text-slate-400 hover:text-map-navy">
              <Bell className="h-5 w-5" />
            </Link>
            <Badge variant="navy">
              {isLoggedIn ? `${user.name} · ${ROLE_LABEL[user.role]}` : "게스트 (미로그인)"}
            </Badge>
            {isStaffUser && (
              <select
                className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
                value={previewRole ?? "__actual__"}
                onChange={(e) =>
                  setPreviewRole(e.target.value === "__actual__" ? null : (e.target.value as typeof user.role))
                }
                aria-label="운영진 화면 미리보기"
              >
                <option value="__actual__">내 화면(운영진, 기본)</option>
                {DEMO_ROLE_OPTIONS.filter((opt) => opt.role !== "super_admin").map((opt) => (
                  <option key={opt.role} value={opt.role}>
                    {opt.label} 화면 미리보기
                  </option>
                ))}
              </select>
            )}
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
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
