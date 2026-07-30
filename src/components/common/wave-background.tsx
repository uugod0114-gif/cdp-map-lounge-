import { cn } from "@/lib/utils/cn";

/**
 * 팬톤 2026(클라우드 댄서 배경 + 틸 그린) 컨셉의 고급스러운 실크 웨이브 배경.
 * 여러 겹의 흐르는 그라데이션 리본으로 깊이감을 준다.
 */
export function WaveBackground({ className }: { className?: string }) {
  return (
    <svg
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="mapTealRibbon1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-map-navy-mute)" stopOpacity="0.5" />
          <stop offset="50%" stopColor="var(--color-map-navy-soft)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--color-map-navy)" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="mapTealRibbon2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--color-map-navy)" stopOpacity="0.28" />
          <stop offset="60%" stopColor="var(--color-map-navy-soft)" stopOpacity="0.16" />
          <stop offset="100%" stopColor="var(--color-map-navy-mute)" stopOpacity="0.06" />
        </linearGradient>
        <radialGradient id="mapTealGlow" cx="80%" cy="15%" r="60%">
          <stop offset="0%" stopColor="var(--color-map-navy-mute)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--color-map-navy-mute)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="1200" height="600" fill="url(#mapTealGlow)" />

      <path
        d="M-50 120 C 220 40 360 220 620 140 C 880 60 1040 160 1250 90 L1250 -50 L-50 -50 Z"
        fill="url(#mapTealRibbon1)"
      />
      <path
        d="M-50 480 C 260 380 420 560 700 470 C 940 395 1060 480 1250 400 L1250 650 L-50 650 Z"
        fill="url(#mapTealRibbon2)"
      />
      <path
        d="M-50 320 C 200 260 380 400 640 320 C 880 250 1020 340 1250 280"
        fill="none"
        stroke="var(--color-map-navy-mute)"
        strokeOpacity="0.25"
        strokeWidth="1.5"
      />
      <circle cx="1080" cy="80" r="130" fill="url(#mapTealRibbon1)" opacity="0.4" />
      <circle cx="70" cy="520" r="90" fill="var(--color-map-gold)" opacity="0.1" />
    </svg>
  );
}