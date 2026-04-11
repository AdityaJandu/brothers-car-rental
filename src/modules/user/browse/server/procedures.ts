import { car } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { db } from "@/db";
import z from "zod";
import { and, count, eq, getTableColumns, ilike } from "drizzle-orm";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { TRPCError } from "@trpc/server";
import { getCachedData, setCachedData } from "@/lib/redis-cache";



export const carRouter = createTRPCRouter({

    getOne: protectedProcedure
        .input(z.object({
            id: z.string()
        }))
        .query(async ({ input }) => {
            const { id } = input;

            const cacheKey = `cars:${id}`;
            const cached = await getCachedData<typeof car.$inferSelect>(cacheKey);
            if (cached) return cached;

            const [data] = await db
                .select({
                    ...getTableColumns(car),
                })
                .from(car)
                .where(eq(car.id, id));

            if (!data) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Car not found or you don't have access to it.",
                });
            }

            await setCachedData(cacheKey, data);
            return data;
        })
    ,

    getAll: protectedProcedure
        .input(z.object({
            page: z.number().default(DEFAULT_PAGE),
            pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
            search: z.string().nullish(),
        }))
        .query(async ({ input }) => {
            const { search, page, pageSize } = input;

            const cacheKey = `cars:all:page:${page}:size:${pageSize}:search:${search || "none"}`;
            const cached = await getCachedData<{ items: typeof car.$inferSelect[], total: number, totalPages: number }>(cacheKey);
            if (cached) return cached;

            // 1. Safely handle the search string. 
            // If there's a search term, wrap it in % wildcards for partial matching. 
            // If it's empty, set it to undefined so Drizzle ignores it.
            const searchCondition = search ? ilike(car.model, `%${search}%`) : undefined;

            // 2. ADD AWAIT HERE! This is what was breaking your types.
            const data = await db
                .select({
                    ...getTableColumns(car),
                })
                .from(car)
                .where(
                    and(
                        eq(car.status, "available"),
                        searchCondition,
                    )
                )
                .limit(pageSize)
                .offset((page - 1) * pageSize);

            // 3. Count total items for pagination
            const [total] = await db
                .select({
                    count: count(),
                })
                .from(car)
                .where(
                    and(
                        eq(car.status, "available"),
                        searchCondition
                    )
                );

            const totalPages = Math.ceil(total.count / pageSize);

            if (!data) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Cars not found or you don't have access to it.",
                });
            }

            const response = {
                items: data,
                total: total.count,
                totalPages,
            };

            await setCachedData(cacheKey, response);
            return response;
        }),

});