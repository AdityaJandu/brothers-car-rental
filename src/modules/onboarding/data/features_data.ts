import { Banknote, ShieldCheck, Headset, Leaf } from "lucide-react";

export const featuresData = [
    {
        id: 1,
        title: "Affordable Pricing",
        description: "Premium experience at competitive market rates.",
        icon: Banknote,
        isDark: false,
    },
    {
        id: 2,
        title: "Verified Vehicles",
        description: "Every car undergoes a 200-point safety check.",
        icon: ShieldCheck,
        isDark: true, // Triggers the Deep Navy styling
    },
    {
        id: 3,
        title: "24/7 Support",
        description: "Dedicated concierge team for your every need.",
        icon: Headset,
        isDark: false,
    },
    {
        id: 4,
        title: "Eco Fleet",
        description: "Sustainable options with our hybrid & EV range.",
        icon: Leaf, // Using Leaf to represent sustainability
        isDark: false,
    }
];