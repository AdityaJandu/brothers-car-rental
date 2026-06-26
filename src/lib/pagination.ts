export const POSTS_PER_PAGE = 12;

/**
 * Calculates the total number of pages required for a given number of items.
 */
export function getPageCount(totalItems: number, limit: number = POSTS_PER_PAGE): number {
    return Math.max(1, Math.ceil(totalItems / limit));
}

/**
 * Returns a subset of items for the specified page.
 * Page is 1-indexed.
 */
export function paginatePosts<T>(items: T[], currentPage: number, limit: number = POSTS_PER_PAGE): T[] {
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    return items.slice(startIndex, endIndex);
}

/**
 * Generates an array of page numbers to display in pagination controls.
 * Uses '...' for gaps. Example: [1, 2, 3, '...', 8, 9, 10]
 */
export function getPaginationArray(currentPage: number, totalPages: number): (number | string)[] {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
            range.push(i);
        }
    }

    for (const i of range) {
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1);
            } else if (i - l !== 1) {
                rangeWithDots.push("...");
            }
        }
        rangeWithDots.push(i);
        l = i;
    }

    return rangeWithDots;
}
