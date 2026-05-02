import { InfoSection } from '../../../components/InfoSection';
import { Fingerprint, Eye, Database, Share2 } from 'lucide-react';

export function PrivacyView() {
    return (
        <main className="min-h-screen pt-20">
            <InfoSection containerClassName="max-w-4xl py-24">
                <article className="bg-card rounded-[2rem] p-8 md:p-16 shadow-ambient relative overflow-hidden border border-border/10">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-secondary"></div>

                    <header className="mb-16 border-b border-border/40 pb-12">
                        <p className="text-secondary font-sans font-bold tracking-[0.2em] uppercase text-xs mb-4">Privacy Compliance</p>
                        <h1 className="font-heading text-4xl md:text-6xl font-extrabold text-primary leading-tight mb-6">Privacy Policy</h1>
                        <p className="font-sans text-muted-foreground text-lg">Your data security is our highest priority.</p>
                    </header>

                    <div className="space-y-16 font-sans text-foreground leading-relaxed">
                        <PrivacySection
                            icon={<Database className="w-6 h-6 text-secondary" />}
                            title="Information We Collect"
                        >
                            <p className="mb-6">We collect only the essential information required to provide you with an elite car rental experience.</p>
                            <ul className="list-disc list-inside space-y-3 text-muted-foreground ml-4">
                                <li>Identification details (Driving License, Passport).</li>
                                <li>Payment information via secure, encrypted gateways.</li>
                                <li>Trip and location data for vehicle logistics and roadside safety.</li>
                            </ul>
                        </PrivacySection>

                        <PrivacySection
                            icon={<Eye className="w-6 h-6 text-secondary" />}
                            title="How We Use Your Data"
                        >
                            <p className="mb-4">Your information is used exclusively for reservation management, fleet logistics, and enhancing your personalized concierge service.</p>
                            <p className="mb-4">We never sell your personal data to third-party marketing agencies.</p>
                        </PrivacySection>

                        <PrivacySection
                            icon={<Fingerprint className="w-6 h-6 text-secondary" />}
                            title="Data Security"
                        >
                            <p className="mb-4">We utilize enterprise-level encryption (AES-256) to protect your sensitive information at rest and in transit. Our servers are housed in Tier 4 data centers with 24/7 security monitoring.</p>
                        </PrivacySection>

                        <PrivacySection
                            icon={<Share2 className="w-6 h-6 text-secondary" />}
                            title="Third-Party Disclosure"
                        >
                            <p className="mb-4">Information may be shared with trusted partners (such as insurance providers or emergency services) only when necessary to execute the services requested by you.</p>
                        </PrivacySection>

                        <div className="bg-muted/50 p-8 rounded-2xl mt-12 border border-border/10 text-center">
                            <h4 className="font-heading font-bold text-primary mb-3 text-lg">Questions about your privacy?</h4>
                            <p className="text-sm text-muted-foreground mb-6">Our dedicated data protection officer is available for any inquiries.</p>
                            <a href="mailto:privacy@brothers.com" className="text-secondary font-bold hover:underline">privacy@brothers.com</a>
                        </div>
                    </div>
                </article>
            </InfoSection>
        </main>
    );
}

function PrivacySection({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) {
    return (
        <section>
            <h2 className="font-heading text-2xl font-bold text-primary mb-6 flex items-center gap-4">
                {icon}
                {title}
            </h2>
            <div className="text-lg leading-relaxed text-foreground/80">
                {children}
            </div>
        </section>
    );
}
