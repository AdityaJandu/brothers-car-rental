# Brothers Car Rental 🚗

A premium, modern web application for luxury vehicle rentals built with Next.js, tRPC, Drizzle ORM, and Tailwind CSS. The platform natively provides an elegant client-facing booking experience alongside a comprehensive administrative dashboard for precise fleet management.

---

## 🛠 Tech Stack

* **Framework**: Next.js 16 (App Router, Server Components, React 19)
* **Database**: PostgreSQL (Supabase, transaction-mode pooler)
* **ORM**: Drizzle ORM (with optimized connection pooling: `max: 10`, `prepare: false`, strict ACID transaction blocks, and advanced aliased relational SQL joins)
* **API/RPC Architecture**: tRPC (tiered procedures: `protectedProcedure` for reads, `rateLimitedProtectedProcedure` for mutations, `adminProcedure` for admin reads)
* **Authentication**: Better Auth (Email/Password & Google OAuth), with **React `cache()`-based session deduplication** across server components
* **Rate Limiting**: Upstash Redis (multi-layered: auth edge middleware, tRPC mutations, domain-specific)
* **Caching**: Upstash Redis (read-through edge caching with deterministic tRPC invalidation pipelines)
* **Storage**: Supabase Storage
* **Background Jobs**: Inngest (durable workflows for booking lifecycle automation)
* **Transactional Email**: Resend (modular email layer with booking confirmation, status change, reminder, and expiry notifications)
* **Document Generation**: `@react-pdf/renderer` (Declarative, client-side PDF generation shielded via SSR hydration boundaries)
* **UI Components**: Custom tailored Shadcn UI (Radix UI primitives)
* **Styling**: Tailwind CSS 4
* **Validation**: Zod 4 & React Hook Form (dual-schema pattern for type-safe client/server validation)
* **URL State**: nuqs (type-safe URL search parameter management)
* **IDs**: nanoid (collision-resistant unique ID generation for all database records)

## ✨ Core Features

