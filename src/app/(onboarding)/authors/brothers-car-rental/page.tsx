import type { Metadata } from "next";
import { InfoPageHeader } from "@/modules/info/components/InfoPageHeader";
import { InfoSection } from "@/modules/info/components/InfoSection";
import { PersonSchema } from "@/components/seo/PersonSchema";

export const metadata: Metadata = {
    title: "About the Author: Brothers Car Rental",
    description: "Official editorial team at Brothers Car Rental. Read our latest guides, road trip itineraries, and rental tips for North India.",
    alternates: {
        canonical: "https://www.brothersgroupindia.online/authors/brothers-car-rental",
    },
};

export default function AuthorPage() {
    return (
        <main className="min-h-screen pb-12">
            <PersonSchema />
            
            <InfoPageHeader
                title="Brothers Car Rental Editorial Team"
                description="Mobility Experts & Fleet Managers"
            />

            <InfoSection>
                <h2 className="text-3xl font-heading font-bold mb-6">About Us</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                    The Brothers Car Rental editorial team consists of passionate road trip enthusiasts, 
                    vehicle maintenance experts, and local travel guides. With years of experience operating 
                    a fleet of 450+ vehicles across North India, we know what makes a journey truly special.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                    Our mission is to help travelers discover the beauty of India through the freedom of 
                    self-drive. We share our insider knowledge on the best routes, hidden gems, and practical 
                    advice for renting and driving cars in cities like Dehradun, Hisar, Delhi NCR, and beyond.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                    From comparing SUVs and Sedans to providing checklists for your next monsoon road trip, 
                    our content is designed to ensure you have a safe, affordable, and memorable experience 
                    on the road.
                </p>
            </InfoSection>
        </main>
    );
}
