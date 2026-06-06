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
│  │  blog    │  │ sign-up  │  │  profile │  │ add-car  │  │trpc/[..] │   │
│  │  about   │  │          │  │check-out │  │ bookings │  │inngest   │   │
│  │  contact │  │          │  │ bookings │  │ locations│  │          │   │
│  │  support │  │          │  │          │  │audit-log │  │          │   │
│  │terms/priv│  │          │  │          │  │          │  │          │   │
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
│  │             │  │             │  │  profile/   │  │  audit-log/ │     │
│  │             │  │             │  │  car-id-view│  │             │     │
│  │             │  │             │  │             │  │             │     │
│  ├─────────────┤  │             │  ├─────────────┤  │             │     │
│  │    info     │  │             │  │             │  │             │     │
│  │  ─────────  │  │             │  │             │  │             │     │
│  │  blog/      │  │             │  │             │  │             │     │
│  │  about/     │  │             │  │             │  │             │     │
│  │  contact/   │  │             │  │             │  │             │     │
│  │  support/   │  │             │  │             │  │             │     │
│  │  legal/     │  │             │  │             │  │             │     │
│  │  not-found/ │  │             │  │             │  │             │     │
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
│  init.ts ──► baseProcedure ──► protectedProcedure ──► adminProcedure    │
│                                       └──► rateLimitedProtectedProcedure│
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
│                                                                         │
│  ┌────────────────────────────────────────────────────┐                 │
│  │ Shared Types & Schemas                             │                 │
│  │ ──► constants.ts (paginationInputSchema)           │                 │
│  │ ──► emails/templates.ts (User, Car, Booking types) │                 │
│  └────────────────────────────────────────────────────┘                 │
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
│   │   ├── (onboarding)/                       # 🏠 Landing Page & Info
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                        #    → getSession() + conditional prefetch
│   │   │   │                                   #    → HydrationBoundary for FeaturedFleet
│   │   │   ├── blog/                           #    → Static + SSG routes (force-static)
│   │   │   ├── about/                          #    → Static (force-static)
│   │   │   ├── contact/                        #    → Static (force-static)
│   │   │   ├── support/                        #    → Static (force-static)
│   │   │   ├── terms/                          #    → Static (force-static)
│   │   │   └── privacy/                        #    → Static (force-static)
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
│   │   │   ├── admin-booking/
│   │   │   │   ├── page.tsx                    #    → Promise.all(getSession, prefetch)
│   │   │   │   └── [bookingId]/
│   │   │   │       └── page.tsx                #    → Promise.all(getSession, prefetch)
│   │   │   └── audit-log/
│   │   │       └── page.tsx                    #    → Promise.all(getSession, prefetch) + metadata
│   │   │
│   │   ├── api/                                # 🌐 API Endpoints
│   │   │   ├── auth/[...all]/
│   │   │   │   └── route.ts                    #    → Better-Auth catch-all
│   │   │   ├── inngest/
│   │   │   │   └── route.ts                    #    → Inngest serve handler (4 functions)
│   │   │   └── trpc/[trpc]/
│   │   │       └── route.ts                    #    → tRPC catch-all
│   │   │
│   │   ├── not-found.tsx                       # Global 404 → NotFoundView
│   │   ├── sitemap.ts                          # Dynamic + Static Sitemap generator
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
│   │   │   │   │                               # 🔒 updateOneAdmin (Mutation, Acid Transaction + Audit Log, rate-limited)
│   │   │   │   └── ui/
│   │   │   │       ├── views/
│   │   │   │       │   ├── AdminBookingView.tsx
│   │   │   │       │   └── AdminBookingIdView.tsx
│   │   │   │       └── components/
│   │   │   │           ├── admin-booking-rental-info.tsx
│   │   │   │           ├── admin-booking-pricing-info.tsx
│   │   │   │           └── admin-booking-customer-info.tsx
│   │   │   ├── locations/
│   │   │   │   ├── server/
│   │   │   │   │   └── procedures.ts           # 📖 getAll (Query), 🔒 create/update (Mutation, Acid Transaction + Audit Log)
│   │   │   │   └── ui/
│   │   │   │       ├── views/
│   │   │   │       │   └── AdminLocationsView.tsx
│   │   │   │       └── components/
│   │   │   │           ├── location-columns.tsx
│   │   │   │           └── LocationFormDialog.tsx
│   │   │   │
│   │   │   └── audit-log/
│   │   │       ├── server/
│   │   │       │   └── procedures.ts           # 📖 getAllAuditLogs (Query, adminProcedure, limit 500)
│   │   │       └── ui/
│   │   │           ├── views/
│   │   │           │   └── AuditLogView.tsx    #    Header + Filters + DataTable
│   │   │           └── components/
│   │   │               ├── audit-columns.tsx    #    Action badges + View Delta dialog
│   │   │               ├── AuditHeader.tsx      #    Icon badge + stat chips
│   │   │               └── AuditFilters.tsx     #    Search + dropdown filters
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
│   │   │   │   ├── hooks/
│   │   │   │   │   └── use-car-filters-user.tsx
│   │   │   │   ├── params.ts
│   │   │   │   └── types.ts
│   │   │   │
│   │   │   ├── car-id-view/
│   │   │   │   └── ui/
│   │   │   │       ├── views/
│   │   │   │       │   └── CarIdView.tsx
│   │   │   │       └── components/
│   │   │   │           ├── ImageSlider.tsx
│   │   │   │           ├── CarDetailsSection.tsx
│   │   │   │           ├── CarBookingSection.tsx
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
│   │   │   │   ├── hooks/
│   │   │   │   │   └── use-booking-filters-user.tsx
│   │   │   │   ├── params.ts
│   │   │   │   ├── types.ts                    #    BookingInsertInput, BookingRow, etc.
│   │   │   │   └── ui/
│   │   │   │       ├── views/
│   │   │   │       │   └── CarBookingView.tsx   #    fetches unavailableDates
│   │   │   │       └── components/
│   │   │   │           ├── CheckoutForm.tsx     #    ✅/❌ availability banner
│   │   │   │           ├── SummaryCard.tsx
│   │   │   │           └── BookingStepper.tsx   #    Visual multi-step progress
│   │   │   │
│   │   │   ├── bookings/
│   │   │   │   ├── server/
│   │   │   │   │   └── procedures.ts           # 📖 getAll, getBookingWithDetails, getLatestBooking, getActiveOrUpcomingBooking
│   │   │   │   ├── types.ts                    #    GetOneBookingDetails, GetOneBooking, GetLocationOne
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
│   │   │   │           ├── booking-columns.tsx  #    TanStack Table column defs
│   │   │   │           └── BookingActions.tsx  #    PDFDownloadLink integration
│   │   │   │
│   │   │   ├── profile/
│   │   │   │   ├── server/
│   │   │   │   │   └── procedures.ts           # 📖 getUser (Query) + 🔒 updateProfile (Mutation)
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
│   │   ├── info/                                # ─── Info Pages Module ───
│   │   │   ├── components/
│   │   │   │   ├── InfoPageHeader.tsx           #    Shared header component
│   │   │   │   └── InfoSection.tsx             #    Shared section wrapper
│   │   │   ├── blog/
│   │   │   │   ├── data/posts.ts                #    Static JSON blog data
│   │   │   │   └── ui/
│   │   │   │       ├── views/                   #    BlogView & BlogPostView
│   │   │   │       └── components/              #    PostCard, BlogFilters, RelatedPosts
│   │   │   ├── about/
│   │   │   │   └── ui/views/AboutView.tsx
│   │   │   ├── contact/
│   │   │   │   └── ui/
│   │   │   │       ├── views/ContactView.tsx
│   │   │   │       └── components/
│   │   │   │           ├── ContactForm.tsx
│   │   │   │           └── ContactInfo.tsx
│   │   │   ├── support/
│   │   │   │   └── ui/views/SupportView.tsx
│   │   │   ├── legal/
│   │   │   │   └── ui/views/
│   │   │   │       ├── TermsView.tsx
│   │   │   │       └── PrivacyView.tsx
│   │   │   └── not-found/
│   │   │       └── ui/views/NotFoundView.tsx
│   │
│   ├── trpc/                                   # ─── RPC Bridge Layer ───
│   │   ├── init.ts                             #    Procedure definitions + cache()
│   │   ├── routers/
│   │   │   └── _app.ts                         #    Central router multiplexer
│   │   ├── query-client.ts                     #    QueryClient factory
│   │   ├── client.tsx                          #    React-Query tRPC provider
│   │   └── server.tsx                          #    RSC caller + queryClient
│   │
│   ├── db/                                     # ─── Data Layer ───
│   │   ├── index.ts                            #    Drizzle + postgres (pooled)
│   │   └── schema.ts                           #    user, session, account, verification,
│   │                                            #    location, car, booking, audit_log
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
│   │   │   ├── empty-state.tsx
│   │   │   ├── form-field.tsx
│   │   │   ├── generated-avatar.tsx               #    DiceBear avatar generation
│   │   │   └── command-select.tsx
│   │   └── ui/                                 #    Shadcn/UI primitives
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── ...                              #    60+ Shadcn UI components
│   │
│   ├── hooks/                                  # ─── Global Hooks ───
│   │   └── use-mobile.ts                       #    Responsive breakpoint detection
│   │
│   ├── constants.ts                            #    Pagination schemas & defaults
│   ├── rate-middleware.ts                      #    Edge auth rate limiting
│   │
│   └── lib/                                    # ─── Utilities & Configs ───
│       ├── auth.ts                             #    Better-Auth server config
│       ├── auth-client.ts                      #    Better-Auth client SDK
│       ├── cached-session.ts                   # ⚡ React cache() session dedup
│       ├── redis.ts                            #    Upstash Redis client
│       ├── redis-cache.ts                      #    Read-path caching wrapper
│       ├── emails/                             #    📧 Modular Email Layer (Resend)
│       │   ├── client.ts                       #    → Resend API initialization & env
│       │   ├── index.ts                        #    → Barrel export for all email fns
│       │   ├── templates.ts                    #    → HTML layouts & helpers
│       │   ├── booking-confirmation.ts         #    → sendBookingConfirmationEmail
│       │   ├── status-change.ts                #    → sendStatusChangeEmail
│       │   └── booking-reminder.ts             #    → sendBookingReminderEmail
│       ├── ratelimit.ts                        #    3-tier rate limiters
│       ├── resend.ts                           #    Deprecated: re-exports from emails/
│       ├── supabase-client.ts                  #    Storage bucket connector
│       └── utils.ts                            #    cn() utility
│
├── scripts/
│   └── redis-cache-flush.ts                    #    npm run flush:redis
│
├── projectstructure.md                         # Detailed architecture docs
├── projectStructureVisual.md                   # This file
├── README.md
├── package.json
├── next.config.ts
├── components.json                             # Shadcn UI config
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
         ├──► adminProcedure                 (+ admin role enforcement)
         │     │
         │     └── 📖 ADMIN READ QUERIES
         │         ├── adminLocations.getAll
         │         └── adminAudit.getAllAuditLogs   # limit(500), JSON parse
         │
         ├── 📖 READ QUERIES (no Redis overhead)
         │   ├── userBrowse.getAll
         │   ├── userBrowse.getOne
         │   ├── userBookings.getAll
         │   ├── userBookings.getBookingWithDetails
         │   ├── userBookings.getLatestBooking
         │   ├── userBookings.getActiveOrUpcomingBooking
         │   ├── userCheckout.getUnavailableDates   ⛔ availability engine
         │   ├── userProfile.getUser
         │   ├── userProfile.updateProfile          # phone + license mutation
         │   ├── userLocations.getActiveLocations
         │   ├── adminDashboard.getAllAdmin
         │   ├── adminBookings.getAllAdmin
         │   └── adminBookings.getOneAdmin
         │
         └──► rateLimitedProtectedProcedure  (+ Redis 30 req/min)
               │
               └── 🔒 MUTATIONS (rate-limited)
                   ├── adminAddCar.create
                   ├── adminBookings.updateOneAdmin  # Acid Transaction + Audit Log
                   ├── adminLocations.create
                   ├── adminLocations.update         # Acid Transaction + Audit Log
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
│ phone               │    │   │ expiresAt            │
│ emailVerified       │    │   │ ipAddress            │
│ phoneVerified       │    │   │ userAgent            │
│ image               │    │   │ device               │
│ role (cust|admin)   │    │   │ location             │
│ licenseNumber       │    │   │ createdAt            │
│ isActive            │    │   │ updatedAt            │
│ twoFactorEnabled    │    │   └──────────────────────┘
│ lastLoginAt         │    │
│ banned / banReason  │    │   Also: account, verification
│ createdAt           │    │   (Better-Auth managed tables)
│ updatedAt           │    │
└──────────┬──────────┘    │
           │               │
           │ 1:N           │
           ▼               │
