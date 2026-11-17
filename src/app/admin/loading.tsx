import React from "react";

export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse p-4 sm:p-8">
      <div className="h-28 rounded-2xl bg-navy-900/60 border border-navy-800 p-6 flex flex-col justify-center space-y-3">
        <div className="h-6 w-1/3 rounded-lg bg-navy-800 animate-shimmer" />
        <div className="h-4 w-1/2 rounded-lg bg-navy-850 animate-shimmer" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 rounded-2xl bg-navy-900/60 border border-navy-800 p-4 space-y-3"
          >
            <div className="h-4 w-24 rounded bg-navy-800 animate-shimmer" />
            <div className="h-8 w-16 rounded bg-navy-800 animate-shimmer" />
          </div>
        ))}
      </div>

      <div className="h-96 rounded-2xl bg-navy-900/60 border border-navy-800 p-6 space-y-4">
        <div className="h-5 w-48 rounded bg-navy-800 animate-shimmer" />
        <div className="space-y-3 pt-4">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="h-14 rounded-xl bg-navy-850 animate-shimmer" />
          ))}
        </div>
      </div>
    </div>
  );
}
