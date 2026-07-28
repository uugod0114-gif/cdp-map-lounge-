"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Download,
  ExternalLink,
  FileText,
  Lock,
  Megaphone,
  Target,
  Users,
} from "lucide-react";
import type { ContentBlock, UserRole } from "@/types/content";
import { canViewBlock } from "@/lib/permissions/roles";
import { Button } from "@/components/common/button";
import { Card } from "@/components/common/card";
import { WaveBackground } from "@/components/common/wave-background";
import { cn } from "@/lib/utils/cn";
import { useDemoUser } from "@/features/auth/role-context";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Target,
  Users,
  BookOpen,
  FileText,
  Megaphone,
};

const WIDTH_CLASS: Record<NonNullable<ContentBlock["fields"]["width"]>, string> = {
  narrow: "max-w-2xl",
  default: "max-w-4xl",
  wide: "max-w-6xl",
  full: "max-w-none",
};

const SPACING_CLASS: Record<NonNullable<ContentBlock["fields"]["spacing"]>, string> = {
  none: "py-0",
  sm: "py-4",
  md: "py-8",
  lg: "py-14",
  xl: "py-20",
};

interface BlockRendererProps {
  blocks: ContentBlock[];
  role: UserRole;
  /** 관리자 미리보기에서 숨김/비활성 블록도 흐리게 표시할지 여부 */
  previewMode?: boolean;
}

export function BlockList({ blocks, role, previewMode }: BlockRendererProps) {
  const visible = [...blocks]
    .sort((a, b) => a.order - b.order)
    .filter((b) => previewMode || (!b.hidden && b.fields.isActive));

  if (visible.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-slate-300 bg-slate-50 py-16 text-center text-slate-400">
        아직 구성된 콘텐츠가 없습니다.
      </div>
    );
  }

  return (
    <div>
      {visible.map((block) => {
        const canView = canViewBlock(block.fields.visibilityRoles, role);
        if (!canView && !previewMode) return null;
        return (
          <BlockItem
            key={block.id}
            block={block}
            dimmed={previewMode && (block.hidden || !block.fields.isActive || !canView)}
          />
        );
      })}
    </div>
  );
}

function BlockItem({ block, dimmed }: { block: ContentBlock; dimmed?: boolean }) {
  const { fields } = block;
  return (
    <section
      className={cn(
        SPACING_CLASS[fields.spacing ?? "md"],
        dimmed && "opacity-40",
        fields.extraClassName,
      )}
    >
      <div className={cn("mx-auto px-4 sm:px-6", WIDTH_CLASS[fields.width ?? "default"])}>
        <BlockBody block={block} />
      </div>
    </section>
  );
}

