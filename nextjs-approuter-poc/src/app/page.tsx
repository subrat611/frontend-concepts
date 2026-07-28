import Link from "next/link";

export default function Home() {
  const pocs = [
    {
      title: "1. Component Hierarchy",
      description: "page.tsx, layout.tsx, loading.tsx and error.tsx including nested behaviour.",
      href: "/dashboard",
      docHref: "/docs/routing-architecture/1-component-hierarchy",
      status: "completed"
    },
    {
      title: "2. Layouts vs Templates",
      description: "Behaviour, Lifecycles, and State Persistence differences.",
      href: "#",
      docHref: "#",
      status: "pending"
    },
    {
      title: "3. Dynamic Routing",
      description: "Catch-all [...slug] vs Optional Catch-all [[...slug]].",
      href: "#",
      docHref: "#",
      status: "pending"
    },
    {
      title: "4. Route Grouping",
      description: "Organizing routes without affecting URL paths using (folder).",
      href: "#",
      docHref: "#",
      status: "pending"
    },
    {
      title: "5. Advanced Routing Patterns",
      description: "Parallel Routes (@folder) and Intercepting Routes ((.)folder).",
      href: "#",
      docHref: "#",
      status: "pending"
    }
  ];

  return (
    <div className="flex-1 flex flex-col items-center py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-slate-950 to-slate-950 -z-10" />
      
      <main className="flex flex-col items-center px-6 w-full max-w-5xl mx-auto z-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-center bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
          Routing Architecture POCs
        </h1>
        
        <p className="text-lg text-slate-400 mb-8 text-center max-w-2xl leading-relaxed">
          Select a concept below to interact with its dedicated Proof of Concept. We are building these out step-by-step based on the documentation.
        </p>

        <div className="flex justify-center mb-16">
          <Link
            href="/docs"
            className="px-6 py-3 rounded-full bg-slate-900 border border-slate-700 hover:border-indigo-500 hover:bg-slate-800 text-slate-300 font-medium transition-all flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            Read the Documentation
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {pocs.map((poc, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl border flex flex-col gap-4 transition-all duration-300 relative overflow-hidden group ${
                poc.status === "completed" 
                  ? "bg-slate-900 border-indigo-500/30 hover:border-indigo-500 hover:shadow-[0_0_30px_rgba(79,70,229,0.15)] hover:-translate-y-1" 
                  : "bg-slate-950/50 border-slate-800/50 opacity-60"
              }`}
            >
              {poc.status === "completed" && (
                <div className="absolute top-0 right-0 p-4">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
              )}
              
              <div className="flex-1">
                <h2 className={`text-xl font-bold mb-2 ${poc.status === "completed" ? "text-white" : "text-slate-300"}`}>
                  {poc.title}
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {poc.description}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800/50 flex items-center justify-between">
                {poc.status === "completed" ? (
                  <>
                    <Link href={poc.href} className="text-xs font-medium uppercase tracking-wider text-indigo-400 hover:text-indigo-300 transition-colors">
                      View POC →
                    </Link>
                    <Link href={poc.docHref} className="text-xs font-medium uppercase tracking-wider text-slate-400 hover:text-slate-300 transition-colors flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                      View Doc
                    </Link>
                  </>
                ) : (
                  <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Coming Soon
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
