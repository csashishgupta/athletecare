import React from "react";

export default function AthleteLoading() {
  return (
    <div className="space-y-6 animate-pulse p-4 sm:p-8">
      {/* Top Banner Skeleton */}
      <div className="h-28 rounded-2xl bg-navy-900/60 border border-navy-800 p-6 flex flex-col justify-center space-y-3">
        <div className="h-6 w-1/3 rounded-lg bg-navy-800 animate-shimmer" />
        <div className="h-4 w-1/2 rounded-lg bg-navy-850 animate-shimmer" />
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 rounded-2xl bg-navy-900/60 border border-navy-800 p-4 space-y-3"
          >
            <div className="flex justify-between items-center">
              <div className="h-4 w-20 rounded bg-navy-800 animate-shimmer" />
              <div className="w-8 h-8 rounded-lg bg-navy-800 animate-shimmer" />
            </div>
            <div className="h-8 w-24 rounded bg-navy-800 animate-shimmer" />
            <div className="h-2 w-full rounded bg-navy-850 animate-shimmer" />
          </div>
        ))}
      </div>

      {/* Chart and Detail Area Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-80 rounded-2xl bg-navy-900/60 border border-navy-800 p-6 space-y-4">
          <div className="flex justify-between">
            <div className="h-5 w-40 rounded bg-navy-800 animate-shimmer" />
            <div className="h-5 w-24 rounded bg-navy-800 animate-shimmer" />
          </div>
          <div className="h-56 rounded-xl bg-navy-950/50 animate-shimmer" />
        </div>
        <div className="h-80 rounded-2xl bg-navy-900/60 border border-navy-800 p-6 space-y-4">
          <div className="h-5 w-32 rounded bg-navy-800 animate-shimmer" />
          <div className="space-y-3 pt-2">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-10 rounded-lg bg-navy-850 animate-shimmer" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
