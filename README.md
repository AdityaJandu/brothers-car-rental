# Brothers Car Rental 🚗

A premium, modern web application for luxury vehicle rentals built with Next.js, tRPC, Drizzle ORM, and Tailwind CSS. The platform natively provides an elegant client-facing booking experience alongside a comprehensive administrative dashboard for precise fleet management.

---

## 🛠 Tech Stack

*   **Framework**: Next.js (App Router, Server Components)
*   **Database**: PostgreSQL
*   **ORM**: Drizzle ORM
*   **API/RPC Architecture**: tRPC
*   **Authentication**: Better Auth (Email/Password & Google OAuth)
*   **Rate Limiting**: Upstash Redis (multi-layered: auth, tRPC general, domain-specific)
*   **Storage**: Supabase Storage
*   **UI Components**: Custom tailored Shadcn UI
*   **Styling**: Tailwind CSS
*   **Validation**: Zod & React Hook Form

## ✨ Core Features

*   **Public Fleet Discovery**: Beautifully mapped grid designs, dynamic filtering, and rich specification pages.
*   **Secure Booking Engine**: A seamless transactional checkout flow dynamically verifying dates and structural integrity via strict Zod server schemas.
*   **Administrative Management**: High-level dashboards isolating active rentals, confirming requests, and parsing incoming fleet additions directly into the database.
*   **Cloud Image Uploading**: Seamless fleet-asset capturing securely handled client-side and dispatched directly to Supabase data buckets.
*   **Multi-Layered Rate Limiting**: IP-based auth rate limiting at the edge middleware, per-user general tRPC rate limiting (30 req/min) via `rateLimitedProtectedProcedure`, and stricter domain-specific limits (e.g., 5 bookings/min) for critical mutations.
*   **Optimized Design**: Custom responsive aesthetic adhering tightly to modern curved (`rounded-md` clamped bounds) and drop-shadow architectures.

## 🚀 Getting Started

First, ensure you have the required environment variables (`neon db string`, `auth secrets`, `supabase url` & `supabase anon key`) properly mapped inside your local `.env`.

### 1. Install Dependencies
```bash
npm install
```

### 2. Prepare the Database 
Push the local schema tracking parameters explicitly down to the remote PostgreSQL datastore organically:
```bash
npx drizzle-kit generate
npx drizzle-kit migrate
# or
npx drizzle-kit push
```

### 3. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience the application dynamically.

## 🗺️ Project Structure

The codebase is built on a highly modular **Domain-Driven Architecture**:

*   `/src/app/` - The Next.js routing structure dynamically wrapping `(auth)`, `(onboarding)`, `(user)`, and `(admin)` zones.
*   `/src/modules/` - The beating heart of the system storing all explicitly modular UI/Server pairs (`user/profile`, `admin/dashboard`, `user/check-out`, `user/browse`, etc.). Complex views are decomposed into focused sub-components within their module's `ui/components/` directory (e.g., `admin/add-car` splits into `AddCarHeader`, `GeneralInfoCard`, `SpecificationsCard`, `MediaGalleryCard`, and `StatusSidebarCard`).
*   `/src/components/` - Shadcn UI layouts clamped universally safely beneath custom layout wrapping.
*   `/src/db/` - Drizzle ORM database bindings mapping TypeScript logic strictly globally to postgres structures.

*For an extreme deep-dive directly into the exact query hooks and `procedures.ts` tracking variables tied physically across each folder logic node, please refer to the `projectstructure.md` file!*

## 👮‍♂️ Admin Operations
To interact dynamically with the admin endpoints (`/dashboard`, `/add-car`, `/admin-booking`), you must alter your authenticated user session role manually to `admin` directly within the Postgres database via the active neon dashboard.
