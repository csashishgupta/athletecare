import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, icon, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-slate-300 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full ${
              icon ? "pl-9" : "pl-3.5"
            } pr-3.5 py-2.5 rounded-xl bg-slate-950 border text-slate-100 placeholder-slate-500 text-xs sm:text-sm transition-colors focus:outline-none focus:ring-1 ${
              error
                ? "border-rose-500/80 focus:border-rose-500 focus:ring-rose-500"
                : "border-slate-800 focus:border-cyan-400 focus:ring-cyan-400"
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-[11px] text-rose-400 font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
