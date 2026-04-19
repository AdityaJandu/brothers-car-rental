# Brothers Car Rental - Project Structure & Architecture

This document provides a comprehensive breakdown of the application's entire codebase structure. It details the purpose of each file and folder, with a specific focus on the tRPC backend modules (`procedures.ts`), the Redis Edge Caching architecture, and their available operations.

-----

<br>

## 📁 `src/app/` (Next.js App Router)

The `app` directory utilizes Next.js routing groups to enforce layout boundaries and authentication perimeters naturally.

<br>

### 🔐 Admin Routes (`(admin)`)

*Accessible only by authorized administrators.*

  * `layout.tsx`: Wraps admin pages with the `AdminHeaderNavBar`.
  * `dashboard/page.tsx`: Main admin dashboard showing vehicle fleet and system metrics. **Uses `Promise.all` to parallelize cached auth check + fleet data prefetch.**
  * `add-car/page.tsx`: The form dedicated to parsing and inserting new vehicles into the database. **Uses cached session for admin auth guard.**
  * `admin-booking/page.tsx`: Table view interface listing all global customer bookings. **Uses `Promise.all` to parallelize cached auth + bookings prefetch.**
  * `admin-booking/[bookingId]/page.tsx`: Dedicated management view for reviewing/updating a specific booking. **Uses `Promise.all` to parallelize cached auth + booking detail prefetch.**
  * `audit-log/page.tsx`: Read-only administrative audit trail viewer displaying all system-wide admin actions with search and filtering. **Uses `Promise.all` to parallelize cached auth + audit log prefetch.** Exports SEO metadata.

<br>

### 👤 User/Customer Routes (`(user)`)

*Publicly accessible or customer-specific endpoints.*

  * `layout.tsx`: Wraps user pages with the global header/footer navigation.
  * `profile/page.tsx`: Isolated user portal displaying `tRPC` active secure user variables, profile states, and interactive security constraints directly using Suspense bridges. **Uses `Promise.all` for parallel cached auth + profile data prefetch.**
  * `browse/page.tsx`: The main Fleet Gallery allowing users to filter and view available cars. **Uses `Promise.all` to run cached auth check and data prefetch in parallel.**
  * `browse/[carId]/page.tsx`: Detailed specification page for a single vehicle. **Uses `Promise.all` to parallelize cached auth + car detail prefetch.**
  * `check-out/[carId]/page.tsx`: The multi-step booking checkout form. **Uses `Promise.all` to parallelize auth + car data prefetch**, eliminating sequential waterfall delays.
  * `bookings/page.tsx`: Display of the authenticated user's internal booking history. **Uses `Promise.all` for parallel auth + booking prefetch.**
  * `bookings/[bookingId]/page.tsx`: Detailed breakdown and summary for a specific user booking.

<br>

### 👋 Onboarding & Auth (`(onboarding)`, `(auth)`)

  * `(onboarding)/page.tsx` & `layout.tsx`: The primary landing page featuring rich SEO marketing, hero sections, and CTA funnels. **Server-side prefetches `FeaturedFleet` data and wraps the view in a `HydrationBoundary`**, eliminating a full client→server roundtrip for the fleet carousel.
  * `(auth)/sign-in/page.tsx`: Login gateway UI. **Uses cached session to redirect already-authenticated users.**
  * `(auth)/sign-up/page.tsx`: Registration gateway UI. **Uses cached session to redirect already-authenticated users.**

<br>

### 🌐 API Routes (`api/`)

  * `api/auth/[...all]/route.ts`: Better-Auth catch-all handler for authentication orchestration.
  * `api/trpc/[trpc]/route.ts`: tRPC catch-all endpoint that routes all client mutations/queries into the backend logic.
  * `api/inngest/route.ts`: **Inngest serve handler** — registers all 4 workflow functions (`send-confirmation-email`, `expire-pending-booking`, `send-booking-reminder`, `send-status-change-email`) and exposes `GET`/`POST`/`PUT` for the Inngest Dev Server and cloud to discover and invoke functions.

-----

<br>

## 📁 `src/modules/` (Domain-Driven Architecture)