function BlockBody({ block }: { block: ContentBlock }) {
  const { type, fields, data } = block;
  const { isLoggedIn } = useDemoUser();
  const alignClass =
    fields.align === "center"
      ? "text-center items-center"
      : fields.align === "right"
        ? "text-right items-end"
        : "text-left items-start";

  switch (type) {
    case "banner":
      // highlighted=true: 네이비 프로모션 카드(마감 임박 등 강조 공지용)
      if (fields.highlighted) {
        return (
          <div className="flex flex-col items-center justify-between gap-4 rounded-card bg-map-navy px-6 py-8 text-white sm:flex-row sm:px-10">
            <div>
              {fields.title && <p className="text-lg font-medium">{fields.title}</p>}
              {fields.description && (
                <p className="mt-1 text-sm text-white/60">{fields.description}</p>
              )}
            </div>
            {fields.buttonLabel && (
              <Link href={fields.buttonUrl ?? "#"} target={fields.linkTarget}>
                <Button variant="inverse" className="shrink-0">
                  {fields.buttonLabel}
                </Button>
              </Link>
            )}
          </div>
        );
      }
      // 기본: imweb 스타일의 화이트 배경 중앙 정렬 히어로
      return (
        <div className="relative overflow-hidden px-4 py-16 text-map-ink sm:py-24">
          <WaveBackground />
          <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
            {fields.subtitle && (
              <span className="text-xs font-medium tracking-wide text-slate-500">
                {fields.subtitle}
              </span>
            )}
            {fields.title && (
              <h1 className="whitespace-pre-line font-display text-3xl font-medium leading-tight text-map-ink sm:text-[44px]">
                {fields.title}
              </h1>
            )}
            {fields.description && (
              <p className="max-w-lg whitespace-pre-line text-[15px] leading-relaxed text-slate-500">
                {fields.description}
              </p>
            )}
            {fields.buttonLabel && (
              <Link href={fields.buttonUrl ?? "#"} target={fields.linkTarget}>
                <Button variant="primary" size="lg" className="mt-2">
                  {fields.buttonLabel}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      );

    case "heading":
      return (
        <h2 className={cn("font-display text-2xl font-medium text-map-ink sm:text-3xl", alignClass)}>
          {fields.title}
        </h2>
      );

    case "text":
      return <p className={cn("text-base leading-relaxed text-slate-600", alignClass)}>{fields.description}</p>;

    case "richtext":
      return (
        <div className={cn("flex flex-col gap-3", alignClass)}>
          {fields.title && <h3 className="text-xl font-bold text-map-ink">{fields.title}</h3>}
          <p className="whitespace-pre-line text-base leading-relaxed text-slate-600">
            {fields.description}
          </p>
        </div>
      );

    case "quote":
      return (
        <blockquote className="border-l-4 border-map-navy bg-map-gold-soft/40 px-6 py-4 text-lg font-medium italic text-map-ink">
          {fields.description}
        </blockquote>
      );

    case "button":
      return (
        <div className={cn("flex", alignClass)}>
          <Link href={fields.buttonUrl ?? "#"} target={fields.linkTarget}>
            <Button variant={fields.highlighted ? "primary" : "outline"}>{fields.buttonLabel}</Button>
          </Link>
        </div>
      );

    case "link":
      return (
        <a
          href={fields.buttonUrl}
          target={fields.linkTarget ?? "_blank"}
          rel="noreferrer"
          className="flex items-center gap-2 text-map-navy underline underline-offset-4 hover:text-map-navy"
        >
          {fields.title ?? fields.buttonUrl}
          <ExternalLink className="h-4 w-4" />
        </a>
      );

    case "linkList": {
      const links = (data?.links as { label: string; url: string }[]) ?? [];
      return (
        <ul className="flex flex-col gap-2">
          {links.map((link) => (
            <li key={link.url}>
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-map-navy hover:border-map-navy"
              >
                <ExternalLink className="h-4 w-4" /> {link.label}
              </a>
            </li>
          ))}
        </ul>
      );
    }

    case "card":
      return (
        <Card className="border-map-navy/10">
          {fields.title && <h3 className="text-lg font-bold text-map-ink">{fields.title}</h3>}
          {fields.description && <p className="mt-2 text-sm text-slate-500">{fields.description}</p>}
          {fields.buttonLabel && (
            <Link href={fields.buttonUrl ?? "#"} className="mt-4 inline-block">
              <Button size="sm" variant="outline">
                {fields.buttonLabel}
              </Button>
            </Link>
          )}
        </Card>
      );

    case "cardGrid": {
      const cards =
        (data?.cards as {
          title: string;
          description: string;
          icon?: string;
          buttonLabel?: string;
          buttonUrl?: string;
        }[]) ?? [];
      return (
        <div className="flex flex-col gap-6">
          {fields.title && (
            <h2 className="font-display text-2xl font-medium text-map-ink">{fields.title}</h2>
          )}
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-card border border-map-line bg-map-line sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((c) => {
              const Icon = c.icon ? ICONS[c.icon] : undefined;
              return (
                <div key={c.title} className="bg-white p-6">
                  {Icon && <Icon className="h-5 w-5 text-map-navy" />}
                  <h3 className="mt-4 text-[15px] font-medium text-map-ink">{c.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{c.description}</p>
                  {c.buttonLabel && (
                    <Link href={c.buttonUrl ?? "#"} className="mt-4 inline-block">
                      <Button size="sm" variant="outline">
                        {c.buttonLabel}
                      </Button>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    case "notice":
      return (
        <div className="flex items-start gap-3 rounded-card border border-map-navy/30 bg-map-gold-soft/40 p-5">
          <Megaphone className="mt-0.5 h-5 w-5 shrink-0 text-map-navy" />
          <div>
            {fields.title && <p className="font-bold text-map-ink">{fields.title}</p>}
            <p className="mt-1 text-sm text-slate-600">{fields.description}</p>
          </div>
        </div>
      );

    case "instructor":
    case "profileCard": {
      const info = (data as { name?: string; team?: string; intro?: string } | undefined) ?? {};
      return (
        <Card className="flex items-center gap-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-map-navy text-lg font-bold text-white">
            {(info.name ?? fields.title ?? "?").slice(0, 1)}
          </div>
          <div>
            <p className="font-bold text-map-ink">{info.name ?? fields.title}</p>
            {info.team && <p className="text-sm text-slate-500">{info.team}</p>}
            {info.intro && <p className="mt-1 text-sm text-slate-500">{info.intro}</p>}
          </div>
        </Card>
      );
    }

    case "fileDownload": {
      const fileName = (data?.fileName as string) ?? "자료.pdf";
      return (
        <Card className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-map-navy/10 text-map-navy">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-map-ink">{fields.title ?? fileName}</p>
              <p className="text-xs text-slate-400">{fileName}</p>
            </div>
          </div>
          {isLoggedIn ? (
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4" /> 다운로드
            </Button>
          ) : (
            <Link href="/login">
              <Button size="sm" variant="subtle">
                <Lock className="h-4 w-4" /> 로그인 후 다운로드
              </Button>
            </Link>
          )}
        </Card>
      );
    }

    case "pdfViewer":
      return (
        <div className="flex aspect-[4/3] items-center justify-center rounded-card border border-dashed border-slate-300 bg-slate-50 text-slate-400">
          PDF 뷰어 영역 (PDF.js) — {fields.title ?? "문서"}
        </div>
      );

    case "flipbook":
      return (
        <div className="flex aspect-video items-center justify-center rounded-card border border-dashed border-map-navy-mute/40 bg-map-gold-soft/40 text-map-navy-mute">
          플립북 뷰어 영역 (react-pageflip) — {fields.title ?? "자료"}
        </div>
      );

    case "video":
      return (
        <div className="aspect-video overflow-hidden rounded-card bg-black">
          {data?.embedUrl ? (
            <iframe
              className="h-full w-full"
              src={data.embedUrl as string}
              title={fields.title ?? "영상"}
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          ) : (
            <div className="grid h-full place-items-center text-slate-500">영상 URL 미등록</div>
          )}
        </div>
      );

    case "embed":
    case "formEmbed":
      return (
        <div className="overflow-hidden rounded-card border border-slate-200">
          {data?.sanitizedEmbedCode ? (
            <div
              className="[&_iframe]:w-full [&_iframe]:min-h-[480px]"
              // sanitizeEmbedCode()를 거친 안전한 iframe 코드만 저장/렌더링한다.
              dangerouslySetInnerHTML={{ __html: data.sanitizedEmbedCode as string }}
            />
          ) : (
            <div className="grid h-48 place-items-center text-slate-400">임베드 콘텐츠 미등록</div>
          )}
        </div>
      );

    case "accordion":
    case "faq": {
      const items = (data?.items as { q: string; a: string }[]) ?? [];
      return (
        <div className="flex flex-col gap-3">
          {fields.title && <h3 className="text-xl font-bold text-map-ink">{fields.title}</h3>}
          {items.map((item) => (
            <details key={item.q} className="group rounded-card border border-slate-200 p-4">
              <summary className="cursor-pointer list-none font-semibold text-map-ink marker:content-['']">
                {item.q}
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.a}</p>
            </details>
          ))}
        </div>
      );
    }

    case "divider":
      return <hr className="border-slate-200" />;

    case "spacer":
      return <div style={{ height: 24 }} />;

    case "progress": {
      const percent = (data?.percent as number) ?? 0;
      return (
        <Card>
          <div className="mb-2 flex items-center justify-between">
            <p className="font-bold text-map-ink">{fields.title ?? "진행률"}</p>
            <span className="text-sm font-semibold text-map-navy">{percent}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-map-gold to-map-navy"
              style={{ width: `${percent}%` }}
            />
          </div>
        </Card>
      );
    }

    case "statCard": {
      const stats = (data?.stats as { label: string; value: string }[]) ?? [];
      return (
        <div className="flex flex-col gap-4">
          {fields.title && <h3 className="text-xl font-bold text-map-ink">{fields.title}</h3>}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <Card key={s.label} className="text-center">
                <p className="font-display text-2xl font-medium text-map-navy">{s.value}</p>
                <p className="mt-1 text-xs text-slate-500">{s.label}</p>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    case "schedule":
      return (
        <Card>
          <p className="font-bold text-map-ink">{fields.title ?? "일정"}</p>
          <p className="mt-2 text-sm text-slate-500">/schedule 페이지에서 전체 일정을 확인하세요.</p>
        </Card>
      );

    case "recentNotices":
      return (
        <Card>
          <p className="font-bold text-map-ink">{fields.title ?? "최신 공지"}</p>
          <p className="mt-2 text-sm text-slate-500">/announcements 페이지에서 확인하세요.</p>
        </Card>
      );

    case "recentMaterials":
      return (
        <Card>
          <p className="font-bold text-map-ink">{fields.title ?? "최근 자료"}</p>
          <p className="mt-2 text-sm text-slate-500">/materials 페이지에서 확인하세요.</p>
        </Card>
      );

    case "recentActivity":
      return (
        <Card>
          <p className="font-bold text-map-ink">{fields.title ?? "최근 활동"}</p>
        </Card>
      );

    default:
      return (
        <div className="rounded-card border border-dashed border-slate-300 p-4 text-sm text-slate-400">
          아직 지원하지 않는 블록 유형입니다: {type}
        </div>
      );
  }
}
