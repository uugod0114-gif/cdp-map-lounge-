"use client";

import { Cloud, Heart, Leaf, Moon, Music, Star, Sun, Zap } from "lucide-react";

/**
 * 익명 아이콘 아바타.
 * 작성자 식별자(seed)를 해시해서 항상 같은 아이콘·색·별칭이 나온다.
 * → 이름은 감추되(익명), 같은 사람의 글·댓글은 같은 아이콘으로 이어져 보인다.
 * 실명 매핑은 서버 데이터에만 남고 화면에는 노출되지 않는다.
 */
const PERSONAS = [
  { label: "별", Icon: Star, bg: "#e7f4ee", fg: "#0f8a5e" },
  { label: "새싹", Icon: Leaf, bg: "#eaf6e6", fg: "#3d7a2e" },
  { label: "해", Icon: Sun, bg: "#fdf3da", fg: "#b07d0a" },
  { label: "달", Icon: Moon, bg: "#eceffd", fg: "#4a5ac9" },
  { label: "구름", Icon: Cloud, bg: "#eef4f8", fg: "#4a7899" },
  { label: "하트", Icon: Heart, bg: "#fdeceb", fg: "#c2554b" },
  { label: "번개", Icon: Zap, bg: "#f4eefb", fg: "#7a4ac9" },
  { label: "음표", Icon: Music, bg: "#f0f1f3", fg: "#4e5968" },
] as const;

export function anonPersona(seed: string) {
  let hash = 7;
  for (const ch of seed) {
    hash = (hash * 31 + (ch.codePointAt(0) ?? 0)) % 100003;
  }
  return PERSONAS[hash % PERSONAS.length];
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
