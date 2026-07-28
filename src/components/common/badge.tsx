import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";
import type { ContentStatus } from "@/types/content";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
  {
    variants: {
      variant: {
        neutral: "bg-slate-100 text-slate-600",
        navy: "bg-map-navy/10 text-map-navy",
        yellow: "bg-map-gold-soft text-amber-700",
        coral: "bg-map-gold-soft text-map-navy",
        success: "bg-emerald-100 text-emerald-700",
        warning: "bg-amber-100 text-amber-700",
        danger: "bg-red-100 text-red-700",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

const STATUS_META: Record<ContentStatus, { label: string; variant: BadgeProps["variant"] }> = {
  draft: { label: "초안", variant: "neutral" },
  in_review: { label: "검토중", variant: "warning" },
  approved: { label: "승인됨", variant: "navy" },
  published: { label: "공개중", variant: "success" },
  archived: { label: "보관됨", variant: "neutral" },
};

export function StatusBadge({ status }: { status: ContentStatus }) {
  const meta = STATUS_META[status];
  return <Badge variant={meta.variant}>{meta.label}</Badge>;
}
