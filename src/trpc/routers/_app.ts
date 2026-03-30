import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { carRouterUser } from '@/modules/browse/server/procedures';
import { adminRouter } from '@/modules/admin/server/procedures';

export const appRouter = createTRPCRouter({
    hello: baseProcedure
        .input(
            z.object({
                text: z.string(),
            }),
        )
        .query((opts) => {
            return {
                greeting: `hello ${opts.input.text}`,
            };
        }),
    browse: carRouterUser,
    admin: adminRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;