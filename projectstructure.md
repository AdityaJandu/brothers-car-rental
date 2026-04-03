# Brothers Car Rental - Project Structure & Architecture

This document provides a comprehensive breakdown of the application\'s entire codebase structure. It details the purpose of each file and folder, with a specific focus on the tRPC backend modules (`procedures.ts`) and their available operations.

---

## 📁 `src/app/` (Next.js App Router)
The `app` directory utilizes Next.js routing groups to enforce layout boundaries and authentication perimeters naturally.

### 🔐 Admin Routes (`(admin)`) 
*Accessible only by authorized administrators.*
*   `layout.tsx`: Wraps admin pages with the `AdminHeaderNavBar`.
*   `dashboard/page.tsx`: Main admin dashboard showing vehicle fleet and system metrics.
*   `add-car/page.tsx`: The form dedicated to parsing and inserting new vehicles into the database.
*   `admin-booking/page.tsx`: Table view interface listing all global customer bookings.
*   `admin-booking/[bookingId]/page.tsx`: Dedicated management view for reviewing/updating a specific booking.

### 👤 User/Customer Routes (`(user)`)
*Publicly accessible or customer-specific endpoints.*
*   `layout.tsx`: Wraps user pages with the global header/footer navigation.
*   `browse/page.tsx`: The main Fleet Gallery allowing users to filter and view available cars.
*   `browse/[carId]/page.tsx`: Detailed specification page for a single vehicle.
*   `check-out/[carId]/page.tsx`: The multi-step booking checkout form.
*   `bookings/page.tsx`: Display of the authenticated user\'s internal booking history.

### 👋 Onboarding & Auth (`(onboarding)`, `(auth)`)
*   `(onboarding)/page.tsx` & `layout.tsx`: The primary landing page featuring rich SEO marketing, hero sections, and CTA funnels.
*   `(auth)/sign-in/page.tsx`: Login gateway UI.
*   `(auth)/sign-up/page.tsx`: Registration gateway UI.

### 🌐 API Routes (`api/`)
*   `api/auth/[...all]/route.ts`: Better-Auth catch-all handler for authentication orchestration.
*   `api/trpc/[trpc]/route.ts`: tRPC catch-all endpoint that routes all client mutations/queries into the backend logic.

---

## 📁 `src/modules/` (Domain-Driven Architecture)
The application is logically decoupled into independent, self-contained business domains. This is where the core logic, UI views, schemas, and tRPC backend procedures live.

### 🚗 `admin/add-car`
Handles appending new car assets to the system.
*   **`server/procedures.ts`**:
    *   `create` **(Mutation)**: Inserts a strictly validated payload mapped to the `carInsertSchema` into the Postgres database natively.
*   `ui/views/AddCarView.tsx`: Client-side UI capturing the multipart-form details including vehicle metrics, features, and native image uploads via Supabase.

### 📊 `admin/dashboard`
Handles fetching and sorting global fleet metrics.
*   **`server/procedures.ts`**:
    *   `getAllAdmin` **(Query)**: Pulls paginated, sorted vehicle objects bypassing customer filters mapping raw datastores to the dashboard metrics.
*   `ui/views/FleetClientView.tsx`: The primary analytical dashboard component rendering fleet states.
*   `ui/components/car-columns.tsx` & `VehicleInventoryHeader.tsx`: UI chunks for presenting grid layout and table data mapping.
*   `schemas.ts`: Core validation mapping rules dictating the shape of DB inputs/outputs.
*   `hooks/user-car-filters.tsx` / `params.ts` / `types.ts`: Local state management logic.

### 📅 `admin/bookings`
Admin-tier management of all internal customer rental requests.
*   **`server/procedures.ts`**:
    *   `getAllAdmin` **(Query)**: Pulls all globally tracked bookings across all users.
    *   `getOneAdmin` **(Query)**: Leverages a `leftJoin` to fetch a singular booking alongside its heavily associated `car` specifications for deep review.
    *   `updateOneAdmin` **(Mutation)**: Validated state machine transition bridging enum values (e.g. `pending` -> `confirmed`) to the database layer safely.
*   `ui/views/AdminBookingView.tsx`, `AdminBookingIdView.tsx`: Parent container map for resolving booking endpoints.
*   `ui/components/admin-booking-rental-info.tsx`, `admin-booking-pricing-info.tsx`, `admin-booking-customer-info.tsx`: Presentation widgets displaying structured relational db output.

### 🛍️ `user/browse` & `user/car-id-view`
Publicly facing gallery modules for vehicle discovery.
*   **`user/browse/server/procedures.ts`**:
    *   `getAll` **(Query)**: Pulls active, publicly available vehicles securely paginated and filtered by the user UI (Date, Range, Transmission).
    *   `getOne` **(Query)**: Pulls explicitly defined attributes for a single car entity.
