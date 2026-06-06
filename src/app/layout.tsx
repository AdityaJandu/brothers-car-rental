import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TRPCReactProvider } from "@/trpc/client";
import { NuqsAdapter } from "nuqs/adapters/next";
import { Toaster } from "@/components/ui/sonner";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://www.brothersgroupindia.online"),
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
  return (
    <NuqsAdapter>
      <TRPCReactProvider>
        <html
          lang="en"
          className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
        >
          <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
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