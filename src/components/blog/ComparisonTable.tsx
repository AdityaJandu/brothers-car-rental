interface ComparisonTableProps {
    /** Column header labels */
    headers: string[];
    /** 2D array of row data — each inner array matches headers length */
    rows: string[][];
}

/**
 * Responsive comparison table for blog posts.
 * Replaces raw `<table>` HTML in MDX content.
 * Styled by the existing `.blog-prose table/th/td` CSS in globals.css.
 */
export function ComparisonTable({ headers, rows }: ComparisonTableProps) {
    return (
        <div className="overflow-x-auto my-8 rounded-md border border-border">
            <table>
                <thead>
                    <tr>
                        {headers.map((header) => (
                            <th key={header}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex}>
                                    {cellIndex === 0 ? <strong>{cell}</strong> : cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
