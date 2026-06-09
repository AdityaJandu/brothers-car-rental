"use client";

import { useEffect, useState } from "react";

export function ReadingProgressBar() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        function handleScroll() {
            const scrollY = window.scrollY;
            const documentHeight = document.documentElement.scrollHeight;
            const viewportHeight = window.innerHeight;
            const maxScroll = documentHeight - viewportHeight;

            if (maxScroll <= 0) {
                setProgress(100);
                return;
            }

            const percentage = (scrollY / maxScroll) * 100;
            setProgress(Math.min(100, Math.max(0, percentage)));
        }

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div
            className="fixed top-0 left-0 w-full h-[3px] z-50"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Reading progress"
        >
            <div
                className="h-full transition-[width] duration-100 ease-out"
                style={{
                    width: `${progress}%`,
                    backgroundColor: "var(--secondary)",
                }}
            />
        </div>
    );
}
