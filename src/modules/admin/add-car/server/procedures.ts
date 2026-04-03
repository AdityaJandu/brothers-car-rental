import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { carInsertSchema } from "../../dashboard/schemas";
import { car } from "@/db/schema";
import { db } from "@/db";
import { TRPCError } from "@trpc/server";

export const adminAddCarRouter = createTRPCRouter({
    create: protectedProcedure
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

            return newCar;

        }),
});
