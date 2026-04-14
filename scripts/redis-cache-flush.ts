// scripts/redis-cache-flush.ts
import { config } from "dotenv";

config({ path: ".env" });

// scripts/flush-redis.ts
import { redis } from "../src/lib/redis"; // Adjust this to point to your actual redis.ts file

async function wipeDatabase() {
    console.log("Flushing Redis database...");
    try {
        // flushdb() clears the current database.
        // It is safer and preferred over flushall()
        await redis.flushdb();
        console.log("✅ Redis cache completely cleared!");
    } catch (error) {
        console.error("❌ Failed to clear Redis:", error);
    }
}

wipeDatabase();