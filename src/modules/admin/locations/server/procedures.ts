import { createTRPCRouter, adminProcedure } from "@/trpc/init";
import { db } from "@/db";
import { location } from "@/db/schema";
import { z } from "zod";
import { eq, getTableColumns, InferSelectModel } from "drizzle-orm";
import { getCachedData, setCachedData, invalidateCacheGroup } from "@/lib/redis-cache";
import { TRPCError } from "@trpc/server";

export const adminLocationsRouter = createTRPCRouter({
    getAll: adminProcedure.query(async () => {
        const cacheKey = "locations:all:admin";
        const cached = await getCachedData<InferSelectModel<typeof location>[]>(cacheKey);
        if (cached) return cached;

        const locations = await db
            .select({ ...getTableColumns(location) })
            .from(location);

        await setCachedData(cacheKey, locations);
        return locations;
    }),

    create: adminProcedure
        .input(z.object({
            name: z.string().min(1),
            city: z.string().min(1),
            fullAddress: z.string().min(1),
            isActive: z.boolean().default(true),
        }))
        .mutation(async ({ input }) => {
            const [newLocation] = await db.insert(location).values({
                ...input,
            }).returning();
            await invalidateCacheGroup("locations");
            return newLocation;
        }),

    update: adminProcedure
        .input(z.object({
            id: z.string(),
            name: z.string().optional(),
            city: z.string().optional(),
            fullAddress: z.string().optional(),
            isActive: z.boolean().optional(),
        }).superRefine((data, ctx) => {
            if (data.name === undefined && data.city === undefined && data.fullAddress === undefined && data.isActive === undefined) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "At least one field must be provided for update",
                });
            }
        }))
        .mutation(async ({ input }) => {
            const { id, ...data } = input;
            const [updated] = await db.update(location).set(data).where(eq(location.id, id)).returning();

            if (!updated) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Location not found" });
            }

            await invalidateCacheGroup("locations");
            return updated;
        }),
});
