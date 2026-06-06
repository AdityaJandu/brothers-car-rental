import Link from 'next/link';
import { Award, Globe } from 'lucide-react';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="hidden md:block w-full bg-primary pt-16 pb-24 md:pb-8 px-6 lg:px-12 text-white">
            <div className="max-w-7xl mx-auto">

                {/* --- Top Grid --- */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">

                    {/* Brand & Description (Takes up half the space on desktop) */}
                    <div className="md:col-span-6 lg:col-span-8">
                        <Link href="/" className="text-2xl font-bold font-heading tracking-tight mb-4 block">
                            Brothers
                        </Link>
                        <p className="text-white/70 text-sm leading-relaxed max-w-sm mb-8">
                            Elevating the standards of car rental in India through
                            curated precision and executive service.
                        </p>

                        {/* Badges/Icons */}
                        <div className="flex items-center gap-3">
                            <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Quality Standard">
                                <Award className="w-5 h-5 text-white" />
                            </button>
                            <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Global Reach">
                                <Globe className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Company Links */}
                    <div className="md:col-span-3 lg:col-span-2">
                        <h4 className="font-bold text-base mb-6 font-heading">Company</h4>
                        <ul className="flex flex-col gap-4 text-sm text-white/70">
                            <li><Link href="/browse" className="hover:text-white transition-colors">Browse Cars</Link></li>
                            <li><Link href="/locations" className="hover:text-white transition-colors">Locations</Link></li>
                            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div className="md:col-span-3 lg:col-span-2">
                        <h4 className="font-bold text-base mb-6 font-heading">Support</h4>
                        <ul className="flex flex-col gap-4 text-sm text-white/70">
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                            <li><Link href="/support" className="hover:text-white transition-colors">Support Center</Link></li>
                            <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                        </ul>
                    </div>

                </div>

                {/* --- Bottom Divider & Copyright --- */}
                {/* The border uses 10% white opacity for the "Ghost Border" feel */}
                <div className="border-t border-white/10 pt-8 text-center">
                    <p className="text-sm text-white/50">
                        © {currentYear} Brothers Car Rental. The Curated Precision.
                    </p>
                </div>

            </div>
        </footer>
    );
}