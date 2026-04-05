import { createTRPCRouter, rateLimitedProtectedProcedure } from "@/trpc/init";
import { db } from "@/db";
import { user } from "@/db/schema";
import { getTableColumns, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const userProfile = createTRPCRouter({
    getUser: rateLimitedProtectedProcedure.query(async ({ ctx }) => {
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
});