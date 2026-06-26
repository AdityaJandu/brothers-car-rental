import Link from "next/link";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { getPaginationArray } from "@/lib/pagination";

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    basePath: string; // e.g. "/blog" or "/blog/tag/tips"
}

export function PaginationControls({ currentPage, totalPages, basePath }: PaginationControlsProps) {
    if (totalPages <= 1) return null;

    const pages = getPaginationArray(currentPage, totalPages);

    // Build URL helper
    const getPageUrl = (page: number) => {
        if (page === 1) return basePath;
        return `${basePath}/page/${page}`;
    };

    return (
        <nav
            role="navigation"
            aria-label="Pagination"
            className="flex items-center justify-center gap-1 mt-16"
        >
            {/* Previous */}
            <Link
                href={currentPage > 1 ? getPageUrl(currentPage - 1) : "#"}
                aria-disabled={currentPage <= 1}
                tabIndex={currentPage <= 1 ? -1 : undefined}
                className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    currentPage <= 1 && "pointer-events-none opacity-50"
                )}
                rel={currentPage > 1 ? "prev" : undefined}
                aria-label="Previous page"
            >
                <ChevronLeft className="h-5 w-5" />
            </Link>

            {/* Pages */}
            <div className="flex items-center gap-1 sm:gap-2">
                {pages.map((p, idx) => {
                    if (p === "...") {
                        return (
                            <span
                                key={`ellipsis-${idx}`}
                                className="flex h-10 w-10 items-center justify-center"
                                aria-hidden="true"
                            >
                                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                            </span>
                        );
                    }

                    const pageNum = p as number;
                    const isActive = pageNum === currentPage;

                    return (
                        <Link
                            key={`page-${pageNum}`}
                            href={getPageUrl(pageNum)}
                            aria-current={isActive ? "page" : undefined}
                            className={cn(
                                buttonVariants({
                                    variant: isActive ? "default" : "ghost",
                                    size: "icon",
                                }),
                                "w-10 h-10",
                                isActive && "pointer-events-none"
                            )}
                            aria-label={isActive ? `Page ${pageNum}` : `Go to page ${pageNum}`}
                        >
                            {pageNum}
                        </Link>
                    );
                })}
            </div>

            {/* Next */}
            <Link
                href={currentPage < totalPages ? getPageUrl(currentPage + 1) : "#"}
                aria-disabled={currentPage >= totalPages}
                tabIndex={currentPage >= totalPages ? -1 : undefined}
                className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    currentPage >= totalPages && "pointer-events-none opacity-50"
                )}
                rel={currentPage < totalPages ? "next" : undefined}
                aria-label="Next page"
            >
                <ChevronRight className="h-5 w-5" />
            </Link>
        </nav>
    );
}