The application is logically decoupled into independent, self-contained business domains. This is where the core logic, UI views, schemas, and tRPC backend procedures live.

<br>

### 📍 `admin/locations`

Admin-tier management of all physical rental hub deployment locations.

  * **`server/procedures.ts`**:
      * `getAll` **(Query)**: Pulls all internal locations. Resolves native cache hits globally. Uses `protectedProcedure` (auth-only) for read speed.
      * `create` **(Mutation)**: Strict schema mapping for deploying physical location hubs. Uses `protectedProcedure` with immediate wildcard cache bursting (`invalidateCacheGroup("locations")`).
      * `update` **(Mutation)**: Updates existing hub data and active states securely. **Wrapped in a strict ACID transaction**, generating an explicit JSON delta (`previousValue` vs `newValue`) stored directly in the `audit_log` table before triggering edge invalidation organically.
  * `ui/views/AdminLocationsView.tsx`: Core map handling DataTables rendering structural states.
  * `ui/components/`:
      * `location-columns.tsx`: Data definition logic.
      * `LocationFormDialog.tsx`: Inline Radix-UI popup for modifying nodes seamlessly.

<br>

### 🚗 `admin/add-car`

Handles appending new car assets to the system.

  * **`server/procedures.ts`**:
      * `create` **(Mutation)**: Inserts a strictly validated payload mapped to the `carInsertSchema` into the Postgres database natively.
  * `ui/views/AddCarView.tsx`: Composition root managing form state, image upload handlers, and tRPC mutation logic. Delegates all rendering to modular sub-components below.
  * `ui/components/`: Modular presentation components decomposed from the monolithic view:
      * `AddCarHeader.tsx`: Page header with car icon badge, title/subtitle, and action buttons (Cancel / Add Vehicle) with enhanced hover states.
      * `GeneralInfoCard.tsx`: Card capturing vehicle identity fields (name, make, model, year, price, plate, category, tier) with colored section icons and uppercase tracking labels.
      * `SpecificationsCard.tsx`: Card for seats, transmission, and fuel type fields with amber-tinted section icon and consistent input styling.
      * `MediaGalleryCard.tsx`: Image upload drop-zone with animated icon, gallery grid with gradient hover overlays, main-image selection via ring-offset highlights, and empty-state placeholder.
      * `StatusSidebarCard.tsx`: Right sidebar containing Asset Status (with color-coded status dots) and Description textarea, each in their own styled card.

<br>

### 📊 `admin/dashboard`

Handles fetching and sorting global fleet metrics.

  * **`server/procedures.ts`**:
      * `getAllAdmin` **(Query)**: Pulls paginated, sorted vehicle objects bypassing customer filters mapping raw datastores to the dashboard metrics. Uses `protectedProcedure` (auth-only, no rate limit) for optimized read performance.
  * `ui/views/FleetClientView.tsx`: The primary analytical dashboard component rendering fleet states.
  * `ui/components/car-columns.tsx` & `VehicleInventoryHeader.tsx`: UI chunks for presenting grid layout and table data mapping.
  * `schemas.ts`: Core validation mapping rules dictating the shape of DB inputs/outputs.
  * `hooks/user-car-filters.tsx` / `params.ts` / `types.ts`: Local state management logic.

<br>

### 📅 `admin/bookings`

Admin-tier management of all internal customer rental requests.

  * **`server/procedures.ts`**:
      * `getAllAdmin` **(Query)**: Pulls all globally tracked bookings across all users. Uses `protectedProcedure` (auth-only, no rate limit) for optimized read performance.
      * `getOneAdmin` **(Query)**: Leverages a `leftJoin` to fetch a singular booking alongside its heavily associated `car` specifications for deep review. Uses `protectedProcedure` (auth-only, no rate limit).
      * `updateOneAdmin` **(Mutation)**: Validated state machine transition bridging enum values (e.g. `pending` -> `confirmed`). **Wrapped in an ACID transaction to guarantee atomic execution** alongside an immutable `audit_log` insertion capturing the status delta. Uses `rateLimitedProtectedProcedure` (auth + Redis rate limit). **After successful commit, fires `booking/status.updated` Inngest event** (fire-and-forget) to trigger status change email notifications to customer + admin.
  * `ui/views/AdminBookingView.tsx`, `AdminBookingIdView.tsx`: Parent container map for resolving booking endpoints.
  * `ui/components/admin-booking-rental-info.tsx`, `admin-booking-pricing-info.tsx`, `admin-booking-customer-info.tsx`: Presentation widgets displaying structured relational db output.

