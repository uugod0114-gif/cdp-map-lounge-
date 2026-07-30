import { cn } from "@/lib/utils/cn";

/**
 * 토스 스타일의 아주 절제된 배경 장식.
 * 화려한 웨이브/블롭 대신, 아주 옅은 원형 하나만 은은하게 배치한다.
 */
export function WaveBackground({ className }: { className?: string }) {
  return (
    <svg
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <circle cx="1000" cy="120" r="220" fill="var(--color-map-gold-soft)" opacity="0.6" />
    </svg>
  );
}
