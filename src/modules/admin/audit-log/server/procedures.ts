import { db } from "@/db";
import { auditLog, user } from "@/db/schema";
import { createTRPCRouter, adminProcedure } from "@/trpc/init";
import { desc, eq, sql } from "drizzle-orm";

export const adminAuditRouter = createTRPCRouter({
    getAllAuditLogs: adminProcedure
        .query(async () => {
            const data = await db
                .select({
                    id: auditLog.id,
                    action: auditLog.action,
                    targetType: auditLog.targetType,
                    targetId: auditLog.targetId,
                    previousValue: auditLog.previousValue,
                    newValue: auditLog.newValue,
                    createdAt: auditLog.createdAt,
                    // Prefer live user data, fall back to stored audit values
                    // (handles deleted/edited admin accounts gracefully)
                    adminName: sql<string>`coalesce(${user.name}, ${auditLog.adminName})`.as("admin_name"),
                    adminEmail: sql<string>`coalesce(${user.email}, ${auditLog.adminEmail})`.as("admin_email"),
                })
                .from(auditLog)
                .leftJoin(user, eq(auditLog.adminId, user.id))
                .orderBy(desc(auditLog.createdAt))
                .limit(500);

            // Parse JSON text columns into proper objects for the frontend
            return data.map((entry) => ({
                ...entry,
                previousValue: safeParse(entry.previousValue),
                newValue: safeParse(entry.newValue),
            }));
        }),
});

/**
 * Safely parse a JSON string into an object.
 * Returns null for null/undefined, and the raw string as fallback if parsing fails.
 */
function safeParse(value: string | null): unknown {
    if (value === null || value === undefined) return null;
    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
}