<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Brothers Car Rental — AI Agent Instructions

## Architecture

- **Domain-Driven Design**: All features live in `src/modules/{domain}/{feature}/` with `server/procedures.ts` (tRPC) + `ui/views/` + `ui/components/`.
- **App Router**: Routes in `src/app/` with `(onboarding)`, `(auth)`, `(user)`, `(admin)` route groups. Always use `Promise.all` for parallel auth + data prefetching in server pages.
- **Info Module**: Static informational pages (About, Contact, Support, Legal, NotFound) in `src/modules/info/` with shared `InfoPageHeader` and `InfoSection` components.

## Critical Patterns

### Session Handling
- **ALWAYS** use `getSession()` from `@/lib/cached-session` — NEVER call `auth.api.getSession()` directly.
- The cached-session wrapper uses React `cache()` to deduplicate auth DB calls per request.

### tRPC Procedure Tiers
- `baseProcedure`: No auth, used for public data (e.g., `getActiveLocations`).
- `protectedProcedure`: Auth check only. Use for **all read queries** and simple profile mutations.
- `adminProcedure`: Auth + admin role enforcement. Use for admin read queries.
- `rateLimitedProtectedProcedure`: Auth + Redis 30 req/min. Use for **mutations only** (booking creation, admin ops).

### Database
- **ORM**: Drizzle ORM with PostgreSQL (Supabase).
- **Connection**: `prepare: false` is required for Supabase transaction-mode pooler.
- **IDs**: Use `nanoid()` for all record IDs (not UUID).
- **Transactions**: Wrap multi-table mutations in `db.transaction()` with audit logging.

### Validation
- **Dual-schema pattern**: `insertSchema` (server, `z.coerce.date`) and `formSchema` (client, `z.date`) for Zod 4 + react-hook-form compatibility.
- Use `paginationInputSchema` from `@/constants` for paginated queries.

### Background Jobs
- Use Inngest durable workflows in `src/inngest/functions/`.
- Register new functions in `src/inngest/index.ts`.
- Fire events as fire-and-forget AFTER database transactions complete.

### Caching
- Redis read-through caching via `@/lib/redis-cache` for high-traffic queries.
- Invalidate caches in mutation procedures using `invalidateCacheGroup()`.

### Components
- Use `src/components/self/` for reusable components (`data-table`, `loading-state`, `error-state`, `empty-state`, `form-field`, `generated-avatar`, `command-select`).
- Use `src/components/ui/` for Shadcn UI primitives.

### Styling
- Tailwind CSS 4. Use `rounded-md` as the standard border radius.
- Use `bg-linear-to-r` (not `bg-gradient-to-r`), `shrink-0` (not `flex-shrink-0`).

## File Structure Convention

```
src/modules/{domain}/{feature}/
├── server/procedures.ts    # tRPC router
├── ui/views/*.tsx          # Page composition roots
├── ui/components/*.tsx     # Presentational components
├── schemas.ts              # Zod validation (optional)
├── hooks/*.tsx             # Client hooks (optional)
├── params.ts               # nuqs URL params (optional)
└── types.ts                # TypeScript types (optional)
```

## Environment Variables

Required: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `RESEND_API_KEY`, `ADMIN_EMAIL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.
