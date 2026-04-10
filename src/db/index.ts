import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
    throw new Error("DATABASE_URL is not defined in environment variables");
}

const client = postgres(connectionString, {
    max: 10,               // Connection pool size
    idle_timeout: 20,      // Seconds before idle connections are closed
    connect_timeout: 10,   // Seconds to wait for a connection
    prepare: false,        // Required for Supabase transaction pooler (port 6543)
});
export const db = drizzle(client);
