"use client";
import { Cloud, Heart, Leaf, Moon, Music, Star, Sun, Zap } from "lucide-react";

/**
 * 익명 아이콘 아바타.
 * 작성자 식별자(seed)를 해시해서 항상 같은 아이콘·색·별칭이 나온다.
 * → 이름은 감추되(익명), 같은 사람의 글·댓글은 같은 아이콘으로 이어져 보인다.
 * 실명 매핑은 서버 데이터에만 남고 화면에는 노출되지 않는다.
 * 아이콘 8종 x 색 6종 = 48조합으로 사용자 간 겹침을 줄인다.
 */
const ICONS = [
  { label: "별", Icon: Star },
  { label: "새싹", Icon: Leaf },
  { label: "해", Icon: Sun },
  { label: "달", Icon: Moon },
  { label: "구름", Icon: Cloud },
  { label: "하트", Icon: Heart },
  { label: "번개", Icon: Zap },
  { label: "음표", Icon: Music },
] as const;

const COLORS = [
  { bg: "#e7f4ee", fg: "#0f8a5e" },
  { bg: "#fdf3da", fg: "#b07d0a" },
  { bg: "#eceffd", fg: "#4a5ac9" },
  { bg: "#fdeceb", fg: "#c2554b" },
  { bg: "#f4eefb", fg: "#7a4ac9" },
  { bg: "#eef4f8", fg: "#4a7899" },
] as const;

function hashOf(seed: string, mult: number): number {
  let hash = 7;
  for (const ch of seed) {
    hash = (hash * mult + (ch.codePointAt(0) ?? 0)) % 100003;
  }
  return hash;
}

export function anonPersona(seed: string) {
  const icon = ICONS[hashOf(seed, 31) % ICONS.length];
  const color = COLORS[hashOf(seed, 17) % COLORS.length];
  return { ...icon, ...color };
}

export function AnonAvatar({
  seed,
  size = 32,
  showLabel = false,
  className,
}: {
  seed: string;
  size?: number;
  showLabel?: boolean;
  className?: string;
}) {
  const persona = anonPersona(seed);
  const { Icon } = persona;
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <span
        className="grid shrink-0 place-items-center rounded-full"
        style={{ width: size, height: size, background: persona.bg, color: persona.fg }}
        aria-hidden
      >
        <Icon style={{ width: size * 0.55, height: size * 0.55 }} strokeWidth={2.2} />
      </span>
      {showLabel && (
        <span className="text-sm font-semibold text-map-ink">익명의 {persona.label}</span>
      )}
    </span>
  );
}
