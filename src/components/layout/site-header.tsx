import Link from "next/link";
import { Button } from "@/components/common/button";

const NAV = [{ href: "/about", label: "교육 소개" }];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-map-navy font-display text-sm font-semibold text-map-gold">
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
                className="text-sm font-medium text-slate-600 transition hover:text-map-navy"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              로그인
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}