
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { car } from "@/db/schema";
import { db } from "@/db";

import { count, eq, ilike, and, getTableColumns, isNull } from "drizzle-orm";
import { paginationInputSchema } from "@/constants";
import { CarStatus } from "../types";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { getCachedData, setCachedData } from "@/lib/redis-cache";

export const adminDashboardRouter = createTRPCRouter({
    getAllAdmin: protectedProcedure
        .input(paginationInputSchema.extend({
            search: z.string().nullish(),
            status: z.enum([
                CarStatus.Available,
                CarStatus.Maintenance,
                CarStatus.Rented
            ]).nullish(),
        }))
        .query(async ({ input }) => {
            const { page, pageSize, search, status } = input;

            const normalizedSearch = (search ?? "").trim().toLowerCase();
            const shouldCache = normalizedSearch.length <= 64;
            const cacheKey = `cars:admin:page:${page}:size:${pageSize}:search:${normalizedSearch || "none"}:status:${status || "all"}`;

            if (shouldCache) {
                const cached = await getCachedData<{ items: typeof car.$inferSelect[], total: number, totalPages: number }>(cacheKey);
                if (cached) return cached;
            }

            const data = await db
                .select({
                    ...getTableColumns(car)
                })
                .from(car)
                .where(
                    and(
                        isNull(car.deletedAt),
                        normalizedSearch ? ilike(car.name, `%${normalizedSearch}%`) : undefined,
                        status ? eq(car.status, status) : undefined
                    )
                )
                .limit(pageSize)
                .offset((page - 1) * pageSize);

            if (!data) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "No cars found",
                });
            }

            const [total] = await db
                .select({ count: count() })
                .from(car)
                .where(
                    and(
                        isNull(car.deletedAt),
                        normalizedSearch ? ilike(car.name, `%${normalizedSearch}%`) : undefined,
                        status ? eq(car.status, status) : undefined
                    )
                );

            const totalPages = Math.ceil(total.count / pageSize);

            const response = {
                items: data,
                total: total.count,
                totalPages,
            };

            if (shouldCache) {
                await setCachedData(cacheKey, response);
            }
            return response;
        }),

    getOneAdmin: protectedProcedure
        .input(z.object({
            id: z.string()
        }))
        .query(async ({ input }) => {
            const { id } = input;

            const [data] = await db
                .select({
                    ...getTableColumns(car),
                })
                .from(car)
                .where(
                    and(
                        eq(car.id, id),
                        isNull(car.deletedAt)
                    )
                );

            if (!data) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Car not found",
                });
            }

            return data;
        }),
});
