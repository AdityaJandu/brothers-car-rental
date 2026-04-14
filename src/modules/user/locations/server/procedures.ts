import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import { db } from "@/db";
import { location } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCachedData, setCachedData } from "@/lib/redis-cache";

export const userLocationsRouter = createTRPCRouter({
    getActiveLocations: baseProcedure.query(async () => {
        const cacheKey = "locations:all:active";
        const cached = await getCachedData<{ id: string; name: string; city: string; fullAddress: string; }[]>(cacheKey);
        if (cached) return cached;

        const data = await db
            .select({
                id: location.id,
                name: location.name,
                city: location.city,
                fullAddress: location.fullAddress,
            })
            .from(location)
            .where(eq(location.isActive, true));

        await setCachedData(cacheKey, data);
        return data;
    }),
});
