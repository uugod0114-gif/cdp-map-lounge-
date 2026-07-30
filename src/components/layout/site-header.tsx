"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, LogOut } from "lucide-react";
import { Button } from "@/components/common/button";
import { Badge } from "@/components/common/badge";
import { useDemoUser } from "@/features/auth/role-context";
import { ROLE_LABEL } from "@/lib/permissions/roles";

const NAV = [
  { href: "/#intro", label: "교육 소개" },
  { href: "/#schedule", label: "강의 일정" },
  { href: "/#materials", label: "강의 자료" },
  { href: "/#feedback", label: "피드백" },
];

export function SiteHeader() {
  const { user, isLoggedIn, logout } = useDemoUser();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 border-b border-map-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-map-navy font-display text-sm font-semibold text-white">
              MAP
            </span>
            <span className="hidden font-display text-base font-medium tracking-tight text-map-ink sm:inline">
              CDP MAP Lounge
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-semibold text-slate-600 transition hover:text-map-navy"
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
            <div className="group relative">
              <Link href="/login">
                <Button variant="mint" size="sm">
                  로그인
                </Button>
              </Link>
              {/* 로그인 버튼 아래 작은 안내 박스 */}
              <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-map-line bg-white p-3 text-right shadow-sm">
                <p className="text-xs text-slate-400">신청 후 로그인이 가능해요</p>
                <Link
                  href="/apply"
                  className="mt-1 inline-block text-xs font-semibold text-map-navy hover:underline"
                >
                  신청 안내 보기 →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
