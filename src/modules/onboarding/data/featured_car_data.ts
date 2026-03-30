
export interface FeaturedCar {
    id: number;
    name: string;
    category: string;
    price: string;
    rating: string;
    image: string;
    isActive: boolean;
};

export const featuredCarData: FeaturedCar[] = [
    {
        id: 1,
        name: "Porsche 911 Carrera",
        category: "Luxury Sports",
        price: "₹12,999",
        rating: "4.9",
        image: "/images/porche-onboarding.png",
        isActive: true,
    },
    {
        id: 2,
        name: "Mercedes S-Class",
        category: "Chauffeur Choice",
        price: "₹8,500",
        rating: "5.0",
        image: "/images/porche-onboarding.png",
        isActive: false,
    },
    {
        id: 3,
        name: "Range Rover Sport",
        category: "Premium SUV",
        price: "₹10,500",
        rating: "4.8",
        image: "/images/porche-onboarding.png",
        isActive: false,
    },
    {
        id: 4,
        name: "BMW 5 Series",
        category: "Executive Sedan",
        price: "₹7,999",
        rating: "4.7",
        image: "/images/porche-onboarding.png",
        isActive: false,
    }
];