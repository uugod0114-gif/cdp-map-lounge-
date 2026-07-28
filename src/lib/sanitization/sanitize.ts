import { DEFAULT_ALLOWED_EMBED_DOMAINS } from "@/lib/embeds/detect";

/**
 * 운영진이 입력한 iframe 임베드 코드를 정제한다.
 * - <script> 태그 제거
 * - on* 이벤트 핸들러 속성 제거
 * - javascript: 프로토콜 제거
 * - 허용 도메인 목록에 없는 src는 차단
 * - iframe에는 sandbox 속성을 강제 적용
 *
 * 원본 코드(raw)와 정제 결과(sanitized)는 항상 분리 저장한다. (기획서 10장)
 */
export function sanitizeEmbedCode(
  rawHtml: string,
  allowedDomains: string[] = DEFAULT_ALLOWED_EMBED_DOMAINS,
): { sanitized: string; blocked: boolean; reason?: string } {
  let html = rawHtml.trim();

  if (!html) return { sanitized: "", blocked: true, reason: "빈 코드입니다." };

  // script 태그 차단
  if (/<script/i.test(html)) {
    return {
      sanitized: "",
      blocked: true,
      reason: "script 태그가 포함된 코드는 저장할 수 없습니다.",
    };
  }

  // 오직 iframe 태그만 허용
  const iframeMatch = html.match(/<iframe[^>]*>[\s\S]*?<\/iframe>|<iframe[^>]*\/?>/i);
  if (!iframeMatch) {
    return {
      sanitized: "",
      blocked: true,
      reason: "iframe 태그만 임베드로 저장할 수 있습니다.",
    };
  }
  html = iframeMatch[0];

  // 이벤트 핸들러 속성 제거 (onload, onclick 등)
  html = html.replace(/\son\w+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, "");

  // javascript: 프로토콜 제거
  html = html.replace(/javascript:/gi, "");

  const srcMatch = html.match(/src=["']([^"']+)["']/i);
  const src = srcMatch?.[1] ?? "";
  let host = "";
  try {
    host = new URL(src).hostname;
  } catch {
    return { sanitized: "", blocked: true, reason: "유효하지 않은 src입니다." };
  }

  const allowed = allowedDomains.some((domain) => {
    if (domain.startsWith("*.")) return host.endsWith(domain.slice(1));
    return host === domain;
  });

  if (!allowed) {
    return {
      sanitized: "",
      blocked: true,
      reason: `허용되지 않은 도메인입니다: ${host}. 관리자 설정 > 허용 도메인에서 추가해 주세요.`,
    };
  }

  // sandbox 속성 강제 적용
  if (!/sandbox=/i.test(html)) {
    html = html.replace(
      /<iframe/i,
      '<iframe sandbox="allow-scripts allow-same-origin allow-forms allow-popups"',
    );
  }
  if (!/loading=/i.test(html)) {
    html = html.replace(/<iframe/i, '<iframe loading="lazy"');
  }

  return { sanitized: html, blocked: false };
}

/**
 * 고급 운영자가 블록에 추가로 입력하는 className을 검증한다.
 * 화이트리스트에 없는 클래스는 저장 시 제거된다.
 */
const ALLOWED_CLASS_PREFIXES = [
  "p-",
  "px-",
  "py-",
  "pt-",
  "pb-",
  "m-",
  "mx-",
  "my-",
  "mt-",
  "mb-",
  "gap-",
  "rounded",
  "shadow",
  "text-",
  "bg-",
  "border",
  "w-",
  "max-w-",
  "grid-cols-",
  "flex",
  "items-",
  "justify-",
  "font-",
  "tracking-",
  "leading-",
  "opacity-",
];

export function sanitizeExtraClassName(input: string): string {
  return input
    .split(/\s+/)
    .filter(Boolean)
    .filter((cls) =>
      ALLOWED_CLASS_PREFIXES.some((prefix) => cls.startsWith(prefix)),
    )
    .join(" ");
}
