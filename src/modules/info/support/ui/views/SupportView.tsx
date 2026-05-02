

import { InfoSection } from '../../../components/InfoSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Calendar, Car, CreditCard, Shield, MessageSquare, FileText, Phone, Mail } from 'lucide-react';
import Image from 'next/image';

export function SupportView() {
    return (
        <main className="min-h-screen pt-20">
            <InfoSection>
                {/* Hero Section */}
                <div className="relative bg-primary rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row items-center min-h-[450px] shadow-ambient mb-24">
                    <div className="p-12 md:p-20 z-10 w-full md:w-3/5 flex flex-col justify-center">
                        <h1 className="font-heading text-4xl md:text-6xl text-white font-bold tracking-tight mb-6 leading-[1.1]">
                            How can we<br />help you drive?
                        </h1>
                        <p className="font-sans text-white/70 text-lg mb-10 max-w-md">
                            Search our extensive knowledge base or connect with our concierge team for immediate assistance.
                        </p>
                        <div className="relative group max-w-xl">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-secondary transition-colors w-5 h-5" />
                            <Input
                                className="h-16 bg-white/10 border-none text-white placeholder:text-white/40 pl-14 pr-6 rounded-2xl focus-visible:ring-secondary/50 focus-visible:bg-white/15 transition-all text-lg"
                                placeholder="Search for booking, insurance, or fleet details..."
                            />
                        </div>
                    </div>

                    <div className="absolute right-0 top-0 w-full md:w-2/5 h-full hidden md:block">
                        <Image
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAY0lEz15G9liVtx12gKTaTqGP0v4lBpllg7zXLF8HUloW1nWypPrx8PUscNZczKD59agUiq2-Ys1rWqWXADY6lI3UKi9opbedhgUW2nC9mjRgEgu4hBOX7vJFE3q1Dc2fxFVhD8aGB8ymZ50DnA7SRfHaev7liztC2Ppk39rN0Jzwm0e65kgrRl36yaqnnEyxMg95yXVPAkC8ippkj_f_Kt6U0ltvzN5lGrmf4y2Jo3fLK7JxKGzXo0McfJzK6jMLPRx7EtCAIKOfP"
                            className="w-full h-full object-cover"
                            alt="Support"
                            width={1280}
                            height={720}
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/40 to-transparent"></div>
                    </div>
                </div>

                {/* Categories */}
                <div className="mb-24">
                    <h2 className="font-heading text-3xl font-bold text-primary mb-12">Common Topics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <CategoryCard
                            icon={<Calendar className="w-6 h-6" />}
                            title="Booking & Reservations"
                            description="Managing your upcoming trips, cancellations, and modifications."
                        />
                        <CategoryCard
                            icon={<Car className="w-6 h-6" />}
                            title="The Fleet"
                            description="Vehicle specifications, features, and operational guides."
                        />
                        <CategoryCard
                            icon={<CreditCard className="w-6 h-6" />}
                            title="Payments & Billing"
                            description="Invoices, payment methods, deposits, and refunds."
                        />
                        <CategoryCard
                            icon={<Shield className="w-6 h-6" />}
                            title="Insurance & Protection"
                            description="Coverage options, damage reports, and roadside assistance."
                        />
                    </div>
                </div>

                {/* Direct Help */}
                <div className="bg-muted rounded-[2.5rem] p-8 md:p-16 flex flex-col lg:flex-row gap-16 items-center shadow-sm">
                    <div className="lg:w-1/2">
                        <h2 className="font-heading text-3xl md:text-5xl font-bold text-primary mb-8 leading-tight">
                            Need Direct Assistance?
                        </h2>
                        <p className="font-sans text-muted-foreground text-lg mb-10 max-w-xl leading-relaxed">
                            Our concierge team is available around the clock to ensure your experience is nothing short of exceptional. Connect with us instantly or submit a detailed request.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button className="h-14 px-8 text-lg font-heading font-bold rounded-xl btn-executive-primary">
                                <MessageSquare className="mr-2 w-5 h-5" />
                                Start Live Chat
                            </Button>
                            <Button variant="outline" className="h-14 px-8 text-lg font-heading font-bold rounded-xl border-border/60 hover:bg-white transition-all">
                                <FileText className="mr-2 w-5 h-5" />
                                Submit a Ticket
                            </Button>
                        </div>
                    </div>

                    <div className="lg:w-1/2 w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <ContactMethodCard
                            icon={<Phone className="w-8 h-8 fill-current" />}
                            title="Call Us"
                            subtitle="Available 24/7"
                            value="+1 (800) 123-4567"
                            href="tel:+18001234567"
                        />
                        <ContactMethodCard
                            icon={<Mail className="w-8 h-8 fill-current" />}
                            title="Email Us"
                            subtitle="Response within 2 hours"
                            value="support@brothers.com"
                            href="mailto:support@brothers.com"
                        />
                    </div>
                </div>
            </InfoSection>
        </main>
    );
}

function CategoryCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="group bg-card p-8 rounded-3xl border border-transparent hover:border-border/40 hover:shadow-ambient transition-all duration-300 flex flex-col h-full">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                {icon}
            </div>
            <h3 className="font-heading text-xl font-bold text-primary mb-4">{title}</h3>
            <p className="font-sans text-muted-foreground text-sm leading-relaxed mb-8 flex-grow">{description}</p>
            <div className="flex items-center gap-2 text-secondary font-bold text-sm cursor-pointer hover:gap-3 transition-all">
                View Articles <ArrowRight className="w-4 h-4" />
            </div>
        </div>
    );
}

function ContactMethodCard({ icon, title, subtitle, value, href }: { icon: React.ReactNode, title: string, subtitle: string, value: string, href: string }) {
    return (
        <div className="bg-card p-8 rounded-3xl flex flex-col items-center text-center shadow-sm border border-border/20">
            <div className="text-primary mb-6">{icon}</div>
            <h4 className="font-heading font-bold text-primary mb-1 text-lg">{title}</h4>
            <p className="font-sans text-xs text-muted-foreground mb-4 uppercase tracking-wider">{subtitle}</p>
            <a className="font-heading font-bold text-secondary text-lg hover:underline transition-all" href={href}>
                {value}
            </a>
        </div>
    );
}

function ArrowRight(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    )
}
