import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TRPCReactProvider } from "@/trpc/client";

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
  title: "Brothers Car Rental",
  description: "Premium car rental experience",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      // Inject both optimized font variables into the root
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      {/* font-sans makes Inter the absolute default for everything, 
        unless explicitly overridden by font-display 
      */}
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <TooltipProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </TooltipProvider>
        <Footer />
      </body>
    </html>
  );
}