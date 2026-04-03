import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { bookingInsertSchema } from "../schemas";
import { db } from "@/db";
import { booking } from "@/db/schema";
import { TRPCError } from "@trpc/server";


export const bookingRouter = createTRPCRouter({

    create: protectedProcedure
        .input(bookingInsertSchema)
        .mutation(async ({ input, ctx }) => {

            const userId = ctx.auth.user.id; // Or ctx.session.user.id


            const [createdBooking] = await db
                .insert(booking)
                .values({
                    ...input,
                    userId,
                })
                .returning();

            if (!createdBooking) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Meeting not found or you don't have access to it.",
                });
            }


            return createdBooking;
        }),
});