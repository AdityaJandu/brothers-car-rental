import { createTRPCRouter, rateLimitedProtectedProcedure } from "@/trpc/init";
import { carInsertSchema } from "../../dashboard/schemas";
import { car } from "@/db/schema";
import { db } from "@/db";
import { TRPCError } from "@trpc/server";
import { invalidateCacheGroup } from "@/lib/redis-cache";

export const adminAddCarRouter = createTRPCRouter({
    create: rateLimitedProtectedProcedure
        .input(
            carInsertSchema
        )
        .mutation(async ({ input }) => {

            const [newCar] = await db
                .insert(car)
                .values({
                    ...input,
                    headerImage: input.headerImage,
                })
                .returning();

            if (!newCar) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "No car found",
                });
            }

            await invalidateCacheGroup("cars:");
            return newCar;

        }),
});
