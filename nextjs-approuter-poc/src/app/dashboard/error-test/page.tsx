"use client";

import { useState } from "react";

export default function ErrorTestPage() {
  const [shouldCrash, setShouldCrash] = useState(false);

  if (shouldCrash) {
    throw new Error("💥 Boom! This is a simulated runtime error to demonstrate error.tsx catching it.");
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Error Boundary Test</h1>
        <p className="text-slate-400">Trigger an intentional error to see how <code className="text-indigo-400">error.tsx</code> works.</p>
      </div>

      <div className="p-8 rounded-2xl border border-red-900/30 bg-red-950/10 flex flex-col items-start gap-4">
        <div className="flex items-center gap-3 text-red-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
          <h3 className="text-lg font-medium">Danger Zone</h3>
        </div>
        <p className="text-sm text-slate-400 max-w-xl">
          Clicking the button below will throw a standard JavaScript Error. The Next.js framework will catch this error and render the closest <code>error.tsx</code> file instead of crashing the entire application. Notice that the sidebar layout remains fully intact and functional!
        </p>
        <button 
          onClick={() => setShouldCrash(true)}
          className="mt-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-red-900/20 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/></svg>
          Trigger Error
        </button>
      </div>
    </div>
  );
}
