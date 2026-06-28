import { ImageResponse } from "next/og";
import { PRIORITY_CITIES } from "@/lib/locations";

export const runtime = "edge";
export const alt = "Brothers Car Rental";
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ city: string }> }) {
    const { city: slug } = await params;
    const city = PRIORITY_CITIES.find((c) => c.slug === slug);

    if (!city) {
        return new ImageResponse(
            (
                <div
                    style={{
                        background: "white",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <h1>Brothers Car Rental</h1>
                </div>
            ),
            { ...size }
        );
    }

    return new ImageResponse(
        (
            <div
                style={{
                    background: "linear-gradient(to right, #1e3a8a, #3b82f6)", // Example brand gradient (Tailwind blue-900 to blue-500)
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "80px",
                    fontFamily: "sans-serif",
                }}
            >
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <p
                        style={{
                            fontSize: "32px",
                            fontWeight: 600,
                            color: "#93c5fd", // Tailwind blue-300
                            textTransform: "uppercase",
                            letterSpacing: "0.2em",
                            marginBottom: "16px",
                            margin: 0,
                        }}
                    >
                        Brothers Car Rental
                    </p>
                    <h1
                        style={{
                            fontSize: "80px",
                            fontWeight: 800,
                            color: "white",
                            margin: 0,
                            lineHeight: 1.1,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        Self Drive Cars in {city.name}
                    </h1>
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <p style={{ fontSize: "28px", color: "white", margin: 0, marginBottom: "8px" }}>
                            {city.tagline}
                        </p>
                        <p style={{ fontSize: "36px", fontWeight: 700, color: "#facc15", margin: 0 }}> {/* Tailwind yellow-400 */}
                            Starting from {city.priceRange.split(' ')[0]} / day
                        </p>
                    </div>
                    
                    <div
                        style={{
                            background: "white",
                            color: "#1e3a8a",
                            padding: "16px 32px",
                            borderRadius: "12px",
                            fontSize: "24px",
                            fontWeight: 700,
                        }}
                    >
                        Book Now
                    </div>
                </div>
            </div>
        ),
        { ...size }
    );
}
