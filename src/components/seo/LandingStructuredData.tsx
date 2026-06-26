interface LandingStructuredDataProps {
    type: "CollectionPage" | "ItemList";
    name: string;
    description: string;
    url: string;
    items?: Array<{ name: string; url: string; image?: string }>;
}

export function LandingStructuredData({
    type,
    name,
    description,
    url,
    items,
}: LandingStructuredDataProps) {
    const schema: any = {
        "@context": "https://schema.org",
        "@type": type,
        name,
        description,
        url,
    };

    if (type === "ItemList" && items) {
        schema.itemListElement = items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
                "@type": "Thing",
                name: item.name,
                url: item.url,
                ...(item.image && { image: item.image }),
            },
        }));
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
