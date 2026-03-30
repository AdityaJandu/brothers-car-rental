import { car } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { db } from "@/db";
import z from "zod";
import { and, count, desc, eq, getTableColumns, ilike, inArray, sql } from "drizzle-orm";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";



export const carRouterUser = createTRPCRouter({

    getAll: protectedProcedure
        .input(z.object({
            page: z.number().default(1),
            pageSize: z.number().min(1).max(100).default(10),
            search: z.string().nullish(),
        }))
        .query(async ({ input }) => {
            const { search, page, pageSize } = input;

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
                        searchCondition // Safely inject the condition
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

            return {
                items: data,
                total: total.count,
                totalPages,
            };
        }),
});