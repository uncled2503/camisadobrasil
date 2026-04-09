import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold tracking-wide transition-all duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "relative overflow-hidden rounded-2xl bg-gold-shine px-8 text-[hsl(222,44%,6%)] shadow-gold-soft shadow-inner-highlight before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/25 before:to-transparent before:opacity-40 hover:brightness-[1.05] hover:shadow-[0_0_48px_-16px_rgba(196,169,122,0.35)] active:scale-[0.985] md:hover:scale-[1.01]",
        outline:
          "rounded-2xl border border-gold/40 bg-transparent text-gold-bright transition-[border,background,transform,box-shadow] duration-300 hover:border-gold/55 hover:bg-gold/[0.06] hover:shadow-[0_0_40px_-20px_rgba(196,169,122,0.2)] md:hover:scale-[1.01] active:scale-[0.99]",
        ghost:
          "rounded-xl text-muted-foreground transition-colors duration-300 hover:bg-white/[0.04] hover:text-foreground",
        subtle:
          "rounded-xl border border-white/[0.08] bg-white/[0.04] text-foreground shadow-inner-highlight transition-[border,background,transform] duration-300 hover:border-white/15 hover:bg-white/[0.07] md:hover:scale-[1.01] active:scale-[0.99]",
      },
      size: {
        default: "h-12 px-6 py-2 text-sm",
        sm: "h-10 rounded-lg px-4 text-xs tracking-wider",
        lg: "h-[3.75rem] min-w-[12rem] rounded-2xl px-10 text-[0.95rem] uppercase tracking-[0.12em]",
        xl: "h-[4rem] min-w-[14rem] rounded-2xl px-12 text-base uppercase tracking-[0.14em]",
        icon: "h-11 w-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
