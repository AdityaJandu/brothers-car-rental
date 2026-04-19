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

    const queryClient = getQueryClient();

    const [session] = await Promise.all([
        getSession(),
        queryClient.prefetchQuery(
            trpc.adminAudit.getAllAuditLogs.queryOptions()
        ),
    ]);

    // No session, redirect to home page (or sign-in page)
    if (!session) {
        redirect("/sign-in"); // server-side redirect
    }

    if (session.user.role !== 'admin') {
        redirect('/');
    }

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