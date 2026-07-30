import { cn } from "@/lib/utils/cn";

/**
 * 화이트 배경 위에 트랜스포머티브 틸 톤의 동글동글한 블롭들을 흩뿌린,
 * 밝고 발랄한 느낌의 배경 장식.
 */
export function WaveBackground({ className }: { className?: string }) {
  return (
    <svg
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <circle cx="1060" cy="90" r="130" fill="var(--color-map-navy-mute)" opacity="0.35" />
      <circle cx="980" cy="40" r="46" fill="var(--color-map-navy-soft)" opacity="0.18" />
      <circle cx="140" cy="520" r="100" fill="var(--color-map-navy-mute)" opacity="0.3" />
      <circle cx="60" cy="430" r="30" fill="var(--color-map-gold)" opacity="0.25" />
      <circle cx="620" cy="60" r="18" fill="var(--color-map-navy-soft)" opacity="0.3" />
      <circle cx="1150" cy="360" r="55" fill="var(--color-map-navy-mute)" opacity="0.22" />
      <path
        d="M0 500 C 220 440 380 560 640 500 C 880 445 1020 520 1200 470 L1200 600 L0 600 Z"
        fill="var(--color-map-navy-mute)"
        opacity="0.12"
      />
    </svg>
  );
}
