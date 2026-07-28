import Link from "next/link";

export default function RoutingArchitectureDoc() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 w-full animate-in fade-in duration-500 text-slate-300">
      <Link
        href="/docs"
        className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium mb-8 transition-colors group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="group-hover:-translate-x-1 transition-transform"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back to Documentation
      </Link>

      <div className="prose prose-invert prose-slate max-w-none prose-headings:text-white prose-a:text-indigo-400 prose-code:text-indigo-300 prose-code:bg-indigo-950/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8">
          page.tsx, layout.tsx, loading.tsx and error.tsx
        </h1>

        <p className="text-lg leading-relaxed mb-8">
          Inside the <code>app/</code> folder, each folder represents a route
          segment.
          <br />
          Example: <code>src/app/dashboard</code> maps to the route{" "}
          <code>/dashboard</code>.
        </p>

        <ul className="list-disc pl-6 space-y-4 mb-12 text-slate-400 text-lg">
          <li>
            <strong className="text-white">layout.tsx</strong>: Shared,
            persistent UI for a route and its children. Does not re-render on
            navigation.
          </li>
          <li>
            <strong className="text-white">page.tsx</strong>: Unique UI for a
            specific route. Makes the route publicly accessible.
          </li>
          <li>
            <strong className="text-white">loading.tsx</strong>: Automatic
            loading UI wrapper using React Suspense.
          </li>
          <li>
            <strong className="text-white">error.tsx</strong>: Automatic error
            boundary wrapper to catch runtime exceptions.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-12 mb-6 border-b border-slate-800 pb-2">
          Component Hierarchy (The component tree)
        </h2>
        <p className="mb-6">
          When you place these files in the same folder, Next.js automatically
          nests them behind the scenes into this hierarchy:
        </p>
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 mb-12 font-mono text-sm overflow-x-auto text-indigo-200">
          <pre>
            <code>{`<Layout>
  <ErrorBoundary fallback={<Error />}>
    <Suspense fallback={<Loading />}>
      <Page />
    </Suspense>
  </ErrorBoundary>
</Layout>`}</code>
          </pre>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-6 border-b border-slate-800 pb-2">
          layout.tsx (The Shell)
        </h2>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>UI that shared across the multiple pages.</li>
          <li>
            Example: Instead of rewriting navbar/sidebar/footer on every page,
            You write them once.
          </li>
          <li>
            When navigating between sibling routes, the layout does not
            re-render (state is preserved). Only the child page changes.
          </li>
          <li>
            Every root layout (<code>app/layout.tsx</code>) must contain{" "}
            <code>&lt;html&gt;</code> and <code>&lt;body&gt;</code> tags.
          </li>
        </ul>

        <div className="bg-slate-900 border-l-4 border-indigo-500 p-4 rounded-r-xl mb-12">
          <h4 className="font-semibold text-white mb-2">Why use layout?</h4>
          <ul className="list-disc pl-6 space-y-1 text-slate-300">
            <li>Shared UI</li>
            <li>Persistent UI</li>
            <li>Doesn&apos;t re-render during navigation</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-6 border-b border-slate-800 pb-2">
          page.tsx (The Content)
        </h2>
        <ul className="list-disc pl-6 space-y-2 mb-12">
          <li>Represents the UI of a route.</li>
          <li>The actual page users visit.</li>
          <li>
            Fits inside the layout of its own folder, which is inside the layout
            of the parent folder.
          </li>
          <li>
            A folder without a <code>page.tsx</code> is just a category folder,
            it cannot be accessed via a URL.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-12 mb-6 border-b border-slate-800 pb-2">
          loading.tsx (The UX Enhancer)
        </h2>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>
            Shows a loading skeleton or spinner while the <code>page.tsx</code>{" "}
            (or data fetching) is loading.
          </li>
          <li>
            Wraps the <code>page.tsx</code> of its own folder and all child
            routes below it.
          </li>
          <li>
            No need to manually write <code>if (loading)</code>
          </li>
          <li>
            Navbar and sidebar remain visible, Only page content shows loading.
          </li>
        </ul>

        <div className="bg-slate-900 border-l-4 border-indigo-500 p-4 rounded-r-xl mb-12">
          <p className="mb-4 italic text-slate-300">
            &quot;It uses React Suspense under the hood. If a nested child
            folder does not have its own loading.tsx, it will bubble up and use
            the parent&apos;s loading.tsx.&quot;
          </p>
          <h4 className="font-semibold text-white mb-2">
            Why use loading.tsx?
          </h4>
          <ul className="list-disc pl-6 space-y-1 text-slate-300">
            <li>Better UX while server components/data are loading.</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-6 border-b border-slate-800 pb-2">
          error.tsx (The Safety Net)
        </h2>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>
            Catches runtime errors in the component tree and shows a fallback UI
            instead of crashing the whole app.
          </li>
          <li>
            It wraps everything below the layout. An <code>error.tsx</code>{" "}
            cannot catch errors thrown in a <code>layout.tsx</code> of the same
            folder. To catch layout errors, the <code>error.tsx</code> must be
            placed in the parent folder.
          </li>
          <li>
            Must be a Client Component (<code>&quot;use client&quot;</code> at
            the top). It provides a <code>reset()</code> function to let users
            try reloading the broken section.
          </li>
        </ul>

        <div className="bg-slate-900 border-l-4 border-indigo-500 p-4 rounded-r-xl mb-12">
          <h4 className="font-semibold text-white mb-2">
            Why client component?
          </h4>
          <ul className="list-disc pl-6 space-y-1 text-slate-300">
            <li>Button click</li>
            <li>
              <code>reset()</code> function availability
            </li>
            <li>Event handlers</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