<br>

### 📋 `admin/audit-log`

Read-only administrative interface for viewing the complete audit trail of all high-stakes system changes.

  * **`server/procedures.ts`**:
      * `getAllAuditLogs` **(Query)**: Fetches up to 500 audit log entries ordered by recency. Uses `adminProcedure` (admin-only auth via middleware). Performs a `leftJoin` on the `user` table to resolve admin identity (`name`, `email`) from the foreign key. Safely parses `previousValue`/`newValue` JSON text columns into proper objects server-side to prevent double-serialization on the client.
  * `ui/views/AuditLogView.tsx`: Page composition root integrating the header, client-side filters, and DataTable. Uses `useMemo`-based filtering across action type, target type, and free-text search.
  * `ui/components/`:
      * `audit-columns.tsx`: TanStack Table column definitions with action-specific icon badges (via `getActionMeta()`), admin avatar initials, and an enhanced "View Delta" dialog with metadata banner and syntax-colored JSON display.
      * `AuditHeader.tsx`: Page header with `ShieldAlert` icon badge, title/subtitle, and summary stat chips (total entries, latest entry timestamp).
      * `AuditFilters.tsx`: Inline filter bar with text search input and dropdown selectors for action type and target type. All filtering is client-side.

<br>

### 🛍️ `user/browse` & `user/car-id-view`

Publicly facing gallery modules for vehicle discovery.

  * **`user/browse/server/procedures.ts`**:
      * `getAll` **(Query)**: Pulls active, publicly available vehicles securely paginated and filtered by the user UI (Date, Range, Transmission). Uses `protectedProcedure` (auth-only, no rate limit) for optimized read performance.
      * `getOne` **(Query)**: Pulls explicitly defined attributes for a single car entity. Uses `protectedProcedure` (auth-only, no rate limit).
  * `user/browse/ui/views/BrowseView.tsx`: The core gallery layout wrapper component.
  * `user/browse/ui/components/CarCard.tsx`, `CarGrid.tsx`, `DatePicker.tsx`, `FiltersBar.tsx`: Modular presentation layer components building the responsive filtering logic natively. **`DatePicker.tsx` accepts `Matcher | Matcher[]` for its `disabled` prop**, enabling unavailable date range blocking from the checkout page.
  * `user/car-id-view/ui/views/CarIdView.tsx` & components (`ImageSlider.tsx`, `Spec.tsx`, `PricingCard.tsx` etc.): Granular rendering block for a single vehicle page layout. **`PricingCard.tsx` fetches unavailable dates and shows a real-time availability indicator** (Available Now / Next available from [date]).

<br>

### 💳 `user/check-out`

