import { createTRPCRouter, adminProcedure } from "@/trpc/init";
import { db } from "@/db";
import { auditLog, location } from "@/db/schema";
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
        .mutation(async ({ ctx, input }) => {
            const { id, ...data } = input;

            // Make a transaction:
            const updatedLocation = await db.transaction(async (tx) => {
                const [before] = await tx
                    .select()
                    .from(location)
                    .where(eq(location.id, id))
                    .limit(1);

                if (!before) {
                    throw new TRPCError({ code: "NOT_FOUND", message: "Location not found" });
                }
                // 2. Perform the update
                const [updated] = await tx
                    .update(location)
                    .set(data)
                    .where(eq(location.id, id))
                    .returning();

                // 3. Log the change
                // We only log the fields that were actually provided in the input
                const changedFieldsBefore = Object.fromEntries(
                    Object.keys(data).map(key => [key, before[key as keyof typeof before]])
                );

                await tx.insert(auditLog).values({
                    adminId: ctx.auth.user.id,
                    adminName: ctx.auth.user.name,
                    adminEmail: ctx.auth.user.email,
                    // Ensure "location.updated" is added to your schema enum!
                    action: "location.updated",
                    targetType: "location",
                    targetId: id,
                    previousValue: JSON.stringify(changedFieldsBefore),
                    newValue: JSON.stringify(data),
                });

                return updated;
            })

            if (!updatedLocation) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Location not found" });
            }

            await invalidateCacheGroup("locations");
            return updatedLocation;
        }),
});