*   `user/browse/ui/views/BrowseView.tsx`: The core gallery layout wrapper component.
*   `user/browse/ui/components/CarCard.tsx`, `CarGrid.tsx`, `DatePicker.tsx`, `FiltersBar.tsx`: Modular presentation layer components building the responsive filtering logic natively.
*   `user/car-id-view/ui/views/CarIdView.tsx` & components (`ImageSlider.tsx`, `Spec.tsx` etc.): Granular rendering block for a single vehicle page layout.

### 💳 `user/check-out`
Transactional engine powering the reservation logic.
*   **`server/procedures.ts`**:
    *   `create` **(Mutation)**: Heavily validated ingest taking secure frontend parameters formatting and committing them transactionally to the tracking system natively.
*   `schemas.ts`: Strict Zod validation (e.g., date-barrier logic enforcing rules like `startDate > date.now()`).
*   `ui/views/CarBookingView.tsx`: Page wrapping logic managing stepper rendering.
*   `ui/components/BookingStepper.tsx`, `CheckoutForm.tsx`, `SummaryCard.tsx`: Client-side data intake fields linked automatically dynamically resolving prices synchronously.

### 📜 `user/bookings`
Customer dashboard tracking standard historical reservations.
*   **`server/procedures.ts`**:
    *   `getAllUser` **(Query)**: Fetches and structures booking receipts locally bound specifically to the contextual `userId` authenticated session token.
*   `ui/views/AllBookingView.tsx` & `ui/components/booking-columns.tsx`: Frontend mapped React Tables rendering state outputs transparently.

### 🚀 `onboarding`
The pure marketing and branding UX architecture.
*   `ui/views/OnboardingView.tsx` & `components/`: Hero sections, Call To Action bars (`CTASection.tsx`), dynamic Fleet showcases (`FeaturedFleet.tsx`), step-by-step maps (`StepComponent.tsx`).
*   `data/*.ts`: Mock/Static JSON structures fueling the landing page placeholders dynamically.

### 🔑 `auth`
*   `ui/views/SignInView.tsx` & `SignUpView.tsx`: Styled NextJS Client Components natively interfacing with BetterAuth APIs.
*   `ui/layout/AuthHeader.tsx`: Wrapper injecting context UI logic appropriately.

---

## 📁 `src/db/` (Database & Schema Orchestration)
Drizzle ORM central mapping architecture.
*   `index.ts`: The core database connector binding Drizzle explicitly to the neon/postgres connection string.
*   `schema.ts`: Absolute ground truth declaring table relations (`user`, `session`, `car`, `booking`) mapped bi-directionally alongside enum limitations natively generating SQL constraints.

---

## 📁 `src/trpc/` (Backend RPC Architecture)
Server-Client bridge guaranteeing purely typed data-fetching.
*   `init.ts`: The baseline core tRPC initialization creating `createTRPCRouter` alongside auth-middleware mapping (`protectedProcedure` validating session cookies).
*   `routers/_app.ts`: The central router multiplexer tying `adminAddCarRouter`, `carRouter`, `bookingRouter`, etc. natively back into one overarching namespace root.
*   `client.tsx`: React-Query provider wrapper enabling `trpc.module.endpoint.useQuery` natively on frontend UI code.
*   `server.tsx`: Server-side context hydration pipeline for RSC payload handling.

---

## 📁 `src/components/` (UI Presentation Layer)
*   **`layout/`**: `AdminHeaderNavBar.tsx`, `Header.tsx`, `Footer.tsx`, `MobileNav.tsx`: Site-wide structural frames dictating routing bars correctly.
*   **`self/`**: Pre-built functional units tying multiple standard UI blocks together:
    *   `data-table.tsx` & `data-pagination.tsx`: Reusable tanstack/react-table components natively capable.
    *   `loading-state.tsx`, `error-state.tsx`, `empty-state.tsx`: Pure fallback UX templates.
*   **`ui/`**: A fully decoupled, heavily constrained customized variant of the Shadcn/UI primitive library bridging modern Radix accessibility seamlessly to perfectly generated rounded tailwind standards internally modified by project-wide scripts to explicitly adhere to the `rounded-md` curves mapping.

---

## 📁 `src/lib/` (Utilities & Configs)
*   `auth.ts`: Better-Auth server-side configuration mapping DB constraints dynamically to logical providers.
*   `auth-client.ts`: Equivalent client SDK for managing triggers.
*   `supabase-client.ts`: CDN bucket connector providing external file payload resolution securely.
*   `utils.ts`: Tailwind utility merge logic (`cn()`).