Transactional engine powering the reservation logic.

  * **`server/availability.ts`**: **Booking Conflict Engine** utility module containing:
      * `checkBookingConflict(carId, startDate, endDate)` — Queries for overlapping `confirmed`/`pending` bookings using the standard overlap formula (`newStart < existingEnd AND newEnd > existingStart`). Uses the composite `booking_car_dates_idx` index for performance.
      * `getUnavailableDateRanges(carId)` — Returns all blocked date ranges (future `confirmed`/`pending` bookings) for frontend DatePicker disabling.
  * **`server/procedures.ts`**:
      * `getUnavailableDates` **(Query)**: Returns blocked date ranges for a car. Uses `protectedProcedure` (auth-only, no rate limit).
      * `create` **(Mutation)**: Calls `createBookingWithConflictCheck()` for **atomic conflict detection** inside a database transaction with row locking. Throws `CONFLICT` if the car is unavailable. Protected by three layers: `rateLimitedProtectedProcedure` (30 req/min), inline `bookingRateLimit` (5 bookings/min), and the transactional overlap guard. **After insert, fires `booking/created` Inngest event** (fire-and-forget) triggering 3 workflows: confirmation email, pending expiry timer, and 24h pickup reminder.
  * `schemas.ts`: Dual-schema architecture for **Zod 4 + react-hook-form compatibility**:
      * `bookingInsertSchema` — **Server-side** (used by tRPC procedures). Uses `z.coerce.date()` to handle JSON string → Date coercion from the network, and a top-level `.refine()` for cross-field validation (`endDate > startDate`).
      * `bookingFormSchema` — **Client-side** (used by react-hook-form + `zodResolver`). Uses `z.date()` instead of `z.coerce.date()` (since `z.coerce` infers its input as `unknown` in Zod 4, breaking type inference), and omits top-level `.refine()` (which wraps `ZodObject` into `ZodEffects`, also breaking react-hook-form types). Field-level `.refine()` is still used.
  * `ui/views/CarBookingView.tsx`: Page wrapping logic managing form state via `useForm<z.infer<typeof bookingFormSchema>>` with properly typed `zodResolver(bookingFormSchema)`. **Fetches unavailable dates and passes them to CheckoutForm for date picker integration.**
  * `ui/components/CheckoutForm.tsx`: Client-side form with **availability-aware DatePicker** — disables all days within blocked date ranges, shows a live availability banner with next-available-date hint, and disables the submit button when dates conflict.
  * `ui/components/SummaryCard.tsx`: Dynamic pricing summary with live form state watching.

<br>

### 📜 `user/bookings`

Customer dashboard tracking standard historical reservations.

  * **`server/procedures.ts`**:
      * `getAllUser` **(Query)**: Fetches and structures booking receipts locally bound specifically to the contextual `userId` authenticated session token. Uses `protectedProcedure` (auth-only, no rate limit) for optimized read performance.
      * `getOne` **(Query)**: Fetches detailed information for a specific booking by ID. Uses `protectedProcedure` (auth-only, no rate limit).
  * `ui/views/AllBookingView.tsx` & `ui/components/booking-columns.tsx`: Frontend mapped React Tables rendering state outputs transparently.
  * `ui/views/BookingIdView.tsx`: Displays a comprehensive breakdown of a single booking.
  * `ui/components/`: Modular child components for the booking details page:
      * `BookingHeader.tsx`: Shows booking ID and status badge.
      * `BookedCarCard.tsx`: Displays the reserved vehicle's image and basic info.
      * `CustomerInfoCard.tsx`: Outlines the reserving user's credentials.
      * `PaymentSummaryCard.tsx`: Provides financial breakdown (fare, tax, total).
      * `ScheduleLocationCard.tsx`: Details pickup/drop-off dates and locations.
      * `BookingActions.tsx`: Provides action buttons for the booking. **Integrates `@react-pdf/renderer` via Next.js `next/dynamic` (`ssr: false`) to flawlessly bypass server-side hydration crashes and render heavy browser APIs safely at the edge.**
  * **`utils/BookingPdf.tsx`**: A declarative React component template built with `@react-pdf/renderer` allowing users to securely generate and download high-quality, fully styled booking invoices directly from the browser.

<br>

### 📍 `user/locations`

Public-facing static data delivery layer for the Physical Hub mappings.

  * **`server/procedures.ts`**:
      * `getActiveLocations` **(Query)**: Ultra-fast Read-Through Cache architecture exclusively serving active-only (`isActive: true`) physical hubs for general Checkout and Browse Selectors. Safely bypasses postgres transactions via Upstash `locations:all:active`. Uses `baseProcedure`.

<br>

### 👤 `user/profile`

User dashboard tracking their specific session characteristics and secure auth settings.

  * **`server/procedures.ts`**:
      * `getUser` **(Query)**: Pulls authenticated relational metadata securely via standard Drizzle equality maps against contextual session objects natively. Uses `protectedProcedure` (auth-only, no rate limit) for optimized read performance.
  * `ui/components/`: Modular presentation components safely decoupling logic blocks:
      * `ProfileHeader.tsx`: Avatar bounds, name mapping, and email verification badge layout.
      * `RewardsStatusCard.tsx` / `ActiveBookingCard.tsx`: Central grid mock data presentations resolving static aesthetic metrics natively.
      * `PersonalInfoCard.tsx` / `PaymentMethodsCard.tsx` / `SecuritySettingsCard.tsx`: Interactive dashboard fields mapping strict styling grids organically.
  * `ui/views/ProfileView.tsx`: Client-tier rendering node explicitly binding the decoupled components to React Suspense boundaries dynamically.

