export interface CityConfig {
    // Core identity
    slug: string;
    name: string;
    state: string;
    region: string; // e.g. "North India", "Uttarakhand Hills" — used in prose

    // SEO metadata
    metaTitle: string;         // Exact <title> tag — don't let it auto-generate
    metaDescription: string;   // Max 160 chars for SERP snippet
    tagline: string;           // Used as H1 subtitle on the page

    // Page content — this is what actually ranks
    heroDescription: string;   // 2-3 sentences shown above the fold
    bodyContent: string;       // 200-300 words of unique location-specific prose
                               // written for humans, not bots. Include local landmarks,
                               // why someone rents here, what they do next.

    // Business data
    latitude: number;
    longitude: number;
    phone: string;             // Real number or shared constant — never placeholder
    startingPrice: number;     // Base price for rendering
    priceRange: string;
    deliveryHubs: string[];

    // Content modules
    faqItems: Array<{
        question: string;
        answer: string;
    }>;

    // Internal linking
    relatedBlogSlugs: string[]; // Slugs from your existing 100 posts
    popularRoutes: Array<{
        destination: string;
        distance: string;
        driveTime: string;
        blogSlug?: string;      // Link to your existing route guide if it exists
    }>;

    // Images
    ogImage?: string;           // /images/cities/dehradun-og.jpg etc.
    heroImage?: string;         // Above-the-fold hero image for the page
}

export const COMPANY_PHONE = "+91 98765 43210";

