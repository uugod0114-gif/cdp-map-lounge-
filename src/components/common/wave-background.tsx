import { cn } from "@/lib/utils/cn";

/**
 * 아주 절제된 배경 장식. imweb 스타일의 화이트 톤 히어로에서
 * 시선을 방해하지 않도록 아주 옅은 라인/원형만 남긴다.
 */
export function WaveBackground({ className }: { className?: string }) {
  return (
    <svg
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <circle cx="1080" cy="70" r="120" fill="var(--color-map-navy)" opacity="0.05" />
      <circle cx="90" cy="540" r="70" fill="var(--color-map-gold)" opacity="0.12" />
      <path
        d="M0 460 C 240 400 360 520 600 460 C 820 405 960 380 1200 430 L1200 600 L0 600 Z"
        fill="var(--color-map-navy)"
        opacity="0.03"
      />
    </svg>
  );
}
