import { getSession } from "@/lib/cached-session";
import { AuditLogErrorView, AuditLogLoadingView, AuditLogView } from "@/modules/admin/audit-log/ui/views/AuditLogView";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const metadata: Metadata = {
    title: "Audit Logs | FleetAdmin",
    description: "View and search the complete audit trail of all administrative actions across the system.",
};

export default async function Page() {
    // Auth guard must run BEFORE the admin-only prefetch
    // to avoid server-side errors from the adminProcedure middleware
    const session = await getSession();

    if (!session) {
        redirect("/sign-in");
    }

    if (session.user.role !== 'admin') {
        redirect('/');
    }

    // Only prefetch after confirming admin authorization
    const queryClient = getQueryClient();
    await queryClient.prefetchQuery(
        trpc.adminAudit.getAllAuditLogs.queryOptions()
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<AuditLogLoadingView />}>
                <ErrorBoundary fallback={<AuditLogErrorView />}>
                    <AuditLogView />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    )
}