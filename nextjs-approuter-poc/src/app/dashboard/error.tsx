"use client"; // Error components must be Client Components

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Dashboard error caught:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-6 text-center animate-in zoom-in-95 duration-300">
      <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </div>
      
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-white">Something went wrong!</h2>
        <p className="text-slate-400 max-w-md mx-auto">
          An error occurred in the component tree. This fallback UI is rendered by <code className="text-indigo-400 bg-indigo-400/10 px-1 py-0.5 rounded text-sm">error.tsx</code>.
        </p>
        {error.message && (
          <div className="mt-4 p-4 rounded-lg bg-red-950/30 border border-red-900/50 text-left">
            <p className="text-sm font-mono text-red-300 whitespace-pre-wrap break-words">
              {error.message}
            </p>
          </div>
        )}
      </div>

      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full font-medium transition-all hover:scale-105 active:scale-95"
      >
        Try again
      </button>
    </div>
  );
}
