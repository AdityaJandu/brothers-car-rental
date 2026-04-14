
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { car } from "@/db/schema";
import { db } from "@/db";

import { count, eq, ilike, and, getTableColumns, isNull } from "drizzle-orm";
import { DEFAULT_PAGE, MIN_PAGE_SIZE, MAX_PAGE_SIZE, DEFAULT_PAGE_SIZE } from "@/constants";
import { CarStatus } from "../types";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { getCachedData, setCachedData } from "@/lib/redis-cache";

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

            if (!data) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Car not found or you don't have access to it.",
                });
            }

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
});

