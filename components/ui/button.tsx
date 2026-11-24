import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "lime" | "outline" | "ghost" | "danger" | "secondary" | "glow";
  size?: "sm" | "md" | "lg" | "icon";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 rounded-xl font-bold tracking-tight select-none transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 cursor-pointer",
        {
          // Bright medical cyan with a soft neon glow
          "bg-gradient-to-r from-cyan-400 to-cyan-400 text-slate-950 shadow-md shadow-cyan-500/25 hover:from-cyan-300 hover:to-cyan-300 hover:shadow-[0_0_26px_rgba(34,211,238,.36)] hover:-translate-y-0.5":
            variant === "primary",
          // Brighter cyan accent
          "bg-gradient-to-r from-cyan-400 to-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 hover:from-cyan-300 hover:to-cyan-300 hover:shadow-[0_0_28px_rgba(34,211,238,.38)] hover:-translate-y-0.5":
            variant === "lime",
          // Glass Outline
          "border border-white/20 bg-white/[0.06] text-white backdrop-blur-sm hover:bg-cyan-400/10 hover:border-cyan-300/70 hover:text-cyan-100 hover:shadow-[0_0_20px_rgba(34,211,238,.16)]":
            variant === "outline",
          // Ghost
          "bg-transparent text-slate-300 hover:bg-white/10 hover:text-white":
            variant === "ghost",
          // Danger
          "bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-md shadow-slate-900/30 hover:from-slate-500 hover:to-slate-500":
            variant === "danger",
          // Secondary subtle
          "bg-slate-800 text-slate-100 hover:bg-slate-700 hover:text-white border border-slate-700/60":
            variant === "secondary",
          // Neon Glow special
          "bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.6)] hover:shadow-[0_0_30px_rgba(34,211,238,0.85)] hover:bg-cyan-400 hover:-translate-y-0.5":
            variant === "glow",
        },
        {
          "rounded-xl px-3.5 py-1.5 text-xs": size === "sm",
          "rounded-xl px-5 py-2.5 text-sm": size === "md",
          "rounded-2xl px-7 py-3.5 text-base": size === "lg",
          "h-10 w-10 rounded-xl p-0": size === "icon",
        },
        className
      )}
      {...props}
    />
  );
}
