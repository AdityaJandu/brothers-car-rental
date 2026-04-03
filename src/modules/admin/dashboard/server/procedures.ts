
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { carInsertSchema } from "../schemas";
import { car } from "@/db/schema";
import { db } from "@/db";

import { count, eq, ilike, and, getTableColumns } from "drizzle-orm";
import { DEFAULT_PAGE, MIN_PAGE_SIZE, MAX_PAGE_SIZE, DEFAULT_PAGE_SIZE } from "@/constants";
import { CarStatus } from "../types";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const adminDashboardRouter = createTRPCRouter({
    getAllAdmin: protectedProcedure
        .input(z.object({
            page: z.number().default(DEFAULT_PAGE),
            pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
            search: z.string().nullish(),
            status: z.enum([
                CarStatus.Available,
                CarStatus.Maintenance,
                CarStatus.Rented
            ]).nullish(),
        }))
        .query(async ({ input }) => {
            const { page, pageSize, search, status } = input;

            const data = await db
                .select({
                    ...getTableColumns(car)
                })
                .from(car)
                .where(
                    and(
                        search ? ilike(car.name, `%${search}%`) : undefined,
                        status ? eq(car.status, status) : undefined
                    )
                )
                .limit(pageSize)
                .offset((page - 1) * pageSize);

            const [total] = await db
                .select({ count: count() })
                .from(car)
                .where(
                    and(
                        search ? ilike(car.name, `%${search}%`) : undefined,
                        status ? eq(car.status, status) : undefined
                    )
                );

            const totalPages = Math.ceil(total.count / pageSize);

            if (!data) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Car not found or you don't have access to it.",
                });
            }

            return {
                items: data,
                total: total.count,
                totalPages,
            };
        }),
});

