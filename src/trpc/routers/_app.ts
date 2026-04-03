
import { createTRPCRouter } from '../init';
import { carRouter } from '@/modules/user/browse/server/procedures';
import { adminRouter } from '@/modules/admin/dashboard/server/procedures';
import { bookingRouter } from '@/modules/user/check-out/server/procedures';

export const appRouter = createTRPCRouter({
    browse: carRouter,
    admin: adminRouter,
    booking: bookingRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;