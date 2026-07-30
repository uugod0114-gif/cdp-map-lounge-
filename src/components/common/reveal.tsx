"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** 등장 지연 시간(ms). 카드 여러 개를 순서대로 나타나게 할 때 사용 */
  delay?: number;
}

/**
 * 화면에 스크롤되어 들어올 때 아래에서 위로 서서히 나타나는 효과.
 * toss.im 류의 "스크롤하면 섹션이 쓱 나타나는" 인터랙션을 가볍게 구현한다.
 * (별도 라이브러리 없이 IntersectionObserver + CSS transition만 사용)
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-700 ease-out",
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
