
import { InfoPageHeader } from '../../../components/InfoPageHeader';
import { InfoSection } from '../../../components/InfoSection';
import { Shield, Award, Users, Gem } from 'lucide-react';
import Image from 'next/image';

export function AboutView() {
    return (
        <main className="min-h-screen pt-20">
            <InfoSection>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    <div>
                        <p className="font-sans text-secondary font-bold tracking-[0.2em] uppercase text-sm mb-6">Our Legacy</p>
                        <InfoPageHeader
                            title={<>Defining the Standard of<br />Premium Mobility.</>}
                            description="Brothers Car Rental was founded on a simple principle: precision in every detail. We don't just rent cars; we provide an executive experience tailored for those who value time, quality, and excellence."
                            className="mb-12"
                        />
                        <div className="grid grid-cols-2 gap-12 mt-12">
                            <Stat label="Luxury Fleet" value="50+" />
                            <Stat label="Years of Excellence" value="15+" />
                            <Stat label="Corporate Partners" value="200+" />
                            <Stat label="Elite Concierges" value="24/7" />
                        </div>
                    </div>

                    <div className="relative">
                        <div className="rounded-[3rem] overflow-hidden shadow-ambient aspect-4/5 relative z-10">
                            <Image
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAY0lEz15G9liVtx12gKTaTqGP0v4lBpllg7zXLF8HUloW1nWypPrx8PUscNZczKD59agUiq2-Ys1rWqWXADY6lI3UKi9opbedhgUW2nC9mjRgEgu4hBOX7vJFE3q1Dc2fxFVhD8aGB8ymZ50DnA7SRfHaev7liztC2Ppk39rN0Jzwm0e65kgrRl36yaqnnEyxMg95yXVPAkC8ippkj_f_Kt6U0ltvzN5lGrmf4y2Jo3fLK7JxKGzXo0McfJzK6jMLPRx7EtCAIKOfP"
                                className="w-full h-full object-cover"
                                alt="About Us"
                            />
                        </div>
                        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl z-0"></div>
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl z-0"></div>
                    </div>
                </div>
            </InfoSection>

            {/* Values Section */}
            <InfoSection className="bg-primary py-32 text-white">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6">Built on Values</h2>
                    <p className="font-sans text-white/60 text-lg leading-relaxed">
                        Our commitment to excellence is reflected in the core pillars of our service.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <ValueCard
                        icon={<Gem className="w-8 h-8 text-secondary" />}
                        title="Uncompromising Quality"
                        description="Every vehicle in our fleet undergoes a rigorous 150-point inspection before every handover."
                    />
                    <ValueCard
                        icon={<Shield className="w-8 h-8 text-secondary" />}
                        title="Absolute Privacy"
                        description="Your data and travel details are protected by military-grade encryption and strict confidentiality protocols."
                    />
                    <ValueCard
                        icon={<Users className="w-8 h-8 text-secondary" />}
                        title="Client-First Focus"
                        description="Our concierge team is trained to anticipate your needs, providing proactive service that exceeds expectations."
                    />
                    <ValueCard
                        icon={<Award className="w-8 h-8 text-secondary" />}
                        title="Award-Winning Care"
                        description="Recognized as the leader in executive mobility services for five consecutive years."
                    />
                </div>
            </InfoSection>

            {/* Vision Section */}
            <InfoSection className="py-32">
                <div className="bg-muted rounded-[3rem] p-12 md:p-24 flex flex-col md:flex-row gap-16 items-center">
                    <div className="md:w-1/2">
                        <h2 className="font-heading text-3xl md:text-5xl font-bold text-primary mb-8 leading-tight">Our Vision for the Future</h2>
                        <p className="font-sans text-muted-foreground text-lg leading-relaxed mb-8">
                            We are continuously evolving to integrate the latest in mobility technology with the timeless tradition of personalized hospitality. Our goal is to expand our curated network across all major business hubs globally.
                        </p>
                    </div>
                    <div className="md:w-1/2 h-[400px] rounded-3xl overflow-hidden shadow-ambient">
                        <Image
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAY0lEz15G9liVtx12gKTaTqGP0v4lBpllg7zXLF8HUloW1nWypPrx8PUscNZczKD59agUiq2-Ys1rWqWXADY6lI3UKi9opbedhgUW2nC9mjRgEgu4hBOX7vJFE3q1Dc2fxFVhD8aGB8ymZ50DnA7SRfHaev7liztC2Ppk39rN0Jzwm0e65kgrRl36yaqnnEyxMg95yXVPAkC8ippkj_f_Kt6U0ltvzN5lGrmf4y2Jo3fLK7JxKGzXo0McfJzK6jMLPRx7EtCAIKOfP"
                            className="w-full h-full object-cover"
                            alt="Vision"
                            width={1280}
                            height={720}
                            priority
                        />
                    </div>
                </div>
            </InfoSection>
        </main>
    );
}

function Stat({ label, value }: { label: string, value: string }) {
    return (
        <div>
            <p className="font-heading text-4xl font-bold text-primary mb-2 tracking-tight">{value}</p>
            <p className="font-sans text-sm text-muted-foreground uppercase tracking-widest">{label}</p>
        </div>
    );
}

function ValueCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="bg-white/5 border border-white/10 p-10 rounded-3xl hover:bg-white/10 transition-all duration-300">
            <div className="mb-8">{icon}</div>
            <h3 className="font-heading text-xl font-bold mb-4">{title}</h3>
            <p className="font-sans text-white/50 text-sm leading-relaxed">{description}</p>
        </div>
    );
}
