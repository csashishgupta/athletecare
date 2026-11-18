import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "destructive" | "danger" | "neutral" | "cyan" | "purple" | "outline" | "info" | "primary";
}

export function Badge({ className = "", variant = "default", children, ...props }: BadgeProps) {
  const variants: Record<string, string> = {
    default: "bg-slate-800 text-slate-300 border-slate-700",
    neutral: "bg-slate-800 text-slate-300 border-slate-700",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    destructive: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    danger: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    info: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    primary: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    outline: "border-white/[0.1] text-slate-300",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
