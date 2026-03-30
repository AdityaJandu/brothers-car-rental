
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { carInsertSchema } from "../schemas";
import { car } from "@/db/schema";
import { db } from "@/db";

export const adminRouter = createTRPCRouter({

    create: protectedProcedure
        .input(
            carInsertSchema
        )
        .mutation(async ({ input }) => {
            const newCarId = crypto.randomUUID();

            // 2. Insert the data into PostgreSQL using Drizzle
            const [newCar] = await db
                .insert(car)
                .values({
                    id: newCarId,
                    ...input,
                    image: input.image || "https://placehold.co/800x600/1a1c23/ffffff?text=Vehicle+Photo+Pending",
                })
                // .returning() forces Postgres to send the full newly created row back
                .returning();

            // 3. Return the exact database record to your frontend
            return newCar;

        }),

});

