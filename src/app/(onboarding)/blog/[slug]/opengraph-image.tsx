import { ImageResponse } from "next/og";
import { getMdxPost } from "@/lib/mdx";

// Use default nodejs runtime to allow fs/path imports
// export const runtime = "edge";
export const alt = "Brothers Car Rental Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getMdxPost(slug);

    if (!post) {
        return new ImageResponse(
            (
                <div
                    style={{
                        fontSize: 128,
                        background: "white",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    Brothers Car Rental
                </div>
            ),
            { ...size }
        );
    }

    const { metadata: meta } = post;

    return new ImageResponse(
        (
            <div
                style={{
                    background: "linear-gradient(to bottom right, #111827, #000000)",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: "80px",
                    fontFamily: "sans-serif",
                }}
            >
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div style={{ display: "flex", gap: "16px" }}>
                        {meta.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                style={{
                                    backgroundColor: "#ffffff20",
                                    color: "white",
                                    padding: "8px 16px",
                                    borderRadius: "8px",
                                    fontSize: 24,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.1em",
                                }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                    <h1
                        style={{
                            fontSize: 72,
                            fontWeight: 900,
                            color: "white",
                            lineHeight: 1.2,
                            margin: 0,
                            maxWidth: "1000px",
                        }}
                    >
                        {meta.title}
                    </h1>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "24px",
                            color: "#9ca3af",
                            fontSize: 32,
                            marginTop: "32px",
                        }}
                    >
                        <span>Brothers Car Rental</span>
                        <span>•</span>
                        <span>
                            {new Date(meta.publishedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </span>
                    </div>
                </div>
            </div>
        ),
        { ...size }
    );
}
