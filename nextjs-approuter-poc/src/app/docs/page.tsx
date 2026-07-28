import Link from "next/link";

export default function DocsIndexPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 w-full animate-in fade-in zoom-in-95 duration-500">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">Documentation</h1>
      <p className="text-slate-400 text-lg md:text-xl mb-12">
        Explore the concepts behind the Next.js App Router Proof of Concept.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          href="/docs/routing-architecture/1-component-hierarchy"
          className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all group flex flex-col gap-4 shadow-lg"
        >
          <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <h2 className="text-xl font-semibold text-white group-hover:text-indigo-300 transition-colors">
            1. Component Hierarchy
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Learn about page.tsx, layout.tsx, loading.tsx, and error.tsx and how they compose the component hierarchy.
          </p>
        </Link>
        
        {/* Placeholder for future docs */}
        <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800/50 flex flex-col gap-4 opacity-50 cursor-not-allowed">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
          </div>
          <h2 className="text-xl font-semibold text-white">
            Server vs. Client Components
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Coming soon: Understanding the RSC Architecture.
          </p>
        </div>
      </div>
    </div>
  );
}
