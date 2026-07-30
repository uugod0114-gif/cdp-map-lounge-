import { cn } from "@/lib/utils/cn";

/**
 * 토스 스타일의 플랫한 화이트 박스 + 얇은 회색 테두리.
 * (그림자/그라데이션 없이 여백과 테두리만으로 구분감을 준다)
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
        "rounded-[1.25rem] border border-map-line bg-white p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
