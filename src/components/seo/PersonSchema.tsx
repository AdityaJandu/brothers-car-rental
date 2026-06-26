export function PersonSchema() {
    const personSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Brothers Car Rental",
        url: "https://www.brothersgroupindia.online/authors/brothers-car-rental",
        image: "https://www.brothersgroupindia.online/app-logo.svg",
        jobTitle: "Mobility Experts & Fleet Managers",
        worksFor: {
            "@type": "Organization",
            name: "Brothers Car Rental"
        },
        description: "Official content team for Brothers Car Rental. We share road trip itineraries, car rental guides, and driving tips for North India."
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
    );
}
