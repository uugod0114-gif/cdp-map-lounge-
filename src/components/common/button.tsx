import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50 active:opacity-80",
  {
    variants: {
      variant: {
        primary: "bg-map-navy text-white hover:bg-map-navy-soft",
        inverse: "bg-white text-map-navy hover:bg-map-mist",
        outline: "border border-map-navy text-map-navy bg-transparent hover:bg-map-gold-soft",
        ghost: "text-map-navy hover:bg-map-mist",
        subtle: "bg-map-mist text-map-navy hover:bg-map-line",
        mint: "bg-map-gold-soft text-map-navy hover:bg-map-navy-mute/40",
        destructive: "bg-red-600 text-white hover:bg-red-700",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-14 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";
