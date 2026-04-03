
import { createTRPCRouter } from '../init';
import { carRouter } from '@/modules/user/browse/server/procedures';
import { adminRouter } from '@/modules/admin/dashboard/server/procedures';

export const appRouter = createTRPCRouter({
    browse: carRouter,
    admin: adminRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;