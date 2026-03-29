
import Link from "next/link";


export function AuthHeader() {

    return (
        <header className="w-full sticky top-0 z-50 bg-muted-foreground/40 backdrop-blur-md">
            <div className="flex items-center justify-between px-6 py-5 lg:px-12 lg:py-6">

                {/* Left */}
                <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-primary font-heading tracking-tight">
                        Brothers
                    </span>
                </div>

                {/* Right CTA */}
                <Link
                    href="/"
                    className="text-sm text-muted-foreground hover:text-primary transition"
                >
                    Back to home
                </Link>
            </div>
        </header>
    );
};