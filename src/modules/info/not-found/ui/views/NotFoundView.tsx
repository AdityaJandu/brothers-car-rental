
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, NavigationOff } from 'lucide-react';

export function NotFoundView() {
    return (
        <main className="grow flex flex-col pt-20 bg-background min-h-screen">
            <div className="grow grid grid-cols-1 lg:grid-cols-2">
                <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-24 relative z-10">
                    <div className="absolute top-1/4 -left-10 text-[15rem] font-heading font-black text-muted/30 select-none z-0 pointer-events-none">
                        404
                    </div>

                    <div className="relative z-10 max-w-xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted mb-8">
                            <NavigationOff className="w-4 h-4 text-secondary" />
                            <span className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wider">Navigation Error</span>
                        </div>

                        <h1 className="font-heading text-5xl lg:text-6xl xl:text-7xl font-bold text-primary leading-tight tracking-tight mb-6">
                            Lost in the<br />Right Direction?
                        </h1>

                        <p className="font-sans text-lg text-muted-foreground leading-relaxed mb-12 max-w-md">
                            The page you&apos;re looking for seems to have taken a different route. Let&apos;s get you back on track to your premium experience.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button asChild className="h-14 px-8 text-lg font-heading font-bold rounded-xl btn-executive-primary shadow-lg">
                                <Link href="/">
                                    Return Home
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="h-14 px-8 text-lg font-heading font-bold rounded-xl border-border/60 hover:bg-muted transition-all">
                                <Link href="/browse">
                                    Browse Fleet
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="relative h-96 lg:h-auto overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-r from-background via-transparent to-transparent z-10 w-32 hidden lg:block"></div>
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDU5gfpJV6mXB6elAZUNTvOYsjmyPJq8lcXNIhnbDSTINOOPZ3lmSc2AQVCKSgxse1r4sUXDpC4BLEqv4Lu_goePDpo0nASYynY7KQu_5C98NCXTRbSFTNdBOxYadKsctSsl_4mV05w7lvGAuyCGZzjsSJNCUlgwR1c4HnP-EDm_-QJGGZm2XF66ekWbnhs1SQwNuZ5N-6hY3oZGNn8IYY2DA4DywYu4nC7zjizcFcr70dJ_s3vQja5WgvFU-AGTOn2ufSZF2g3RwSq')"
                        }}
                    ></div>
                    <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
                </div>
            </div>
        </main>
    );
}
