
import { InfoPageHeader } from '../../../components/InfoPageHeader';
import { InfoSection } from '../../../components/InfoSection';
import { ContactForm } from '../components/ContactForm';
import { ContactInfo } from '../components/ContactInfo';
import { Map } from 'lucide-react';
import Image from 'next/image';

export function ContactView() {
    return (
        <main className="min-h-screen pt-20">
            <InfoSection>
                <InfoPageHeader
                    title={<>Connect with<br />The Curated Precision.</>}
                    description="Whether you're inquiring about our executive fleet or need immediate assistance, our concierge team is ready to serve you."
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
                    <div className="lg:col-span-7">
                        <ContactForm />
                    </div>
                    <div className="lg:col-span-5">
                        <ContactInfo />
                    </div>
                </div>

                {/* Map Section */}
                <div className="mt-24 rounded-2xl overflow-hidden shadow-ambient h-[450px] relative bg-muted group">
                    <Image
                        alt="Map"
                        className="w-full h-full object-cover opacity-80 mix-blend-luminosity grayscale group-hover:grayscale-0 transition-all duration-700"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdmc-kDRfIZ8ZW2m6-xGbhZeoTje1MocHsW9iXAulrOD9Qo2TewTcuijRwg1fB69_eMf26W6dYQTYHdRnmUGV9geKtQC4rL7gCtyINn06u4U4wHiwLwa4-7KkGPgb7KwRS2C1ZVqD2tJvRNY3z7UIxX8dSDS9Pk289a9dM1PLpjUCy8Y0DrNlaiKIynI_SKukWeHkGJFCfnMtQ0htcedooILM-ziCxVBzbJ_MB_ZxEVliuifyAOwtxTWE7PIYXnVA4Dz4M7Xob2ZXU"
                        width={1280}
                        height={720}
                        priority
                    />
                    <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>

                    {/* Floating Map Card */}
                    <div className="absolute top-8 left-8 bg-card/90 backdrop-blur-md p-8 rounded-2xl shadow-xl max-w-sm hidden md:block border border-white/20">
                        <h4 className="font-heading font-bold text-primary mb-3 flex items-center gap-2">
                            <Map className="w-5 h-5 text-secondary" />
                            Global Network
                        </h4>
                        <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                            Operating across prime locations in the NCR region, ensuring a Brothers vehicle is never far from your doorstep.
                        </p>
                    </div>
                </div>
            </InfoSection>
        </main>
    );
}
