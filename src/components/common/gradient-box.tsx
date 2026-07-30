import { cn } from "@/lib/utils/cn";

/**
 * 옅은 그라데이션 테두리 + 은은한 컬러 배경의 카드.
 * 참고 레퍼런스(글래스모피즘 대시보드, 넘버링 스텝 박스)의 부드러운 테두리 느낌.
 */
export function GradientBox({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[1.5rem] bg-gradient-to-br from-map-navy-mute/40 via-map-gold/25 to-map-navy-soft/30 p-[1.5px]",
        className,
      )}
    >
      <div className="h-full w-full rounded-[calc(1.5rem-1.5px)] bg-white/90 p-6 backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
}
