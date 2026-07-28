# Routing Architecture & File System (`page.tsx`, `layout.tsx`, `loading.tsx` and `error.tsx`)

Inside the `app/` folder, each folder represent as a route segment.

Example: `src/app/dashboard` -> in route `/dashboard`

- `layout.tsx` Shared, persistent UI for a route and its children. Does not re-render on navigation.
- `page.tsx` Unique UI for a specific route. Makes the route publicly accessible.
- `loading.tsx` Automatic loading UI wrapper using React Suspense.
- `error.tsx` Automatic error boundary wrapper to catch runtime exceptions.

## Component Hierarchy (The component tree)

When you place these files in the same folder, Next.js automatically nests them behind the scenes into this hierarchy:

```tsx
<Layout>
  <ErrorBoundary fallback={<Error />}>
    <Suspense fallback={<Loading />}>
      <Page />
    </Suspense>
  </ErrorBoundary>
</Layout>
```

## `layout.tsx` (The Shell)

- UI that shared across the multiple pages.
- Example: Instead of rewriting navbar/sidebar/footer on every page, You write them once.

```tsx
// Current page gets rendered here. `app/dashboard/layout.tsx, page.tsx
export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
```

- When navigating between sibling routes, the layout does not re-render (state is preserved). Only the child page changes.
- Layouts nest automatically.

```md
<!-- The dashboard page have the parent layout.tsx  -->

app/
--- layout.tsx
--- dashboard
----- page.tsx
```

- Every root layout (app/layout.tsx) must contain <html> and <body> tags. Next.js will throw an error if they are missing.

### Why use layout?

- Shared UI
- Persistent UI
- Doesn't re-render during navigation

## `page.tsx` (The Content)

- Represents the UI of a route.
- The actual page users visit.
- Fits inside the layout of its own folder, which is inside the layout of the parent folder.
- A folder without a `page.tsx` is just a category folder, it cannot be accessed via a URL.

## `loading.tsx` (The UX Enhancer)

- Shows a loading skeleton or spinner while the page.tsx (or data fetching) is loading.
- Wraps the page.tsx of its own folder and all child routes below it.
- No need to manually write `if (loading)`
- Navbar and sidebar remain visible, Only page content shows loading.

> It uses React Suspense under the hood. If a nested child folder does not have its own loading.tsx, it will bubble up and use the parent's loading.tsx.

### Why use `loading.tsx`?

- Better UX while server components/data are loading.

## `error.tsx` (The Safety Net)

- Catches runtime errors in the component tree and shows a fallback UI instead of crashing the whole app
- It wraps everything below the layout. An error.tsx cannot catch errors thrown in a layout.tsx of the same folder. To catch layout errors, the error.tsx must be placed in the parent folder.
- Must be a Client Component ("use client" at the top). It provides a reset() function to let users try reloading the broken section without refreshing the entire page

```tsx
"use client";

export default function Error({ error, reset }) {
  return (
    <>
      Something went wrong.
      <button onClick={reset}>Retry</button>
    </>
  );
}
```

### Why client component?

- Button click
- reset()
- Event handlers
