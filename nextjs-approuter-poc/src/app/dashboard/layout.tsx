"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // State to demonstrate that layouts preserve state across navigation
  const [count, setCount] = useState(0);

  const links = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/settings", label: "Settings" },
    { href: "/dashboard/error-test", label: "Error Boundary Test" },
  ];

  return (
    <div className="flex flex-1 flex-col md:flex-row h-full">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Navigation</h2>
          <nav className="flex flex-col gap-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? "bg-indigo-600/10 text-indigo-400 border border-indigo-600/20" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* State persistence demo */}
        <div className="mt-auto p-4 rounded-xl border border-slate-800 bg-slate-950/50 flex flex-col gap-3">
          <p className="text-xs text-slate-400">
            <strong>Layout State Demo:</strong><br />
            Notice how this counter persists when navigating between sidebar links.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xl font-mono text-white">{count}</span>
            <button 
              onClick={() => setCount(c => c + 1)}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-sm transition-colors"
            >
              Increment
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
