import { createTRPCRouter } from '../init';

import { carRouter } from '@/modules/user/browse/server/procedures';
import { bookingRouter } from '@/modules/user/check-out/server/procedures';
import { userBookingsRouter } from '@/modules/user/bookings/server/procedures';
import { userProfile } from '@/modules/user/profile/server/procedures';

import { adminDashboardRouter } from '@/modules/admin/dashboard/server/procedures';
import { adminAddCarRouter } from '@/modules/admin/add-car/server/procedures';
import { adminBookingsRouter } from '@/modules/admin/bookings/server/procedures';
import { adminLocationsRouter } from '@/modules/admin/locations/server/procedures';
import { userLocationsRouter } from '@/modules/user/locations/server/procedures';

export const appRouter = createTRPCRouter({
    userBrowse: carRouter,
    userCheckout: bookingRouter,
    userBookings: userBookingsRouter,
    userProfile: userProfile,
    userLocations: userLocationsRouter,

    adminDashboard: adminDashboardRouter,
    adminAddCar: adminAddCarRouter,
    adminBookings: adminBookingsRouter,
    adminLocations: adminLocationsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;