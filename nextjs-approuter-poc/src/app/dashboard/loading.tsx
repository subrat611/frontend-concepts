export default function Loading() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-3">
        <div className="h-9 w-48 bg-slate-800 rounded-lg animate-pulse" />
        <div className="h-5 w-72 bg-slate-800 rounded-lg animate-pulse" />
      </div>

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
            <div className="h-4 w-24 bg-slate-800 rounded animate-pulse" />
            <div className="h-8 w-32 bg-slate-800 rounded animate-pulse my-1" />
            <div className="h-3 w-40 bg-slate-800 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Chart Skeleton */}
      <div className="h-96 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center p-6">
        <div className="flex items-end gap-2 h-48 w-full max-w-lg opacity-20">
          <div className="w-full bg-slate-700 rounded-t-sm h-1/4 animate-pulse" />
          <div className="w-full bg-slate-700 rounded-t-sm h-2/4 animate-pulse" />
          <div className="w-full bg-slate-700 rounded-t-sm h-1/3 animate-pulse" />
          <div className="w-full bg-slate-700 rounded-t-sm h-3/4 animate-pulse" />
          <div className="w-full bg-slate-700 rounded-t-sm h-full animate-pulse" />
          <div className="w-full bg-slate-700 rounded-t-sm h-2/3 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
