import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";
import type { ContentStatus } from "@/types/content";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold shadow-sm",
  {
    variants: {
      variant: {
        neutral: "bg-slate-100 text-slate-600",
        navy: "bg-map-navy text-white",
        yellow: "bg-map-gold text-white",
        coral: "bg-map-navy-mute text-map-navy",
        success: "bg-emerald-500 text-white",
        warning: "bg-amber-500 text-white",
        danger: "bg-red-500 text-white",
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