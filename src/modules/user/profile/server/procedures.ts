import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { db } from "@/db";
import { user } from "@/db/schema";
import { getTableColumns, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const userProfile = createTRPCRouter({
    getUser: protectedProcedure.query(async ({ ctx }) => {
        const userId = ctx.auth.user.id;

        const [currentUser] = await db
            .select({
                ...getTableColumns(user)
            })
            .from(user)
            .where(
                eq(user.id, userId)
            );

        if (!currentUser) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "User not found",
            });
        }

        return currentUser;
    }),

    updateProfile: protectedProcedure
        .input(z.object({
            phone: z.string().min(6, "Enter a valid phone number").optional(),
            licenseNumber: z.string().min(3, "Enter a valid license number").optional(),
        }))
        .mutation(async ({ input, ctx }) => {
            const userId = ctx.auth.user.id;

            const [updated] = await db
                .update(user)
                .set({
                    ...(input.phone !== undefined && { phone: input.phone }),
                    ...(input.licenseNumber !== undefined && { licenseNumber: input.licenseNumber }),
                })
                .where(eq(user.id, userId))
                .returning();

            if (!updated) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to update profile",
                });
            }

            return updated;
        }),
});