┌─────────────────────┐    │   ┌──────────────────────┐
│       booking       │    │   │         car          │
├─────────────────────┤    │   ├──────────────────────┤
│ id          (PK)    │    │   │ id           (PK)    │
│ userId      (FK)────┤►───┘   │ locationId   (FK)────┤►────────┐
│ carId       (FK)────┤►───────┤► name                │         │
│ startDate           │        │ make                 │         │
│ endDate             │        │ model                │         │
│ pickUpLocation (FK) │        │ year                 │         │
│ dropOffLocation(FK) │        │ category / tier      │         │
│ fullName            │        │ pricePerDay          │         │
│ email               │        │ plateNumber (unique) │         │
│ phoneNumber         │        │ seats                │         │
│ licenseNumber       │        │ transmission (enum)  │         │
│ paymentMethod (enum)│        │ fuelType (enum)      │         │
│ paymentStatus (enum)│        │ headerImage          │         │
│ dailyRate           │        │ imageUrls[]          │         │
│ days                │        │ features[]           │         │
│ protectionFee       │        │ status (enum)────────┤►        │
│ surchargeFee        │        │   available          │         │
│ totalPrice          │        │   rented             │         │
│ status (enum)───────┤►       │   maintenance        │         │
│   pending           │   ┌────│ rating               │         │
│   confirmed         │   │    │ description          │         │
│   cancelled         │   │    │ isActive             │         │
│   completed         │   │    │ deletedAt            │         │
│   expired           │   │    │ createdAt            │         │
│ cancelledAt/By      │   │    │ updatedAt            │         │
│ createdAt           │   │    └──────────────────────┘         │
│ updatedAt           │   │                                     │
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

┌─────────────────────┐
│     audit_log       │
├─────────────────────┤
│ id          (PK)    │
│ adminId     (FK)────┤►── user.id
│ adminName           │
│ adminEmail          │
│ action (enum)───────┤►
│   booking.confirmed │
│   booking.cancelled │
│   booking.completed │
│   car.created       │
│   location.updated  │
│   ...               │
│ targetType          │
│ targetId            │
│ previousValue (text)│
│ newValue (text)     │
│ createdAt           │
└─────────────────────┘
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
  🛡️ Admin    → adminProcedure (auth + role enforcement)
  ⛔ Conflict → checkBookingConflict (overlap guard)
```