* **Public Fleet Discovery**: Beautifully mapped grid designs, dynamic filtering, rich specification pages, and **real-time availability indicators** (Available Now / Next available from [date]) on each car's detail page. SEO-optimized for priority locations like Dehradun, Hisar, and Sirsa.
* **Booking Conflict Engine**: Production-grade overlap detection preventing double bookings. Uses the standard overlap formula (`newStart < existingEnd AND newEnd > existingStart`) enforced at both the tRPC mutation level (atomic conflict check before insert) and the UI level (DatePicker disables blocked dates, availability banners show status with next-available-date hints). Blocks both `confirmed` and `pending` bookings to eliminate race conditions. Backed by a composite `(carId, startDate, endDate)` database index.
* **Secure Booking Engine**: A seamless transactional checkout flow with a dual-schema architecture — `bookingInsertSchema` (server, `z.coerce.date` + `.refine()`) and `bookingFormSchema` (client, `z.date()`) — ensuring full Zod 4 + react-hook-form type safety without `as any` casts. Features a visual multi-step `BookingStepper` (Location → Car → Details → Payment → Confirm).
* **Enterprise Audit Logging & ACID Transactions**: Critical system updates (like booking state machine transitions and physical hub alterations) are strictly wrapped in Drizzle database transactions to guarantee atomic execution and prevent data corruption. An immutable `audit_log` system acts as a system black-box, automatically capturing the exact delta (`previousValue` and `newValue`) of high-stakes admin actions to ensure full accountability and rapid dispute resolution.
* **Audit Log Viewer**: A dedicated admin page (`/audit-log`) providing full visibility into the audit trail with client-side search and filtering by action type and target entity. Features action-specific icon badges, admin identity resolution via user table joins, and a side-by-side JSON diff dialog for inspecting exact state changes.
* **Customer Booking Dashboard**: Comprehensive tracking of historical and active reservations, featuring polished breakdown views for individual bookings, interactive action controls, and **instant, browser-generated PDF invoice downloads**. Includes `getActiveOrUpcomingBooking` for real-time profile dashboard integration.
* **Client-Side PDF Invoices**: High-quality, dynamically styled booking receipts generated purely on the client-side using React-PDF, safely wrapped in Next.js `useEffect` hydration boundaries to completely eliminate server-side rendering build errors.
* **Modular Communication Layer (Inngest + Resend)**: Automated booking lifecycle emails powered by scaled, decoupled Inngest durable workflows alongside a segmented Resend transactional email service. A single `booking/created` event triggers 3 parallel workflows (Confirmation, 15-minute Expiry Timer, 24h Reminder). Admin status changes dynamically fire `booking/status.updated` events for targeted notifications. All events operate asynchronously as fire-and-forget logic, preventing database transaction timeouts.
* **Administrative Management**: High-level dashboards isolating active rentals, confirming requests, and parsing incoming fleet additions directly into the database. Features fleet search filters, vehicle inventory headers, and fleet list views.
* **Cloud Image Uploading**: Seamless fleet-asset capturing securely handled client-side and dispatched directly to Supabase data buckets.
* **Multi-Layered Rate Limiting**: IP-based auth rate limiting at the edge middleware (`rate-middleware.ts`), per-user tRPC rate limiting (30 req/min) via `rateLimitedProtectedProcedure` on **mutations only**, and stricter domain-specific limits (e.g., 5 bookings/min) for critical mutations. Read queries use `protectedProcedure` (auth-only) to avoid unnecessary Redis overhead.
* **Admin-Managed Physical Hubs**: Administrators manage secure, fixed pickup hubs for fleet distribution, enabling controlled car deployment and location-based search.
* **User Profile Management**: Full profile editing with phone number and driving license persistence, plus an active/upcoming booking card on the profile dashboard.
* **Informational Pages Module**: Complete `info` module providing an SEO-optimized Blog (featuring 25+ comprehensive articles covering car rental guides, tips, and road trip itineraries), About, Contact (with form + info components), Support, Terms of Service, Privacy Policy, and a custom 404 Not Found page. All informational routes are **statically generated** (`force-static`) at build time for optimal performance.
* **SEO & Sitemaps**: Fully dynamic and parallelized sitemap generation (`sitemap.ts`) natively merging active DB entities (cars, locations) alongside static blog posts and core routes, ensuring crawlers always access the freshest data safely via `try/catch` fallbacks.
* **Optimized Design**: Custom responsive aesthetic adhering tightly to modern curved (`rounded-md` clamped bounds) and drop-shadow architectures.
* **Robust Code Quality & Type Safety**: Replaced unsafe type bindings with direct Drizzle schema derivations (`$inferSelect`), standardizing shared Zod schemas (e.g., `paginationInputSchema`), and rigorously eliminating null-unsafety in tRPC operations. Explicit extraction of full administrative context into the immutable audit trails prevents silent logging failures. Environment bindings leverage fail-fast assertions to protect edge setups.

## ⚡ Performance Architecture

The application employs several performance optimizations to minimize page load times:

