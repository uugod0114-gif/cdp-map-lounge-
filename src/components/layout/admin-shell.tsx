"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import {
  Activity,
  BarChart3,
  Bell,
  ClipboardList,
  FileText,
  Folder,
  History,
  Home,
  Images,
  LayoutDashboard,
  LayoutTemplate,
  MessageSquare,
  Settings,
  Users,
  UserSquare2,
  CalendarClock,
  Megaphone,
  Handshake,
  BookMarked,
} from "lucide-react";
import { DEMO_ROLE_OPTIONS, useDemoUser } from "@/features/auth/role-context";
import { ROLE_LABEL, isStaff } from "@/lib/permissions/roles";
import { Badge } from "@/components/common/badge";
import { cn } from "@/lib/utils/cn";

const MENU = [
  { href: "/admin", label: "운영 대시보드", icon: LayoutDashboard },
  { href: "/admin/pages", label: "라운지·페이지 관리", icon: LayoutTemplate },
  { href: "/admin/sessions", label: "강의 세션 관리", icon: BookMarked },
  { href: "/admin/templates", label: "세션 템플릿", icon: FileText },
  { href: "/admin/schedule", label: "교육 일정 관리", icon: CalendarClock },
  { href: "/admin/announcements", label: "공지 관리", icon: Megaphone },
  { href: "/admin/materials", label: "자료 관리", icon: Folder },
  { href: "/admin/flipbooks", label: "플립북 관리", icon: BookMarked },
  { href: "/admin/assignments", label: "과제 관리", icon: ClipboardList },
  { href: "/admin/mentor-matching", label: "멘토 매칭", icon: Handshake },
  { href: "/admin/applications", label: "신청자 관리", icon: UserSquare2 },
  { href: "/admin/staff", label: "사용자 및 권한 관리", icon: Users },
  { href: "/admin/feedback", label: "피드백 관리", icon: MessageSquare },
  { href: "/admin/analytics", label: "통계", icon: BarChart3 },
  { href: "/admin/activity-logs", label: "활동 로그", icon: Activity },
  { href: "/admin/media", label: "미디어 보관함", icon: Images },
  { href: "/admin/revisions", label: "버전 관리", icon: History },
  { href: "/admin/settings", label: "시스템 설정", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, actualUser, previewRole, setPreviewRole } = useDemoUser();
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    if (!isStaff(actualUser.role)) router.replace("/login");
  }, [actualUser.role, router]);

  if (!isStaff(actualUser.role)) {
    return (
      <div className="grid min-h-screen place-items-center bg-map-mist text-slate-400">
        운영진 권한을 확인하는 중입니다…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-map-mist">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-map-line bg-gradient-to-b from-map-navy via-map-navy to-map-navy-soft text-slate-200 lg:flex">
        <div className="flex h-16 items-center gap-2 px-5">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-map-gold text-xs font-semibold text-map-navy shadow-sm">
            MAP
          </span>
          <span className="font-display text-sm font-medium text-white">운영 CMS</span>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 pb-6">
          {MENU.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "mb-1 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-white/10 text-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/lounge"
          className="flex items-center gap-2 border-t border-white/10 px-5 py-4 text-xs text-slate-400 hover:text-white"
        >
          <Home className="h-4 w-4" /> 공개 사이트로 이동
        </Link>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-map-line bg-white/90 backdrop-blur px-4 sm:px-6 rounded-b-2xl shadow-sm">
          <p className="text-sm text-slate-400">
            운영진: <span className="font-semibold text-map-ink">{actualUser.name}</span>
          </p>
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-slate-400" />
            <Badge variant="navy">{ROLE_LABEL[user.role]}</Badge>
            <select
              className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
              value={previewRole ?? "__actual__"}
              onChange={(e) =>
                setPreviewRole(e.target.value === "__actual__" ? null : (e.target.value as typeof user.role))
              }
              aria-label="화면 미리보기"
            >
              <option value="__actual__">내 화면(기본)</option>
              {DEMO_ROLE_OPTIONS.filter((opt) => opt.role !== "super_admin").map((opt) => (
                <option key={opt.role} value={opt.role}>
                  {opt.label} 화면 미리보기
                </option>
              ))}
            </select>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
