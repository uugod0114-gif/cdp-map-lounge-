import type { EmbedKind } from "@/types/content";

interface DetectionRule {
  kind: EmbedKind;
  test: (url: string) => boolean;
}

const RULES: DetectionRule[] = [
  { kind: "youtube", test: (u) => /(youtube\.com\/watch|youtu\.be\/)/i.test(u) },
  { kind: "vimeo", test: (u) => /vimeo\.com\//i.test(u) },
  { kind: "flipbook", test: (u) => /fliphtml5\.com/i.test(u) },
  { kind: "googleForms", test: (u) => /docs\.google\.com\/forms/i.test(u) },
  { kind: "googleSlides", test: (u) => /docs\.google\.com\/presentation/i.test(u) },
  { kind: "googleDocs", test: (u) => /docs\.google\.com\/document/i.test(u) },
  { kind: "googleDrive", test: (u) => /drive\.google\.com\//i.test(u) },
  { kind: "microsoftForms", test: (u) => /forms\.office\.com|forms\.microsoft\.com/i.test(u) },
  { kind: "sharepoint", test: (u) => /sharepoint\.com/i.test(u) },
  { kind: "pdf", test: (u) => /\.pdf(\?|$)/i.test(u) },
  { kind: "image", test: (u) => /\.(png|jpe?g|gif|webp|svg)(\?|$)/i.test(u) },
];

/**
 * 세션/라운지 편집기에서 운영진이 URL을 입력하면
 * 가능한 경우 콘텐츠 유형을 자동으로 판별한다.
 * 어떤 규칙에도 해당하지 않으면 "link"(일반 링크 카드)로 처리한다.
 */
export function detectEmbedKind(url: string): EmbedKind {
  const trimmed = url.trim();
  if (!trimmed) return "link";
  const matched = RULES.find((rule) => rule.test(trimmed));
  return matched?.kind ?? "link";
}

export const EMBED_KIND_LABEL: Record<EmbedKind, string> = {
  youtube: "YouTube 영상",
  vimeo: "Vimeo 영상",
  googleDrive: "Google Drive 파일",
  googleDocs: "Google Docs",
  googleSlides: "Google Slides",
  googleForms: "Google Forms 설문",
  microsoftForms: "Microsoft Forms 설문",
  sharepoint: "SharePoint 문서",
  pdf: "PDF 문서",
  flipbook: "플립북 자료",
  image: "이미지",
  iframe: "iframe 임베드",
  link: "일반 링크",
};

/** 관리자 설정에서 관리하는 iframe 허용 도메인 (Phase 1: 목업 기본값) */
export const DEFAULT_ALLOWED_EMBED_DOMAINS = [
  "www.youtube.com",
  "player.vimeo.com",
  "docs.google.com",
  "drive.google.com",
  "forms.office.com",
  "*.sharepoint.com",
  "*.fliphtml5.com",
];

export function isFlipHtml5Url(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return host === "fliphtml5.com" || host.endsWith(".fliphtml5.com");
  } catch {
    return false;
  }
}

export function toEmbedUrl(kind: EmbedKind, url: string): string {
  if (kind === "youtube") {
    const idMatch = url.match(/(?:v=|youtu\.be\/)([\w-]{6,})/);
    return idMatch ? `https://www.youtube.com/embed/${idMatch[1]}` : url;
  }
  if (kind === "vimeo") {
    const idMatch = url.match(/vimeo\.com\/(\d+)/);
    return idMatch ? `https://player.vimeo.com/video/${idMatch[1]}` : url;
  }
  return url;
}