* **Cached Session Deduplication**: A centralized `cached-session.ts` utility wraps `auth.api.getSession()` in React's `cache()`, ensuring the auth DB is hit **at most once per server request**. **Every server-side page and component** (all admin pages, user pages, auth pages, Header, AuthButtons, CTASection, and tRPC middleware) uses this utility — zero direct `auth.api.getSession()` calls remain in application code.
* **Tiered tRPC Procedures**: Read-only queries (`getAll`, `getOne`) use `protectedProcedure` (auth check only), admin reads use `adminProcedure` (auth + role check), while mutations (`create`, `update`) use `rateLimitedProtectedProcedure` (auth + Redis rate limit). This eliminates ~100-200ms of Redis HTTP overhead per read query.
* **Parallelized Server Prefetch**: All protected pages with data prefetching run auth checks and queries concurrently via `Promise.all`, eliminating sequential waterfall delays. This pattern is applied across all admin (`dashboard`, `admin-booking`, `admin-booking/[id]`, `admin-locations`, `audit-log`), user (`browse`, `browse/[id]`, `check-out/[id]`, `bookings`, `profile`), and onboarding routes.
* **Server-Side Hydration**: The onboarding landing page prefetches fleet data server-side and wraps the view in a `HydrationBoundary`, so the `FeaturedFleet` client component receives data instantly without a client→server roundtrip.
* **Relational Prop Drilling**: Heavy detail pages (like `BookingIdView`) use a single optimized Drizzle endpoint to pull deep relational mappings (e.g., Bookings + Nested Cars + Aliased Hub Locations) and distribute them down to presentational child components natively via React Props, effectively eradicating cascading loading spinners and redundant API requests.
* **Connection Pooling**: The Postgres client is configured with `prepare: false` (required for Supabase's transaction-mode pooler), proper pool sizing, and timeout settings to eliminate cold-connection overhead.
* **tRPC Redis Data Caching**: Employs an explicit `@upstash/redis` wrapper (`redis-cache.ts`) injecting generic deterministic read-through caching patterns into highly trafficked `protectedProcedure` handlers (like user `browse` and `bookings`). Bypasses redundant PostgreSQL queries natively mapping exact validation boundaries into edge memory with full automatic prefix invalidation running dynamically during corresponding transactional mutations. Designed symmetrically with strict security perimeters: bound cache key entropy limits prevent memory flooding, trailing colons prevent user-ID cache clearance collisions, and namespace extractors help reduce session PII exposure in logs and should be audited for completeness.

## 🚀 Getting Started

First, ensure you have the required environment variables (`neon db string`, `auth secrets`, `supabase url` & `supabase anon key`, `upstash redis url` & `token`, `resend api key`, `admin email`) properly mapped inside your local `.env`.

### 1. Install Dependencies
```bash
npm install
````

### 2\. Prepare the Database

Push the local schema tracking parameters explicitly down to the remote PostgreSQL datastore organically:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
# or
npx drizzle-kit push
```

### 3\. Run the Development Server

```bash
npm run dev
```

### 4\. Run Background Jobs (Optional)

```bash
npm run inngest:dev
```

### 5\. Flush Redis Cache (Optional)

```bash
npm run flush:redis
```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience the application dynamically.

## 🗺️ Project Structure

The codebase is built on a highly modular **Domain-Driven Architecture**:

  * `/src/app/` - The Next.js routing structure dynamically wrapping `(auth)`, `(onboarding)`, `(user)`, and `(admin)` zones. Protected pages use `Promise.all` for parallelized auth + data prefetch. Also contains a root `not-found.tsx` for global 404 handling and a dynamic `sitemap.ts` for automated SEO indexing.
  * `/src/modules/` - The beating heart of the system storing all explicitly modular UI/Server pairs (`user/profile`, `admin/dashboard`, `user/check-out`, `user/browse`, etc.). Complex views are decomposed into focused sub-components within their module's `ui/components/` directory. Includes the `info/` module for all informational pages (Blog, About, Contact, Support, Legal, Not Found) with shared reusable components (`InfoPageHeader`, `InfoSection`).
  * `/src/components/` - Shadcn UI layouts clamped universally safely beneath custom layout wrapping. Includes `self/` for custom reusable components (`data-table`, `data-pagination`, `loading-state`, `error-state`, `empty-state`, `form-field`, `generated-avatar`, `command-select`).
  * `/src/db/` - Drizzle ORM database bindings with optimized connection pooling mapped to Supabase Postgres. Schema includes `user`, `session`, `account`, `verification`, `car`, `booking`, `location`, and `audit_log` tables with comprehensive indexes.
  * `/src/lib/` - Core utilities including `cached-session.ts` (React `cache()`-based auth deduplication), rate limiters, auth configs, `emails/` (modular transactional email layer), and `redis-cache.ts` (read-through caching).
  * `/src/inngest/` - Inngest durable workflow functions for automated booking lifecycle management.
  * `/src/trpc/` - tRPC initialization, procedure tiers, central router, React-Query provider, and RSC hydration pipeline.
  * `/src/hooks/` - Global React hooks (e.g., `use-mobile.ts` for responsive breakpoint detection).
  * `/src/constants.ts` - Shared constants and Zod schemas (e.g., `paginationInputSchema`).
  * `/src/rate-middleware.ts` - Edge middleware for IP-based auth endpoint rate limiting.
  * `/scripts/` - Utility scripts (e.g., `redis-cache-flush.ts` for cache management).

*For an extreme deep-dive directly into the exact query hooks, `procedures.ts` tracking variables, and our native React-PDF implementations tied physically across each folder logic node, please refer to the `projectstructure.md` file\!*

## 👮‍♂️ Admin Operations

To interact dynamically with the admin endpoints (`/dashboard`, `/add-car`, `/admin-booking`, `/admin-locations`, `/audit-log`), you must alter your authenticated user session role manually to `admin` directly within the Postgres database via your active Supabase/Neon dashboard. All high-stakes admin modifications are safely recorded in the `audit_log` system and can be reviewed at `/audit-log`.
