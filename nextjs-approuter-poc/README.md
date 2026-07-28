# Next.js App Router PoC

Project stack:

- Next.js (v16) - App Router
- TypeScript
- Biome
- Tailwind CSS

Find each sections concepts at `/docs` folder.

## Intro

- Next.js App Router is a modern file-system based routing mechanism built on top of React Server Components.
- Inside the `app/` folder, each folder represent as a route segment.

Example: `src/app/dashboard` -> in route `/dashboard`

## Routing Architecture & File System

- [x] `page.tsx`, `layout.tsx`, `loading.tsx` and `error.tsx` inlcuding nested behaviour
- [ ] Layouts vs Templates - Behaviour, Lifecycles, State Persistent
- [ ] Dynamic Routing - `[...slug]` vs `[[...slug]]`
- [ ] Route Grouping - Example `(dashboard)`, `(marketing)`
- [ ] Advanced Routing Patches - Parallel Routes `@folder` for dashboard split views, Intercepting Routes `(.)folder` for modals

## Server vs. Client Components (RSC Architecture)

- [ ] `app/` - server by default
- [ ] `use client`, `use server`
- [ ] Pass server-component / props to client-component as children.
- [ ] Network boundary - Data serialization across the server-to-client bridge.

## Data Fetching & Caching Strategies

- [ ] Use of `async/await` in Server component
- [ ] Rendering methods - `SSG`, `SSR` and `ISR` with `fetch` API
- [ ] Next.js cache - 4 caching mechanisms - `Request Memoization`, `Data Cache`, `Full Route Cache`, and `Router Cache`.
- [ ] Revalidation - time-based revalidation vs tag-based/path-based on-demand revalidation - `revalidateTag`, `revalidatePath`

## Mutations & Server Actions

- [ ] `use server` - backend logic straight from forms or client events.
- [ ] `useActionState`, `useFormStatus`, `useOptimistic`
- [ ] Implementing schema validation (e.g., Zod) inside Server Actions to securely handle untrusted input.

## Optimizations & Core Core Configs

- [ ] Built-in components - `<Image />`, `<Link />` and other important ones.
- [ ] Static Metadata - Using static objects versus generating dynamic SEO payloads via generateMetadata().
- [ ] Static Generation Optimization - Overriding default dynamic behaviors using generateStaticParams() to pre-render dynamic routes at build time
