"use client";

import { Activity } from "lucide-react";

export function HospitalLogo({ size = "md", compact = false }: { size?: "sm" | "md" | "lg"; compact?: boolean }) {
  const iconSize = size === "lg" ? 32 : size === "sm" ? 18 : 24;
  const nameSize = size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-lg";

  return (
    <div className="flex items-center gap-2.5" aria-label="Mehr Hospital">
      <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-cyan-300/30 bg-gradient-to-br from-cyan-400 to-cyan-400 text-slate-950 shadow-[0_8px_24px_rgba(34,211,238,.22)]">
        <Activity size={iconSize} strokeWidth={2.5} />
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#060B14] bg-cyan-100 [html.light-mode_&]:border-white" />
      </span>
      {!compact && (
        <span className="leading-none">
          <b className={`${nameSize} block font-black tracking-tight text-white [html.light-mode_&]:text-slate-900`}>MEHR</b>
          <span className="mt-1 block text-[9px] font-extrabold tracking-[0.28em] text-cyan-300 [html.light-mode_&]:text-cyan-700">HOSPITAL</span>
        </span>
      )}
    </div>
  );
}
