# Brothers Car Rental — Visual Project Structure

> A visual map of the entire codebase architecture, data flow, and module relationships.

---

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          NEXT.JS APP ROUTER                             │
│                                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │(onboard) │  │  (auth)  │  │  (user)  │  │ (admin)  │  │   api/   │   │
│  │    /     │  │ sign-in  │  │  browse  │  │dashboard │  │auth/[..] │   │
│  │          │  │ sign-up  │  │  profile │  │ add-car  │  │trpc/[..] │   │
│  │          │  │          │  │check-out │  │ bookings │  │          │   │
│  │          │  │          │  │ bookings │  │ locations│  │          │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │              │             │              │              │      │
└───────┼──────────────┼─────────────┼──────────────┼──────────────┼──────┘
        │              │             │              │              │
        ▼              ▼             ▼              ▼              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      src/modules/ (DDD Domains)                         │
│                                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  onboarding │  │    auth     │  │  user/*     │  │  admin/*    │     │
│  │  ────────── │  │  ─────────  │  │  ───────────│  │  │  ────────│     │   
│  │  views/     │  │  views/     │  │  browse/    │  │  add-car/   │     │
│  │  components/│  │  layout/    │  │  bookings/  │  │  dashboard/ │     │
│  │  data/      │  │             │  │  check-out/ │  │  bookings/  │     │
│  │             │  │             │  │  locations/ │  │  locations/ │     │
│  │             │  │             │  │  profile/   │  │             │     │
│  │             │  │             │  │  car-id-view│  │             │     │
│  └─────────────┘  └─────────────┘  └──────┬──────┘  └──────┬──────┘     │
│                                           │                │            │
│                              ┌────────────┴────────────────┘            │
│                              ▼                                          │
│                    server/procedures.ts                                 │
│                    (tRPC routers per domain)                            │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     src/trpc/ (RPC Bridge Layer)                        │
│                                                                         │
│  init.ts ──► baseProcedure ──► protectedProcedure ──► rateLimited...    │
│  routers/_app.ts ──► Central multiplexer                                │
│  client.tsx ──► React-Query provider                                    │
│  server.tsx ──► RSC hydration pipeline                                  │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     src/db/ (Data Layer)                                │
│                                                                         │
│  index.ts ──► Drizzle + Postgres (pooled, prepare: false)               │
│  schema.ts ──► user | session | car | booking                           │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Supabase DB      │
                    │  (AWS ap-south-1)   │
                    └─────────────────────┘
```

---

## 📂 Full File Tree

```
brothers-car-rental/
│
├── src/
│   │
│   ├── app/                                    # ─── Next.js App Router ───
│   │   │
│   │   ├── (onboarding)/                       # 🏠 Landing Page
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx                        #    → getSession() + conditional prefetch
│   │   │                                       #    → HydrationBoundary for FeaturedFleet
│   │   │
│   │   ├── (auth)/                             # 🔑 Authentication
│   │   │   ├── sign-in/
│   │   │   │   └── page.tsx                    #    → getSession() → redirect if authed
│   │   │   └── sign-up/
│   │   │       └── page.tsx                    #    → getSession() → redirect if authed
│   │   │
│   │   ├── (user)/                             # 👤 Customer Routes
│   │   │   ├── layout.tsx                      #    → Header + Footer wrapper
│   │   │   ├── browse/
│   │   │   │   ├── page.tsx                    #    → Promise.all(getSession, prefetch)
│   │   │   │   └── [carId]/
│   │   │   │       └── page.tsx                #    → Promise.all(getSession, prefetch)
│   │   │   ├── check-out/
│   │   │   │   └── [carId]/
│   │   │   │       └── page.tsx                #    → Promise.all(getSession, prefetch)
│   │   │   ├── bookings/
│   │   │   │   ├── page.tsx                    #    → Promise.all(getSession, prefetch)
│   │   │   │   └── [bookingId]/
│   │   │   │       └── page.tsx
│   │   │   └── profile/
│   │   │       └── page.tsx                    #    → Promise.all(getSession, prefetch)
│   │   │
│   │   ├── (admin)/                            # 🔐 Admin Routes
│   │   │   ├── layout.tsx                      #    → AdminNavbar wrapper
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx                    #    → Promise.all(getSession, prefetch)
│   │   │   ├── add-car/
│   │   │   │   └── page.tsx                    #    → getSession() → admin guard
│   │   │   ├── admin-locations/
│   │   │   │   └── page.tsx                    #    → Promise.all(getSession, prefetch)
│   │   │   └── admin-booking/
│   │   │       ├── page.tsx                    #    → Promise.all(getSession, prefetch)
│   │   │       └── [bookingId]/
│   │   │           └── page.tsx                #    → Promise.all(getSession, prefetch)
│   │   │
│   │   ├── api/                                # 🌐 API Endpoints
│   │   │   ├── auth/[...all]/
│   │   │   │   └── route.ts                    #    → Better-Auth catch-all
│   │   │   ├── inngest/
│   │   │   │   └── route.ts                    #    → Inngest serve handler (4 functions)
│   │   │   └── trpc/[trpc]/
│   │   │       └── route.ts                    #    → tRPC catch-all
│   │   │
│   │   ├── layout.tsx                          # Root layout (providers)
│   │   └── loading.tsx                         # Global loading fallback
│   │
│   ├── modules/                                # ─── Domain-Driven Modules ───
│   │   │
│   │   ├── admin/
│   │   │   ├── add-car/
│   │   │   │   ├── server/
│   │   │   │   │   └── procedures.ts           # 🔒 create (Mutation, rate-limited)
│   │   │   │   └── ui/
│   │   │   │       ├── views/
│   │   │   │       │   └── AddCarView.tsx
│   │   │   │       └── components/
│   │   │   │           ├── AddCarHeader.tsx
│   │   │   │           ├── GeneralInfoCard.tsx
│   │   │   │           ├── SpecificationsCard.tsx
│   │   │   │           ├── MediaGalleryCard.tsx
│   │   │   │           └── StatusSidebarCard.tsx
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── server/
│   │   │   │   │   └── procedures.ts           # 📖 getAllAdmin (Query, no rate limit)
│   │   │   │   ├── ui/
│   │   │   │   │   ├── views/
│   │   │   │   │   │   └── FleetClientView.tsx
│   │   │   │   │   └── components/
│   │   │   │   │       ├── car-columns.tsx
│   │   │   │   │       ├── FleetListHeader.tsx
│   │   │   │   │       └── VehicleInventoryHeader.tsx
│   │   │   │   ├── schemas.ts
│   │   │   │   ├── hooks/
│   │   │   │   ├── params.ts
│   │   │   │   └── types.ts
│   │   │   │
│   │   │   ├── bookings/
│   │   │   │   ├── server/
│   │   │   │   │   └── procedures.ts           # 📖 getAllAdmin, getOneAdmin (Query)
│   │   │   │   │                               # 🔒 updateOneAdmin (Mutation, rate-limited)
│   │   │   │   └── ui/
│   │   │   │       ├── views/
│   │   │   │       │   ├── AdminBookingView.tsx
│   │   │   │       │   └── AdminBookingIdView.tsx
│   │   │   │       └── components/
│   │   │   │           ├── admin-booking-rental-info.tsx
│   │   │   │           ├── admin-booking-pricing-info.tsx
│   │   │   │           └── admin-booking-customer-info.tsx
│   │   │   └── locations/
│   │   │       ├── server/
│   │   │       │   └── procedures.ts           # 📖 getAll (Query), 🔒 create/update (Mutation)
│   │   │       └── ui/
│   │   │           ├── views/
│   │   │           │   └── AdminLocationsView.tsx
│   │   │           └── components/
│   │   │               ├── location-columns.tsx
│   │   │               └── LocationFormDialog.tsx
│   │   │
│   │   ├── user/
│   │   │   ├── browse/
│   │   │   │   ├── server/
│   │   │   │   │   └── procedures.ts           # 📖 getAll, getOne (Query, no rate limit)
│   │   │   │   ├── ui/
│   │   │   │   │   ├── views/
│   │   │   │   │   │   └── BrowseView.tsx
│   │   │   │   │   └── components/
│   │   │   │   │       ├── CarCard.tsx
│   │   │   │   │       ├── CarGrid.tsx
│   │   │   │   │       ├── DatePicker.tsx           #    disabled: Matcher | Matcher[]
│   │   │   │   │       └── FiltersBar.tsx
│   │   │   │   ├── params.ts
│   │   │   │   └── types.ts
│   │   │   │
│   │   │   ├── car-id-view/
│   │   │   │   └── ui/
│   │   │   │       ├── views/
│   │   │   │       │   └── CarIdView.tsx
│   │   │   │       └── components/
│   │   │   │           ├── ImageSlider.tsx
│   │   │   │           ├── PricingCard.tsx          #    ✅/🕐 availability indicator
│   │   │   │           └── Spec.tsx
│   │   │   │
│   │   │   ├── check-out/
│   │   │   │   ├── server/
│   │   │   │   │   ├── availability.ts          # ⛔ checkBookingConflict()
│   │   │   │   │   │                            #    getUnavailableDateRanges()
│   │   │   │   │   └── procedures.ts           # 📖 getUnavailableDates (Query)
│   │   │   │   │                               # 🔒 create (Mutation + conflict check)
│   │   │   │   ├── schemas.ts                  #    bookingInsertSchema (server)
│   │   │   │   │                               #    bookingFormSchema (client)
│   │   │   │   ├── params.ts
│   │   │   │   └── ui/
│   │   │   │       ├── views/
│   │   │   │       │   └── CarBookingView.tsx   #    fetches unavailableDates
│   │   │   │       └── components/
│   │   │   │           ├── CheckoutForm.tsx     #    ✅/❌ availability banner
│   │   │   │           └── SummaryCard.tsx
│   │   │   │
│   │   │   ├── bookings/
│   │   │   │   ├── server/
│   │   │   │   │   └── procedures.ts           # 📖 getAll, getOne (Query, no rate limit)
│   │   │   │   ├── utils/
│   │   │   │   │   └── BookingPdf.tsx          #    React-PDF invoice template
│   │   │   │   └── ui/
│   │   │   │       ├── views/
│   │   │   │       │   ├── AllBookingView.tsx
│   │   │   │       │   └── BookingIdView.tsx
│   │   │   │       └── components/
│   │   │   │           ├── BookingHeader.tsx
│   │   │   │           ├── BookedCarCard.tsx
│   │   │   │           ├── CustomerInfoCard.tsx
│   │   │   │           ├── PaymentSummaryCard.tsx
│   │   │   │           ├── ScheduleLocationCard.tsx
│   │   │   │           └── BookingActions.tsx  #    PDFDownloadLink integration
│   │   │   │
│   │   │   └── profile/
│   │   │       ├── server/
│   │   │       │   └── procedures.ts           # 📖 getUser (Query, no rate limit)
│   │   │       └── ui/
│   │   │           ├── views/
│   │   │           │   └── ProfileView.tsx
│   │   │           └── components/
│   │   │               ├── ProfileHeader.tsx
│   │   │               ├── RewardsStatusCard.tsx
│   │   │               ├── ActiveBookingCard.tsx
│   │   │               ├── PersonalInfoCard.tsx
│   │   │               ├── PaymentMethodsCard.tsx
│   │   │               └── SecuritySettingsCard.tsx
│   │   │   └── locations/
│   │   │       └── server/
│   │   │           └── procedures.ts           # 📖 getActiveLocations (Query, read-through cached)
│   │   │
│   │   ├── onboarding/
│   │   │   ├── ui/
│   │   │   │   ├── views/
│   │   │   │   │   └── OnboardingView.tsx
│   │   │   │   └── components/
│   │   │   │       ├── AuthButtons.tsx         #    → getSession() (cached)
│   │   │   │       ├── CTASection.tsx          #    → getSession() (cached)
│   │   │   │       ├── FeaturedFleet.tsx        #    → useQuery (client, hydrated)
│   │   │   │       ├── FeaturesSection.tsx
│   │   │   │       ├── LocationComponent.tsx
│   │   │   │       └── StepComponent.tsx
│   │   │   └── data/
│   │   │       └── *.ts                        #    Static content data
│   │   │
│   │   └── auth/
│   │       └── ui/
│   │           ├── views/
│   │           │   ├── SignInView.tsx
│   │           │   └── SignUpView.tsx
│   │           └── layout/
│   │               └── AuthHeader.tsx
│   │
│   ├── trpc/                                   # ─── RPC Bridge Layer ───
│   │   ├── init.ts                             #    Procedure definitions + cache()
│   │   ├── routers/
│   │   │   └── _app.ts                         #    Central router multiplexer
│   │   ├── client.tsx                          #    React-Query tRPC provider
│   │   └── server.tsx                          #    RSC caller + queryClient
│   │
│   ├── db/                                     # ─── Data Layer ───
│   │   ├── index.ts                            #    Drizzle + postgres (pooled)
│   │   └── schema.ts                           #    user, session, location, car, booking
│   │                                            #    + booking_car_dates_idx (overlap)
│   │                                            #    + bookingStatusEnum: expired
│   │
│   ├── inngest/                                 # ─── Background Jobs (Inngest) ───
│   │   ├── client.ts                            #    Inngest client (id: brothers-car-rental)
│   │   ├── index.ts                             #    Exports array of all functions
│   │   └── functions/                           #    Modular workflows:
│   │       ├── send-confirmation-email.ts       #    → Immediate conf email trigger
│   │       ├── expire-pending-booking.ts        #    → Sleep 15m & status idempotent update
│   │       ├── send-booking-reminder.ts         #    → sleepUntil -24h from pickup
│   │       └── send-status-change-email.ts      #    → Immediate status change trigger
│   │
│   ├── components/                             # ─── Shared UI ───
│   │   ├── layout/
│   │   │   ├── Header.tsx                      #    → getSession() (cached)
│   │   │   ├── HeaderClient.tsx
│   │   │   ├── AdminHeaderNavBar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── MobileNav.tsx
│   │   ├── self/
│   │   │   ├── data-table.tsx
│   │   │   ├── data-pagination.tsx
│   │   │   ├── loading-state.tsx
│   │   │   ├── error-state.tsx
│   │   │   └── empty-state.tsx
│   │   └── ui/                                 #    Shadcn/UI primitives
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── ...
│   │
│   └── lib/                                    # ─── Utilities & Configs ───
│       ├── auth.ts                             #    Better-Auth server config
│       ├── auth-client.ts                      #    Better-Auth client SDK
│       ├── cached-session.ts                   # ⚡ React cache() session dedup
│       ├── redis.ts                            #    Upstash Redis client
│       ├── redis-cache.ts                      #    Read-path caching wrapper
│       ├── emails/                             #    📧 Modular Email Layer (Resend)
│       │   ├── client.ts                       #    → Resend API initialization & env
│       │   ├── templates.ts                    #    → HTML layouts & helpers
│       │   ├── booking-confirmation.ts         #    → sendBookingConfirmationEmail
│       │   ├── status-change.ts                #    → sendStatusChangeEmail
│       │   └── booking-reminder.ts             #    → sendBookingReminderEmail
│       ├── ratelimit.ts                        #    3-tier rate limiters
│       ├── supabase-client.ts                  #    Storage bucket connector
│       └── utils.ts                            #    cn() utility
│
├── projectstructure.md                         # Detailed architecture docs
├── projectStructVisual.md                      # This file
├── README.md
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── drizzle.config.ts
└── .env
```

---

## 🔄 Request Flow (Server-Side Rendering)

```
Browser Request (GET /browse)
        │
        ▼
┌──────────────────────────────────┐
│       Next.js App Router         │
│   src/app/(user)/browse/page.tsx │
└──────────────┬───────────────────┘
               │
               │  Promise.all([...])
               │
        ┌──────┴──────┐
        │             │
        ▼             ▼
 ┌─────────────┐ ┌──────────────────┐
 │ getSession()│ │  prefetchQuery() │
 │ (cached)    │ │  userBrowse.     │
 │             │ │  getAll({...})   │
 └─────┬───────┘ └───────┬──────────┘
       │                 │
       │            ┌────┴────┐
       │            ▼         │
       │   ┌──────────────┐   │
       │   │ protectedProc│   │
       │   │  middleware  │   │
       │   │ getCachedSess│◄──┘ (reuses same session!)
       │   └──────┬───────┘
       │          │
       │          ▼
       │   ┌──────────────┐
       │   │   Drizzle    │
       │   │   db.select  │
       │   └──────┬───────┘
       │          │
       │          ▼
       │   ┌──────────────┐
       │   │  Supabase    │
       │   │  PostgreSQL  │
       │   └──────────────┘
       │
       ▼
 ┌─────────────────┐
 │ if (!session)   │──► redirect("/sign-in")
 │ redirect        │
 └────────┬────────┘
          │ (session exists)
          ▼
 ┌─────────────────────────┐
 │  HydrationBoundary      │
 │  ┌───────────────────┐  │
 │  │ dehydrate(state)  │  │
 │  │ BrowseView (RSC)  │  │
 │  └───────────────────┘  │
 └────────────┬────────────┘
              │
              ▼
         HTML Response
      (data pre-embedded)
```

---

## ⚡ tRPC Procedure Tier Map

```
baseProcedure
  │
  └──► protectedProcedure                    (auth check via cached session)
         │
         ├── 📖 READ QUERIES (no Redis)
         │   ├── userBrowse.getAll
         │   ├── userBrowse.getOne
         │   ├── userBookings.getAll
         │   ├── userBookings.getOne
         │   ├── userCheckout.getUnavailableDates   ⛔ availability engine
         │   ├── userProfile.getUser
         │   ├── userLocations.getActiveLocations
         │   ├── adminDashboard.getAllAdmin
         │   ├── adminBookings.getAllAdmin
         │   ├── adminBookings.getOneAdmin
         │   └── adminLocations.getAll
         │
         └──► rateLimitedProtectedProcedure  (+ Redis 30 req/min)
               │
               └── 🔒 MUTATIONS (rate-limited)
                   ├── adminAddCar.create
                   ├── adminBookings.updateOneAdmin
                   ├── adminLocations.create
                   ├── adminLocations.update
                   └── userCheckout.create          (+ bookingRateLimit 5/min)
                       └── ⛔ checkBookingConflict  (overlap guard)
```

---

## 🔐 Auth Session Deduplication Flow

```
Single Server Request (e.g. GET /)
│
├── page.tsx ─────────────────── getSession() ──┐
├── Header.tsx ──────────────── getSession()  ──┤
├── AuthButtons.tsx ─────────── getSession()  ──┤  ALL resolve to
├── CTASection.tsx ──────────── getSession()  ──┤  the SAME cached
├── tRPC protectedProcedure ── getCachedSess() ─┤  DB call (1 hit)
│                                               │
│                    ┌──────────────────────────┘
│                    ▼
│          ┌───────────────────┐
│          │  React cache()    │
│          │  ─────────────    │
│          │  1st call: fetch  │──► auth.api.getSession() ──► Supabase DB
│          │  2-5th: cached    │──► return memoized result
│          └───────────────────┘
│
│  Before: 5 DB roundtrips × ~400ms = ~2000ms
│  After:  1 DB roundtrip  × ~400ms =  ~400ms
│                                    ─────────
│                              Saved: ~1600ms ⚡
```

---

## 🗄️ Database Schema (ERD)

```
┌─────────────────────┐        ┌──────────────────────┐
│        user         │        │       session        │
├─────────────────────┤        ├──────────────────────┤
│ id          (PK)    │◄───┐   │ id           (PK)    │
│ name                │    │   │ userId       (FK)────┤►
│ email (unique)      │    │   │ token                │
│ emailVerified       │    │   │ expiresAt            │
│ image               │    │   │ ipAddress            │
│ role (user|admin)   │    │   │ userAgent            │
│ createdAt           │    │   │ createdAt            │
│ updatedAt           │    │   │ updatedAt            │
└──────────┬──────────┘    │   └──────────────────────┘
           │               │
           │ 1:N           │
           ▼               │
┌─────────────────────┐    │   ┌──────────────────────┐
│       booking       │    │   │         car          │
├─────────────────────┤    │   ├──────────────────────┤
│ id          (PK)    │    │   │ id           (PK)    │
│ userId      (FK)────┤►───┘   │ locationId   (FK)────┤►────────┐
│ carId       (FK)────┤►───────┤► make                │         │
│ startDate           │        │ model                │         │
│ endDate             │        │ year                 │         │
│ pickUpLocation      │        │ pricePerDay          │         │
│ dropOffLocation     │        │ licensePlate         │         │
│ totalPrice          │        │ seats                │         │
│ status (enum)───────┤►       │ transmission         │         │
│   pending           │   ┌────│ fuelType             │         │
│   confirmed         │   │    │ category             │         │
│   cancelled         │   │    │ headerImage          │         │
│   completed         │   │    │ images[]             │         │
│ createdAt           │   │    │ status (enum)────────┤►        │
│ updatedAt           │   │    │   available          │         │
└─────────────────────┘   │    │   rented             │         │
                          │    │   maintenance        │         │
                     N:1  │    │ rating               │         │
                          │    │ description          │         │
                          │    │ createdAt            │         │
                          │    │ updatedAt            │         │
                          │    └──────────────────────┘         │
                          │                                     │
                          └── booking.carId ──► car.id          │
                                                                ▼
                                                       ┌──────────────────────┐
                                                       │       location       │
                                                       ├──────────────────────┤
                                                       │ id           (PK)    │
                                                       │ name                 │
                                                       │ city                 │
                                                       │ fullAddress          │
                                                       │ isActive             │
                                                       │ createdAt            │
                                                       │ updatedAt            │
                                                       └──────────────────────┘
```

---

## 🌐 External Services

```
┌─────────────────────────────────────────────────────────┐
│                    Application                          │
│                                                         │
│  ┌────────────────┐      ┌────────────────┐             │
│  │  Better-Auth   │      │   Drizzle ORM  │             │
│  │  (auth.ts)     │      │   (db/index.ts)│             │
│  └───────┬────────┘      └───────┬────────┘             │
│          │                       │                      │
│  ┌───────┴───────┐      ┌────────┴───────┐              │
│  │ Upstash Redis │      │ Supabase       │              │
│  │ (ratelimit.ts)│      │ Storage        │              │
│  └───────┬───────┘      │ (images)       │              │
│          │              └────────┬───────┘              │
└──────────┼───────────────────────┼──────────────────────┘
           │                       │
           ▼                       ▼
  ┌────────────────┐      ┌────────────────┐
  │  Upstash Redis │      │   Supabase     │
  │  (cloud)       │      │   PostgreSQL   │
  │                │      │  AWS ap-south-1│
  │  • authLimit   │      │                │
  │    10 req/60s  │      │  • user        │
  │  • generalLimit│      │  • session     │
  │    30 req/60s  │      │  • car         │
  │  • bookingLimit│      │  • booking     │
  │    5 req/60s   │      │                │
  └────────────────┘      └────────────────┘
```

---

## ⛔ Booking Conflict Engine Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                    CHECKOUT PAGE (/check-out/[carId])            │
│                                                                  │
│  ┌──────────────────────────────────┐                            │
│  │  useQuery(getUnavailableDates)   │                            │
│  │  → returns blocked date ranges   │                            │
│  └──────────────┬───────────────────┘                            │
│                 │                                                │
│                 ▼                                                │
│  ┌──────────────────────────────────┐                            │
│  │  DatePicker                      │                            │
│  │  disabled = [                    │                            │
│  │    { before: today },            │                            │
│  │    ...eachDayOfInterval(ranges)  │  ← blocked dates grayed    │
│  │  ]                               │                            │
│  └──────────────┬───────────────────┘                            │
│                 │                                                │
│                 ▼                                                │
│  ┌──────────────────────────────────┐                            │
│  │  Availability Banner             │                            │
│  │  [✓] "Available for selected"    │  ← green, no overlap       │
│  │  [x] "Unavailable for selected"  │  ← red, overlap found      │
│  │  [i] "Next available: Apr 16"    │  ← hint                    │
│  └──────────────┬───────────────────┘                            │
│                 │                                                │
│                 ▼  onSubmit                                      │
└─────────────────┬────────────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────────────────────┐
│              tRPC: userCheckout.create (Mutation)                │
│                                                                  │
│  Step 1: rateLimitedProtectedProcedure  (30 req/min)             │
│  Step 2: bookingRateLimit               (5 bookings/min)         │
│  Step 3: [!] checkBookingConflict(carId, startDate, endDate)     │
│          │                                                       │
│          ├── SELECT id FROM booking                              │
│          │   WHERE car_id = $carId                               │
│          │   AND status IN ('confirmed', 'pending')              │
│          │   AND start_date < $endDate                           │
│          │   AND end_date > $startDate                           │
│          │   LIMIT 1                                             │
│          │        ↑                                              │
│          │   Uses: booking_car_dates_idx composite index         │
│          │                                                       │
│          ├── conflict? ──YES──► throw TRPCError(CONFLICT)        │
│          │                                                       │
│          └── NO conflict                                         │
│                │                                                 │
│  Step 4:       ▼                                                 │
│          db.insert(booking).values({...}).returning()            │
│                                                                  │
│  Step 5: invalidateCacheGroup("bookings:...")                    │
└──────────────────────────────────────────────────────────────────┘

Overlap Formula:  newStart < existingEnd AND newEnd > existingStart
Boundary Rule:    inclusive start, exclusive end
Blocking Statuses: confirmed, pending
```

---

## 🧩 Module Anatomy (Standard Pattern)

```
module-name/
│
├── server/
│   ├── procedures.ts        # tRPC router with queries/mutations
│   └── availability.ts      # Domain logic utilities (optional)
│
├── ui/
│   ├── views/
│   │   └── ModuleView.tsx   # Page-level composition root
│   │                         #   exports: View, ViewLoading, ViewError
│   └── components/
│       ├── ComponentA.tsx    # Focused, reusable presentation
│       └── ComponentB.tsx
│
├── schemas.ts               # Zod validation (optional)
├── params.ts                # nuqs search param definitions (optional)
├── hooks/                   # Client-side React hooks (optional)
│   └── use-filters.tsx
├── types.ts                 # TypeScript types (optional)
└── data/                    # Static mock data (optional)
    └── *.ts

Legend:
  📖 Query    → protectedProcedure (auth-only, no Redis)
  🔒 Mutation → rateLimitedProtectedProcedure (auth + Redis)
  ⛔ Conflict → checkBookingConflict (overlap guard)
```

Additional files:
scripts/redis-cache-flush.ts - Flushes the redis cache
