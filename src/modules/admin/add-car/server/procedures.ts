import { createTRPCRouter, rateLimitedProtectedProcedure } from "@/trpc/init";
import { carInsertSchema } from "../../dashboard/schemas";
import { car, auditLog } from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { TRPCError } from "@trpc/server";
import { invalidateCacheGroup } from "@/lib/redis-cache";

export const adminAddCarRouter = createTRPCRouter({
    create: rateLimitedProtectedProcedure
        .input(
            carInsertSchema
        )
        .mutation(async ({ ctx, input }) => {

            const existing = await db
                .select({ id: car.id })
                .from(car)
                .where(eq(car.plateNumber, input.plateNumber))
                .limit(1);

            if (existing.length > 0) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "A car with this plate number already exists.",
                });
            }

            const newCar = await db.transaction(async (tx) => {
                const [insertedCar] = await tx
                    .insert(car)
                    .values({
                        ...input,
                    })
                    .returning();

                if (!insertedCar) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "No car found",
                    });
                }

                await tx.insert(auditLog).values({
                    adminId: ctx.auth.user.id,
                    adminName: ctx.auth.user.name,
                    adminEmail: ctx.auth.user.email,
                    action: "car.created",
                    targetType: "car",
                    targetId: insertedCar.id,
                    newValue: JSON.stringify(insertedCar),
                });

                return insertedCar;
            });

            await invalidateCacheGroup("cars:");
            return newCar;

        }),

    update: rateLimitedProtectedProcedure
        .input(
            carInsertSchema
        )
        .mutation(async ({ ctx, input }) => {
            if (!input.id) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Car ID is required for updating.",
                });
            }

            const updatedCar = await db.transaction(async (tx) => {
                const [carResult] = await tx
                    .update(car)
                    .set({
                        ...input,
                        updatedAt: new Date(),
                    })
                    .where(eq(car.id, input.id!))
                    .returning();

                if (!carResult) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "No car found to update",
                    });
                }

                await tx.insert(auditLog).values({
                    adminId: ctx.auth.user.id,
                    adminName: ctx.auth.user.name,
                    adminEmail: ctx.auth.user.email,
                    action: "car.updated",
                    targetType: "car",
                    targetId: carResult.id,
                    newValue: JSON.stringify(carResult),
                });

                return carResult;
            });

            await invalidateCacheGroup("cars:");
            return updatedCar;
        }),
});