export const PRIORITY_CITIES: CityConfig[] = [
    {
        slug: "dehradun",
        name: "Dehradun",
        state: "Uttarakhand",
        region: "Garhwal Himalayan Foothills",

        metaTitle: "Self Drive Car Rental in Dehradun — From ₹749/day | Brothers",
        metaDescription: "Rent a self-drive car in Dehradun from ₹749/day. Pick up at Jolly Grant Airport or Railway Station. SUVs for Mussoorie, Rishikesh & Char Dham. Book online.",

        tagline: "Your Gateway to the Garhwal Himalayas",
        heroDescription: "Dehradun sits at the edge of the Shivalik hills, giving you direct highway access to Mussoorie (35 km), Rishikesh (43 km), and Haridwar (55 km). A self-drive rental car is the fastest, most flexible way to explore Uttarakhand on your own terms — no bus schedules, no shared jeep negotiations.",

        bodyContent: `Dehradun's geography makes it unique: every road out of the city leads somewhere extraordinary. The Mussoorie Road winds up 15 hairpin bends to the Queen of Hills. NH7 flows flat and fast to the yoga capital of the world at Rishikesh. The Chakrata road cuts through ancient deodar forests to a cantonment town few tourists have found.

Brothers Car Rental operates from three strategic Dehradun pickup points — Jolly Grant Airport, Dehradun Railway Station, and Rajpur Road — so you have a car waiting the moment you arrive, not after a 45-minute taxi ride into town.

Our Dehradun fleet is specifically curated for Uttarakhand's terrain. Compact SUVs with high ground clearance for Mussoorie hairpins, diesel-powered full-size SUVs with genuine hill-climbing torque for longer routes to Auli and Chopta, and budget hatchbacks for those who just need to move around the Doon valley efficiently.

All vehicles include FASTag pre-installed, comprehensive insurance, and 24/7 roadside assistance — critical on mountain routes where help can take time to arrive.`,

        latitude: 30.3165,
        longitude: 78.0322,
        phone: COMPANY_PHONE,
        startingPrice: 749,
        priceRange: "₹749 – ₹5,999/day",
        deliveryHubs: [
            "Jolly Grant Airport (DED)",
            "Dehradun Railway Station",
            "Rajpur Road",
            "Clock Tower / City Centre"
        ],

        faqItems: [
            {
                question: "Can I rent a car at Jolly Grant Airport in Dehradun?",
                answer: "Yes. Brothers Car Rental offers direct airport pickup at Jolly Grant Airport (DED). Book online and our coordinator will meet you in the airport parking area within 10 minutes of you landing. No queues, no counters — just keys and a car."
            },
            {
                question: "What car should I rent for a Mussoorie trip from Dehradun?",
                answer: "A compact SUV is the ideal choice for Dehradun to Mussoorie. The 35 km ascent involves approximately 15 hairpin bends and moderate gradients where an SUV's torque and ground clearance make a noticeable difference. Sedans can manage the route but feel strained with 4 passengers."
            },
            {
                question: "Is a self-drive car available for the Char Dham Yatra from Dehradun?",
                answer: "Yes. We offer 10-14 day unlimited kilometre packages specifically designed for the Char Dham circuit from Dehradun/Haridwar. Only full-size diesel SUVs are recommended for the 1,500+ km mountain circuit covering Badrinath, Kedarnath, Gangotri, and Yamunotri."
            },
            {
                question: "What is the security deposit for car rental in Dehradun?",
                answer: "Security deposits range from ₹5,000 for hatchbacks to ₹25,000 for full-size SUVs. Payable via UPI, debit card, or credit card. Fully refunded within 24-48 hours (UPI) or 5-7 days (card) after clean vehicle return."
            }
        ],

        relatedBlogSlugs: [
            "car-rental-dehradun-complete-guide",
            "car-rental-jolly-grant-airport-dehradun",
            "best-road-trips-from-dehradun",
            "best-suv-rentals-dehradun-fleet",
            "dehradun-to-mussoorie-quick-drive",
            "dehradun-to-auli-road-trip",
            "weekend-getaways-from-dehradun-by-car"
        ],

        popularRoutes: [
            { destination: "Mussoorie", distance: "35 km", driveTime: "1.5 hrs", blogSlug: "dehradun-to-mussoorie-quick-drive" },
            { destination: "Rishikesh", distance: "43 km", driveTime: "1 hr", blogSlug: "dehradun-to-rishikesh-day-trip" },
            { destination: "Haridwar", distance: "55 km", driveTime: "1.5 hrs", blogSlug: "delhi-to-haridwar-road-trip" },
            { destination: "Auli", distance: "296 km", driveTime: "10 hrs", blogSlug: "dehradun-to-auli-road-trip" },
            { destination: "Nainital", distance: "295 km", driveTime: "7 hrs", blogSlug: "dehradun-to-nainital-road-trip" }
        ],

        ogImage: "/images/cities/dehradun-og.jpg",
        heroImage: "/images/cities/dehradun-hero.jpg"
    },
    {
        slug: "hisar",
        name: "Hisar",
        state: "Haryana",
        region: "North India",

        metaTitle: "Self Drive Car Rental in Hisar — Verified Fleet | Brothers",
        metaDescription: "Rent a self-drive car in Hisar from ₹749/day. Hatchbacks, Sedans, and SUVs available. Doorstep delivery across Hisar. Book your ride online.",

        tagline: "Premium Car Rental in Haryana's Steel City",
        heroDescription: "Whether you need a quick run around town or are planning a family road trip from Hisar, Brothers Car Rental offers the most reliable fleet of self-drive vehicles in the region. We provide fully sanitized cars with comprehensive insurance.",

        bodyContent: `Hisar serves as a major commercial and educational hub in Haryana. Navigating the city and surrounding districts is much easier with your own self-drive vehicle, avoiding the hassle of booking cabs or relying on public transport.

Brothers Car Rental offers convenient pickup and drop-off options across Hisar, including major residential and commercial areas. Our fleet ranges from fuel-efficient hatchbacks for daily commuting to spacious SUVs like the Mahindra Scorpio or Toyota Innova, perfect for outstation trips with extended family.

We pride ourselves on maintaining our vehicles in pristine condition. Every car undergoes a thorough mechanical check and deep cleaning before being handed over. With zero hidden charges and transparent billing, you can focus on the drive while we handle the rest.`,

        latitude: 29.1492,
        longitude: 75.7217,
        phone: COMPANY_PHONE,
        startingPrice: 749,
        priceRange: "₹749 – ₹5,999/day",
        deliveryHubs: [
            "Camp Chowk",
            "Hisar Railway Station",
            "Sector 14",
            "Jindal Chowk"
        ],

        faqItems: [
            {
                question: "Do you offer doorstep delivery in Hisar?",
                answer: "Yes, we provide doorstep delivery across all major sectors and neighborhoods in Hisar. Additional delivery charges may apply depending on the exact distance from our central hub."
            },
            {
                question: "What documents are required to rent a car in Hisar?",
                answer: "You need a valid Indian driving license, an Aadhar card (or valid ID proof), and a credit/debit card or UPI for the security deposit. The minimum age to rent is 21 years."
            }
        ],

        relatedBlogSlugs: [
            "hisar-to-delhi-road-trip-guide",
            "best-places-to-visit-near-hisar"
        ],

        popularRoutes: [
            { destination: "Delhi", distance: "165 km", driveTime: "3.5 hrs" },
            { destination: "Chandigarh", distance: "235 km", driveTime: "4.5 hrs" },
            { destination: "Jaipur", distance: "320 km", driveTime: "6 hrs" }
        ],

        ogImage: "/images/cities/hisar-og.jpg",
        heroImage: "/images/cities/hisar-hero.jpg"
    },
    {
        slug: "sirsa",
        name: "Sirsa",
        state: "Haryana",
        region: "North India",

        metaTitle: "Self Drive Car Rental in Sirsa — Book Online | Brothers",
        metaDescription: "Looking for a self-drive car in Sirsa? Brothers Car Rental offers top-quality vehicles starting from ₹749/day. Easy booking, verified fleet, and 24/7 support.",

        tagline: "Your Trusted Mobility Partner in Sirsa",
        heroDescription: "Experience the ultimate freedom of mobility in Sirsa with Brothers Car Rental. From compact cars to luxury SUVs, we have the perfect vehicle for your business trip, family vacation, or daily commute.",

        bodyContent: `Renting a self-drive car in Sirsa has never been easier. Brothers Car Rental brings a seamless, digital-first booking experience to the city, ensuring you get on the road quickly and without unnecessary paperwork.

Our Sirsa fleet is tailored to meet diverse needs. Need to visit nearby agricultural centers or industrial areas? Our rugged SUVs can handle any terrain. Planning a family trip to Rajasthan or Punjab? Our spacious MUVs and sedans ensure comfort for everyone. 

We guarantee the best rates in Sirsa, backed by a commitment to quality and safety. Each vehicle is equipped with modern safety features and comes with comprehensive roadside assistance so you can travel with complete peace of mind.`,

        latitude: 29.5336,
        longitude: 75.0177,
        phone: COMPANY_PHONE,
        startingPrice: 749,
        priceRange: "₹749 – ₹5,999/day",
        deliveryHubs: [
            "Barnala Road",
            "Sirsa Railway Station",
            "Begu Road",
            "Dabwali Road"
        ],

        faqItems: [
            {
                question: "Is there a mileage limit on car rentals in Sirsa?",
                answer: "We offer multiple packages. You can choose from limited kilometer plans (e.g., 120 km/day) for local use or unlimited kilometer plans for outstation road trips."
            },
            {
                question: "Can I take the rental car from Sirsa to other states?",
                answer: "Yes, our cars come with All-India tourist permits. However, state border taxes and tolls are to be borne by the customer when crossing state borders."
            }
        ],

        relatedBlogSlugs: [
            "sirsa-to-amritsar-weekend-trip",
            "car-rental-tips-for-first-timers"
        ],

        popularRoutes: [
            { destination: "Amritsar", distance: "260 km", driveTime: "5 hrs" },
            { destination: "Bikaner", distance: "280 km", driveTime: "5.5 hrs" },
            { destination: "Ludhiana", distance: "200 km", driveTime: "4 hrs" }
        ],

        ogImage: "/images/cities/sirsa-og.jpg",
        heroImage: "/images/cities/sirsa-hero.jpg"
    },
    {
        slug: "noida",
        name: "Noida",
        state: "Uttar Pradesh",
        region: "Delhi NCR",

        metaTitle: "Self Drive Car Rental in Noida — Doorstep Delivery | Brothers",
        metaDescription: "Rent self-drive cars in Noida starting at ₹749/day. Wide range of hatchbacks, sedans, and SUVs. Doorstep delivery across Sector 15 to Greater Noida.",

        tagline: "Drive on Your Own Terms in Delhi NCR",
        heroDescription: "Navigate Noida's wide expressways and bustling sectors with ease. Brothers Car Rental provides premium, well-maintained self-drive cars tailored for urban commuting and weekend getaways from the NCR region.",

        bodyContent: `Noida's infrastructure is built for driving. With the Yamuna Expressway starting right here and wide arterial roads connecting every sector, having a self-drive car is the most efficient way to travel, whether you're commuting to Sector 62 or heading to Agra for the weekend.

Brothers Car Rental operates extensively across Noida and Greater Noida. We offer doorstep delivery to residential societies, office parks, and major transit hubs. Our NCR fleet is predominantly composed of modern, feature-rich vehicles with automatic transmissions to handle city traffic effortlessly.

For those planning longer trips out of Noida to the hills of Uttarakhand or the deserts of Rajasthan, our well-maintained SUVs offer the reliability and comfort you need. All our cars are equipped with FASTag and comprehensive insurance.`,

        latitude: 28.5355,
        longitude: 77.3910,
        phone: COMPANY_PHONE,
        startingPrice: 899,
        priceRange: "₹899 – ₹6,499/day",
        deliveryHubs: [
            "Sector 15 / 16",
            "Sector 62",
            "Greater Noida West (Noida Extension)",
            "Botanical Garden Metro"
        ],

        faqItems: [
            {
                question: "Do you deliver cars to Greater Noida?",
                answer: "Yes, we provide doorstep delivery to Greater Noida and Noida Extension (Greater Noida West)."
            },
            {
                question: "Can I drop off the car at a different location in Delhi NCR?",
                answer: "Currently, cars must be returned to the same city hub they were rented from. Drop-offs at alternate locations within Noida are permitted with prior arrangement."
            }
        ],

        relatedBlogSlugs: [
            "noida-to-agra-yamuna-expressway",
            "weekend-trips-from-noida"
        ],

        popularRoutes: [
            { destination: "Agra", distance: "190 km", driveTime: "3 hrs", blogSlug: "noida-to-agra-yamuna-expressway" },
            { destination: "Jaipur", distance: "290 km", driveTime: "5.5 hrs" },
            { destination: "Dehradun", distance: "250 km", driveTime: "5 hrs" }
        ],

        ogImage: "/images/cities/noida-og.jpg",
        heroImage: "/images/cities/noida-hero.jpg"
    },
    {
        slug: "gurgaon",
        name: "Gurgaon",
        state: "Haryana",
        region: "Delhi NCR",

        metaTitle: "Self Drive Car Rental in Gurgaon — Premium Fleet | Brothers",
        metaDescription: "Looking for a car rental in Gurgaon? Book a self-drive car from Brothers Car Rental. Best rates, new cars, and doorstep delivery across Gurugram.",

        tagline: "Premium Mobility for the Millennium City",
        heroDescription: "Experience the convenience of a personal car without the overhead of ownership. Brothers Car Rental offers a wide selection of self-drive vehicles in Gurgaon, perfect for corporate executives, expats, and weekend travelers.",

        bodyContent: `Gurgaon (Gurugram) is a fast-paced corporate hub where mobility is key. Whether you have back-to-back meetings in Cyber City, a commute to Golf Course Road, or weekend plans to escape the city, Brothers Car Rental has the right vehicle for you.

We understand that time is valuable for our Gurgaon customers. That's why we've streamlined our booking process to be entirely digital, with prompt doorstep delivery to your office or apartment complex. Our fleet includes premium sedans and automatic hatchbacks, ideal for navigating peak hour traffic in comfort.

Planning a road trip? Gurgaon is perfectly positioned for drives to Rajasthan or the lower Himalayas. Rent one of our rugged SUVs for your next adventure and enjoy unlimited kilometer options and comprehensive roadside assistance.`,

        latitude: 28.4595,
        longitude: 77.0266,
        phone: COMPANY_PHONE,
        startingPrice: 899,
        priceRange: "₹899 – ₹6,999/day",
        deliveryHubs: [
            "Cyber City",
            "Golf Course Road",
            "IFFCO Chowk",
            "Sohna Road"
        ],

        faqItems: [
            {
                question: "Do you offer long-term monthly car rentals in Gurgaon?",
                answer: "Yes, we offer highly discounted rates for monthly car subscriptions. This is perfect for corporate executives or those awaiting delivery of a new personal vehicle."
            },
            {
                question: "Are automatic cars available in Gurgaon?",
                answer: "Absolutely. A significant portion of our Gurgaon fleet consists of automatic transmission vehicles, ranging from compact hatchbacks to premium SUVs."
            }
        ],

        relatedBlogSlugs: [
            "gurgaon-to-jaipur-road-trip",
            "best-weekend-getaways-from-gurgaon"
        ],

        popularRoutes: [
            { destination: "Jaipur", distance: "240 km", driveTime: "4.5 hrs", blogSlug: "gurgaon-to-jaipur-road-trip" },
            { destination: "Udaipur", distance: "630 km", driveTime: "11 hrs" },
            { destination: "Shimla", distance: "360 km", driveTime: "8 hrs" }
        ],

        ogImage: "/images/cities/gurgaon-og.jpg",
        heroImage: "/images/cities/gurgaon-hero.jpg"
    },
    {
        slug: "chandigarh",
        name: "Chandigarh",
        state: "Chandigarh",
        region: "North India",

        metaTitle: "Self Drive Car Rental in Chandigarh — Best Prices | Brothers",
        metaDescription: "Rent a car in Chandigarh. Drive yourself with Brothers Car Rental's premium fleet. Perfect for local travel and trips to Manali, Shimla & Kasol.",

        tagline: "The Perfect Starting Point for Your Himalayan Adventure",
        heroDescription: "Chandigarh is the gateway to Himachal Pradesh. Start your mountain road trip right with a robust, well-maintained self-drive SUV from Brothers Car Rental. Pick up directly from the airport or railway station.",

        bodyContent: `Chandigarh's well-planned sectors and wide avenues make driving a pleasure. However, the real adventure begins when you leave the city limits. As the primary launchpad for trips into Himachal Pradesh, Chandigarh is where your Himalayan road trip truly begins.

Brothers Car Rental offers a fleet in Chandigarh that is specifically tailored for mountain driving. We highly recommend our high-ground-clearance SUVs equipped with powerful engines to confidently tackle the steep gradients and hairpin bends of the roads to Manali, Spiti, and Shimla.

For those staying within the city, our hatchbacks and sedans provide a comfortable and economical way to navigate between the sectors, visit the Rock Garden, or drive down to Sukhna Lake. Enjoy the freedom of the open road with zero hidden fees.`,

        latitude: 30.7333,
        longitude: 76.7794,
        phone: COMPANY_PHONE,
        startingPrice: 849,
        priceRange: "₹849 – ₹6,499/day",
        deliveryHubs: [
            "Chandigarh Airport (IXC)",
            "Chandigarh Railway Station",
            "Sector 17",
            "Sector 43 Bus Stand"
        ],

        faqItems: [
            {
                question: "Can I rent a car at Chandigarh Airport?",
                answer: "Yes, we offer direct airport delivery at Shaheed Bhagat Singh International Airport (IXC). Just share your flight details during booking."
            },
            {
                question: "Are your cars equipped for driving in snow in Himachal?",
                answer: "Our SUVs are well-maintained and capable, but driving in heavy snow requires specialized skills and sometimes snow chains (which are not standard equipment). Always check road conditions before heading to high altitudes in winter."
            }
        ],

        relatedBlogSlugs: [
            "chandigarh-to-manali-road-trip",
            "chandigarh-to-shimla-weekend-guide"
        ],

        popularRoutes: [
            { destination: "Shimla", distance: "110 km", driveTime: "3.5 hrs", blogSlug: "chandigarh-to-shimla-weekend-guide" },
            { destination: "Manali", distance: "300 km", driveTime: "8 hrs", blogSlug: "chandigarh-to-manali-road-trip" },
            { destination: "Dharamshala", distance: "240 km", driveTime: "5.5 hrs" }
        ],

        ogImage: "/images/cities/chandigarh-og.jpg",
        heroImage: "/images/cities/chandigarh-hero.jpg"
    },
    {
        slug: "jaipur",
        name: "Jaipur",
        state: "Rajasthan",
        region: "North India",

        metaTitle: "Self Drive Car Rental in Jaipur — Explore Rajasthan | Brothers",
        metaDescription: "Rent a self-drive car in Jaipur. Explore the Pink City and beyond with Brothers Car Rental. Affordable daily and weekly rates. Book online now.",

        tagline: "Discover the Pink City and Beyond",
        heroDescription: "Experience the royal heritage of Rajasthan at your own pace. With a self-drive car from Brothers Car Rental in Jaipur, you can explore hidden forts, majestic palaces, and the vibrant culture of the desert state without relying on taxis.",

        bodyContent: `Jaipur is a sprawling city where attractions are spread far apart. Having a self-drive car allows you to seamlessly move from the Amber Fort in the morning to the City Palace in the afternoon, and catch the sunset at Nahargarh Fort, all on your own schedule.

Brothers Car Rental provides a reliable and diverse fleet in Jaipur. Choose a compact car to navigate the narrow, bustling streets of the old Pink City, or rent a spacious SUV for longer excursions out into the Thar Desert, visiting places like Pushkar, Jodhpur, or Udaipur.

Our vehicles are thoroughly cleaned, regularly serviced, and come with unlimited kilometer options so you can explore Rajasthan's vast highways without watching the odometer. We offer easy pickups from Jaipur Junction and the airport.`,

        latitude: 26.9124,
        longitude: 75.7873,
        phone: COMPANY_PHONE,
        startingPrice: 799,
        priceRange: "₹799 – ₹6,499/day",
        deliveryHubs: [
            "Jaipur International Airport (JAI)",
            "Jaipur Junction Railway Station",
            "Sindhi Camp",
            "Malviya Nagar"
        ],

        faqItems: [
            {
                question: "Is it easy to drive in Jaipur?",
                answer: "Yes, Jaipur has well-maintained main roads. However, the old city (Pink City) can be congested, so driving a compact car is often easier there. The highways connecting Jaipur to other Rajasthan cities are excellent."
            },
            {
                question: "Do you provide cars for one-way trips from Jaipur to Delhi?",
                answer: "We primarily offer round-trip rentals. One-way rentals are subject to availability and incur a significant drop-off fee. Please contact our support team to check availability."
            }
        ],

        relatedBlogSlugs: [
            "jaipur-city-tour-by-car",
            "jaipur-to-udaipur-road-trip"
        ],

        popularRoutes: [
            { destination: "Pushkar", distance: "145 km", driveTime: "3 hrs" },
            { destination: "Udaipur", distance: "390 km", driveTime: "7 hrs", blogSlug: "jaipur-to-udaipur-road-trip" },
            { destination: "Jodhpur", distance: "330 km", driveTime: "6 hrs" }
        ],

        ogImage: "/images/cities/jaipur-og.jpg",
        heroImage: "/images/cities/jaipur-hero.jpg"
    }
];
