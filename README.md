# Brothers Car Rental 🚗

A premium, modern web application for luxury vehicle rentals built with Next.js, tRPC, Drizzle ORM, and Tailwind CSS. The platform natively provides an elegant client-facing booking experience alongside a comprehensive administrative dashboard for precise fleet management.

---

## 🛠 Tech Stack

* **Framework**: Next.js (App Router, Server Components)
* **Database**: PostgreSQL (Supabase, transaction-mode pooler)
* **ORM**: Drizzle ORM (with optimized connection pooling: `max: 10`, `prepare: false`)
* **API/RPC Architecture**: tRPC (tiered procedures: `protectedProcedure` for reads, `rateLimitedProtectedProcedure` for mutations)
* **Authentication**: Better Auth (Email/Password & Google OAuth), with **React `cache()`-based session deduplication** across server components
* **Rate Limiting**: Upstash Redis (multi-layered: auth, tRPC mutations, domain-specific)
* **Caching**: Upstash Redis (read-through edge caching with deterministic tRPC invalidation pipelines)
* **Storage**: Supabase Storage
* **Document Generation**: `@react-pdf/renderer` (Declarative, client-side PDF generation)
* **UI Components**: Custom tailored Shadcn UI
* **Styling**: Tailwind CSS
* **Validation**: Zod 4 & React Hook Form (dual-schema pattern for type-safe client/server validation)

## ✨ Core Features

* **Public Fleet Discovery**: Beautifully mapped grid designs, dynamic filtering, rich specification pages, and **real-time availability indicators** (Available Now / Next available from [date]) on each car's detail page.
* **Booking Conflict Engine**: Production-grade overlap detection preventing double bookings. Uses the standard overlap formula (`newStart < existingEnd AND newEnd > existingStart`) enforced at both the tRPC mutation level (atomic conflict check before insert) and the UI level (DatePicker disables blocked dates, availability banners show status with next-available-date hints). Blocks both `confirmed` and `pending` bookings to eliminate race conditions. Backed by a composite `(carId, startDate, endDate)` database index.
* **Secure Booking Engine**: A seamless transactional checkout flow with a dual-schema architecture — `bookingInsertSchema` (server, `z.coerce.date` + `.refine()`) and `bookingFormSchema` (client, `z.date()`) — ensuring full Zod 4 + react-hook-form type safety without `as any` casts.
* **Customer Booking Dashboard**: Comprehensive tracking of historical and active reservations, featuring polished breakdown views for individual bookings, interactive action controls, and **instant, browser-generated PDF invoice downloads**.
* **Client-Side PDF Invoices**: High-quality, dynamically styled booking receipts generated purely on the client-side using React-PDF, completely eliminating server overhead for document creation.
* **Communication Layer (Inngest + Resend)**: Automated booking lifecycle emails powered by Inngest durable workflows and Resend transactional email. A single `booking/created` event triggers 3 parallel workflows: instant confirmation email, 15-minute pending expiry timer, and 24h pickup reminder (with sleepUntil + exactly-once guarantees). Admin status changes fire `booking/status.updated` events for real-time customer + admin notifications. All Inngest events are fire-and-forget — never block mutation responses.
* **Administrative Management**: High-level dashboards isolating active rentals, confirming requests, and parsing incoming fleet additions directly into the database.
* **Cloud Image Uploading**: Seamless fleet-asset capturing securely handled client-side and dispatched directly to Supabase data buckets.
* **Multi-Layered Rate Limiting**: IP-based auth rate limiting at the edge middleware, per-user tRPC rate limiting (30 req/min) via `rateLimitedProtectedProcedure` on **mutations only**, and stricter domain-specific limits (e.g., 5 bookings/min) for critical mutations. Read queries use `protectedProcedure` (auth-only) to avoid unnecessary Redis overhead.
* **Optimized Design**: Custom responsive aesthetic adhering tightly to modern curved (`rounded-md` clamped bounds) and drop-shadow architectures.

