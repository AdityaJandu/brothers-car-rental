import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TRPCReactProvider } from "@/trpc/client";
import { NuqsAdapter } from "nuqs/adapters/next";
import { Toaster } from "@/components/ui/sonner";
import { LocalBusinessSchema } from "@/components/seo/LocalBusinessSchema";

// Inter: For clinical, fast reading (data, labels, paragraphs)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Space Grotesk: For high-personality headers and massive numbers
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

// FUTURE: Uncomment when Hindi (hi-IN) content is available at /hi/*
// alternates: {
//   languages: {
//     'en-IN': 'https://www.brothersgroupindia.online',
//     'hi-IN': 'https://www.brothersgroupindia.online/hi',
//   },
// },

export const metadata: Metadata = {
  metadataBase: new URL("https://www.brothersgroupindia.online"),
  alternates: {
    types: {
      "application/rss+xml": "https://www.brothersgroupindia.online/rss.xml",
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ?? "",
    },
  },
  title: {
    default: "Brothers Car Rental — Car Hire in Dehradun, Hisar & Sirsa",
    template: "%s | Brothers Car Rental",
  },
  description:
    "Rent a car in Dehradun, Hisar, or Sirsa with Brothers. 450+ verified vehicles, doorstep delivery, and ₹1000 off your first booking.",
  keywords: [
    "car rental",
    "brothers car rental",
    "car hire dehradun",
    "car rental dehradun",
    "car rental hisar",
    "car rental sirsa",
    "rent a car",
    "self drive car rental india",
  ],
  authors: [{ name: "Brothers Car Rental" }],
  creator: "Brothers Car Rental",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.brothersgroupindia.online",
    siteName: "Brothers Car Rental",
    title: "Brothers Car Rental — Car Hire in Dehradun, Hisar & Sirsa",
    description:
      "Rent a car in Dehradun, Hisar, or Sirsa with Brothers. 450+ verified vehicles, doorstep delivery, and ₹1000 off your first booking.",
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Brothers Car Rental — Premium Car Hire across NCR",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brothers Car Rental — Car Hire in Dehradun, Hisar & Sirsa",
    description:
      "Rent a car in Dehradun, Hisar, or Sirsa with Brothers. 450+ verified vehicles, doorstep delivery, and ₹1000 off your first booking.",
    images: ["/images/og-default.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/app-logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Brothers Car Rental",
    alternateName: "Brothers Group India",
    url: "https://www.brothersgroupindia.online",
    logo: {
      "@type": "ImageObject",
      url: "https://www.brothersgroupindia.online/app-logo.svg",
      width: 200,
      height: 60,
    },
    telephone: "+91-9999999999", // REPLACE with actual
    email: "support@brothersgroupindia.online",
    foundingDate: "2020",
    description:
      "Brothers Car Rental offers self-drive car hire across Dehradun, Hisar, and Sirsa with 450+ verified vehicles, doorstep delivery, and rates from ₹749/day.",
    areaServed: ["Dehradun", "Hisar", "Sirsa", "Delhi NCR", "Uttarakhand", "Haryana"],
    sameAs: [
      // add actual social profile URLs here
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Brothers Car Rental HQ", // REPLACE with actual
      addressLocality: "Dehradun",
      addressRegion: "Uttarakhand",
      postalCode: "248001",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-9999999999", // REPLACE with actual
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
      contactOption: "TollFree",
    },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Brothers Car Rental",
    url: "https://www.brothersgroupindia.online",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://www.brothersgroupindia.online/browse?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <NuqsAdapter>
      <TRPCReactProvider>
        <html
          lang="en"
          className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
        >
          <head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://giqenkioglreapfhfcyg.supabase.co" crossOrigin="anonymous" />
            <link rel="preconnect" href="https://images.pexels.com" crossOrigin="anonymous" />
            <link rel="dns-prefetch" href="https://images.pexels.com" />
          </head>
          <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
            />
            <LocalBusinessSchema />
            <TooltipProvider>
              {children}
            </TooltipProvider>
            <Toaster />
          </body>
        </html>
      </TRPCReactProvider>
    </NuqsAdapter>
  );
}