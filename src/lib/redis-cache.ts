import { redis } from "./redis";

function getCacheNamespace(cacheKey: string): string {
    return cacheKey.split(":")[0] ?? "unknown";
}

/**
 * Helper to fetch and parse JSON data from Upstash Redis.
 */
export async function getCachedData<T>(key: string): Promise<T | null> {
    try {
        const data = await redis.get<T>(key);
        return data ?? null;
    } catch (e) {
        console.error("Redis Cache GET Error", {
            namespace: getCacheNamespace(key),
            error: e,
        });
        return null;
    }
}

/**
 * Helper to stringify and store data in Upstash Redis with a TTL.
 * Default TTL is 24 hours.
 */
export async function setCachedData<T>(key: string, data: T, ttlSeconds: number = 86400): Promise<void> {
    try {
        await redis.set(key, data, { ex: ttlSeconds });
    } catch (e) {
        console.error("Redis Cache SET Error", {
            namespace: getCacheNamespace(key),
            error: e,
        });
    }
}

/**
 * Helper to invalidate a group of cache keys based on a prefix using SCAN.
 * Useful for wildcard clearing like \`cars:*\`.
 */
export async function invalidateCacheGroup(prefix: string): Promise<void> {
    try {
        // Find all keys matching the prefix
        let cursor = 0;
        const keysToDelete: string[] = [];

        do {
            const [newCursor, keys] = await redis.scan(cursor, {
                match: `${prefix}*`,
                count: 100,
            });
            cursor = typeof newCursor === 'string' ? parseInt(newCursor, 10) : newCursor;
            if (keys && keys.length > 0) {
                keysToDelete.push(...keys);
            }
        } while (cursor !== 0);

        // Delete them if they exist
        if (keysToDelete.length > 0) {
            await redis.del(...keysToDelete);
        }
    } catch (e) {
        console.error("Redis Cache INVALIDATE Error", {
            namespace: getCacheNamespace(prefix),
            error: e,
        });
    }
}
