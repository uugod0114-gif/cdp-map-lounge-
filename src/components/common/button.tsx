import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 active:translate-y-[2px]",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-br from-map-navy-mute via-map-navy-soft to-map-navy text-white shadow-[0_6px_0_0_rgba(18,63,69,0.35)] hover:brightness-105 hover:shadow-[0_4px_0_0_rgba(18,63,69,0.35)] active:shadow-[0_2px_0_0_rgba(18,63,69,0.35)]",
        inverse:
          "bg-white text-map-navy shadow-[0_5px_0_0_rgba(18,63,69,0.12)] hover:bg-map-mist hover:shadow-[0_3px_0_0_rgba(18,63,69,0.12)]",
        outline:
          "border-2 border-map-navy text-map-navy bg-transparent hover:bg-map-navy hover:text-white",
        ghost: "text-map-navy hover:bg-map-mist",
        subtle: "bg-map-mist text-map-navy hover:bg-map-line",
        mint:
          "bg-map-navy-mute/30 text-map-navy-soft shadow-[0_5px_0_0_rgba(142,224,211,0.5)] hover:bg-map-navy-mute/45 hover:shadow-[0_3px_0_0_rgba(142,224,211,0.5)]",
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