<br>

### 🚀 `onboarding`

The pure marketing and branding UX architecture.

  * `ui/views/OnboardingView.tsx` & `components/`: Hero sections, Call To Action bars (`CTASection.tsx`), dynamic Fleet showcases (`FeaturedFleet.tsx`), step-by-step maps (`StepComponent.tsx`). **`CTASection.tsx`, `AuthButtons.tsx`, and `FeaturedFleet.tsx` all use the cached session utility** to avoid redundant auth DB hits within the same request.
  * `data/*.ts`: Mock/Static JSON structures fueling the landing page placeholders dynamically.

<br>

### 🔑 `auth`

  * `ui/views/SignInView.tsx` & `SignUpView.tsx`: Styled NextJS Client Components natively interfacing with BetterAuth APIs including structured Error catching boundaries and seamless native Google OAuth social logins.
  * `ui/layout/AuthHeader.tsx`: Wrapper injecting context UI logic appropriately.

<br>
<br>

-----

## 📁 `src/db/` (Database & Schema Orchestration)

Drizzle ORM central mapping architecture.

  * `index.ts`: The core database connector binding Drizzle explicitly to the Supabase Postgres connection string. **Configured with connection pooling** (`max: 10`, `idle_timeout: 20`, `connect_timeout: 10`) and `prepare: false` (required for Supabase's transaction-mode pooler on port 6543) to eliminate cold-connection overhead.
  * `schema.ts`: Absolute ground truth declaring table relations (`user`, `session`, `location`, `car`, `booking`, **`audit_log`**) mapped bi-directionally alongside enum limitations natively generating SQL constraints. Component property types natively infer directly from here via `$inferSelect` to strictly prevent misalignment.
      * Includes a composite index `booking_car_dates_idx` on `(carId, startDate, endDate)` for optimized booking conflict detection. 
      * The `bookingStatusEnum` includes `"expired"` for auto-expired pending bookings.
      * Includes `auditActionEnum` for strict type-safety on system logging (e.g., `booking.confirmed`, `location.updated`) providing immutable history for high-stakes admin modifications.

<br>

-----

## 📁 `src/inngest/` (Background Job Orchestration)

Durable workflow engine powered by Inngest for automated booking lifecycle management.

  * `client.ts`: Inngest client instance (`id: "brothers-car-rental"`) used to create functions and send events.
  * `index.ts`: Central export file combining all Inngest functions for route registration.
  * `functions/`: Modularized workflow functions:
      * `send-confirmation-email.ts` — Triggered by `booking/created`. Immediately JOINs booking + user + car and sends a confirmation email to customer + admin via Resend.
      * `expire-pending-booking.ts` — Triggered by `booking/created`. Sleeps 15 minutes, then idempotently expires the booking if still `"pending"`. Sends expiry notification email independently and invalidates cache.
      * `send-booking-reminder.ts` — Triggered by `booking/created`. Calculates 24h before pickup, uses `step.sleepUntil()` to wait, checks if still `"confirmed"`. Guarantees exactly-once delivery via durable steps.
      * `send-status-change-email.ts` — Triggered by `booking/status.updated`. JOINs booking + user + car and sends a status change email sequentially to customer.

<br>
<br>

-----

## 📁 `src/trpc/` (Backend RPC Architecture)

Server-Client bridge guaranteeing purely typed data-fetching.

  * `init.ts`: The baseline core tRPC initialization creating `createTRPCRouter` alongside layered auth/rate-limit middleware (context stubs cleanly resolved out natively across standard REST headers):
      * `baseProcedure`: Raw tRPC procedure with no middleware.
      * `protectedProcedure`: Validates session via Better Auth using a **React `cache()`-wrapped session getter** that deduplicates auth DB calls within a single server request. **Used by all read-only queries** (browse, bookings) for optimal performance.
      * `rateLimitedProtectedProcedure`: Extends `protectedProcedure` with a general per-user rate limit (30 req/min via Upstash Redis). **Used only by mutations** (booking creation, admin operations) to avoid unnecessary Redis overhead on reads.
  * `routers/_app.ts`: The central router multiplexer tying `adminAddCarRouter`, `carRouter`, `bookingRouter`, `userProfile`, etc. natively back into one overarching namespace root.
  * `client.tsx`: React-Query provider wrapper enabling `trpc.module.endpoint.useQuery` natively on frontend UI code.
  * `server.tsx`: Server-side context hydration pipeline for RSC payload handling.

<br>
<br>

-----

## 📁 `src/components/` (UI Presentation Layer)

  * **`layout/`**: `AdminHeaderNavBar.tsx`, `Header.tsx`, `Footer.tsx`, `MobileNav.tsx`: Site-wide structural frames dictating routing bars correctly. `Header.tsx` uses the cached session utility (`getSession()`) to avoid redundant auth DB calls.
  * **`self/`**: Pre-built functional units tying multiple standard UI blocks together:
      * `data-table.tsx` & `data-pagination.tsx`: Reusable tanstack/react-table components natively capable.
      * `loading-state.tsx`, `error-state.tsx`, `empty-state.tsx`: Pure fallback UX templates.
  * **`ui/`**: A fully decoupled, heavily constrained customized variant of the Shadcn/UI primitive library bridging modern Radix accessibility seamlessly to perfectly generated rounded tailwind standards internally modified by project-wide scripts to explicitly adhere to the `rounded-md` curves mapping.

<br>
<br>

-----

## 📁 `src/lib/` (Utilities & Configs)

  * `auth.ts`: Better-Auth server-side configuration mapping DB constraints dynamically to logical providers.
  * `auth-client.ts`: Equivalent client SDK for managing triggers.
  * `cached-session.ts`: **Performance-critical utility** wrapping `auth.api.getSession()` in React's `cache()` function. Ensures the session is fetched **at most once per server request**, no matter how many server components (Header, page, AuthButtons, tRPC middleware) consume it. Eliminates 2-3 redundant DB roundtrips per page load.
  * `redis-cache.ts`: **Read Path Caching wrapper** around local Upstash Redis clients mapping type-secure generic `.set()`, `.get()`, and `.invalidateCacheGroup()` architecture for deterministic database-bypass rules on high-traffic tRPC read loops organically. Includes `getCacheNamespace` for explicit PII masking inside production logs.
  * `emails/`: **Modular Transactional Email Layer** powered by Resend. Try/catch wrapped to prevent API failures blocking execution.
      * `client.ts` — Initializes Resend singleton, validates essential environment variables (`RESEND_API_KEY`, `ADMIN_EMAIL`).
      * `templates.ts` — Contains reusable HTML template layouts, status badges, and booking table formatters.
      * `booking-confirmation.ts` — Sends `sendBookingConfirmationEmail` to both the customer and admin (new booking alert).
      * `status-change.ts` — Sends `sendStatusChangeEmail` directly to the customer based on booking transition states.
      * `booking-reminder.ts` — Sends `sendBookingReminderEmail` exclusively to the customer as a 24-hour pickup heads-up.
  * `redis.ts`: Upstash Redis client instance powering the rate limiting infrastructure (features fail-fast URL/Token validation at boot).
  * `ratelimit.ts`: Upstash rate limiter definitions with three tiers:
      * `authRateLimit` — IP-based, 10 req/60s (used in edge middleware for auth endpoints).
      * `generalRateLimit` — User-based, 30 req/60s (used in `rateLimitedProtectedProcedure` for **mutation-only** tRPC procedures).
      * `bookingRateLimit` — User-based, 5 req/60s (stricter inline limit for booking mutations).
  * `supabase-client.ts`: CDN bucket connector providing external file payload resolution securely (features explicit initialization environment validation).
  * `utils.ts`: Tailwind utility merge logic (`cn()`).