## ⚡ Performance Architecture

The application employs several performance optimizations to minimize page load times:

* **Cached Session Deduplication**: A centralized `cached-session.ts` utility wraps `auth.api.getSession()` in React's `cache()`, ensuring the auth DB is hit **at most once per server request**. **Every server-side page and component** (all admin pages, user pages, auth pages, Header, AuthButtons, CTASection, and tRPC middleware) uses this utility — zero direct `auth.api.getSession()` calls remain in application code.
* **Tiered tRPC Procedures**: Read-only queries (`getAll`, `getOne`) use `protectedProcedure` (auth check only), while mutations (`create`, `update`) use `rateLimitedProtectedProcedure` (auth + Redis rate limit). This eliminates ~100-200ms of Redis HTTP overhead per read query.
* **Parallelized Server Prefetch**: All protected pages with data prefetching run auth checks and queries concurrently via `Promise.all`, eliminating sequential waterfall delays. This pattern is applied across all admin (`dashboard`, `admin-booking`, `admin-booking/[id]`), user (`browse`, `browse/[id]`, `check-out/[id]`, `bookings`, `profile`), and onboarding routes.
* **Server-Side Hydration**: The onboarding landing page prefetches fleet data server-side and wraps the view in a `HydrationBoundary`, so the `FeaturedFleet` client component receives data instantly without a client→server roundtrip.
* **Connection Pooling**: The Postgres client is configured with `prepare: false` (required for Supabase's transaction-mode pooler), proper pool sizing, and timeout settings to eliminate cold-connection overhead.
* **tRPC Redis Data Caching**: Employs an explicit `@upstash/redis` wrapper (`redis-cache.ts`) injecting generic deterministic read-through caching patterns into highly trafficked `protectedProcedure` handlers (like user `browse` and `bookings`). Bypasses redundant PostgreSQL queries natively mapping exact validation boundaries into edge memory with full automatic prefix invalidation running dynamically during corresponding transactional mutations. Designed symmetrically with strict security perimeters: bound cache key entropy limits prevent memory flooding, trailing colons prevent user-ID cache clearance collisions, and namespace extractors help reduce session PII exposure in logs and should be audited for completeness.

## 🚀 Getting Started

First, ensure you have the required environment variables (`neon db string`, `auth secrets`, `supabase url` & `supabase anon key`) properly mapped inside your local `.env`.

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

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to experience the application dynamically.

## 🗺️ Project Structure

The codebase is built on a highly modular **Domain-Driven Architecture**:

  * `/src/app/` - The Next.js routing structure dynamically wrapping `(auth)`, `(onboarding)`, `(user)`, and `(admin)` zones. Protected pages use `Promise.all` for parallelized auth + data prefetch.
  * `/src/modules/` - The beating heart of the system storing all explicitly modular UI/Server pairs (`user/profile`, `admin/dashboard`, `user/check-out`, `user/browse`, etc.). Complex views are decomposed into focused sub-components within their module's `ui/components/` directory (e.g., `admin/add-car` splits into `AddCarHeader`, `GeneralInfoCard`, `SpecificationsCard`, `MediaGalleryCard`, and `StatusSidebarCard`).
  * `/src/components/` - Shadcn UI layouts clamped universally safely beneath custom layout wrapping.
  * `/src/db/` - Drizzle ORM database bindings with optimized connection pooling mapped to Supabase Postgres.
  * `/src/lib/` - Core utilities including `cached-session.ts` (React `cache()`-based auth deduplication), rate limiters, and auth configs.

*For an extreme deep-dive directly into the exact query hooks, `procedures.ts` tracking variables, and our native React-PDF implementations tied physically across each folder logic node, please refer to the `projectstructure.md` file\!*

## 👮‍♂️ Admin Operations

To interact dynamically with the admin endpoints (`/dashboard`, `/add-car`, `/admin-booking`), you must alter your authenticated user session role manually to `admin` directly within the Postgres database via the active neon dashboard.
