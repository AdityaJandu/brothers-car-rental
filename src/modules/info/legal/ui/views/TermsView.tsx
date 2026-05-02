
import { InfoSection } from '../../../components/InfoSection';
import { ShieldCheck, FileText, Lock, XCircle } from 'lucide-react';

export function TermsView() {
    return (
        <main className="min-h-screen pt-20">
            <InfoSection containerClassName="flex flex-col md:flex-row gap-16 py-24">
                {/* Sidebar Navigation */}
                <aside className="md:w-1/4 hidden md:block">
                    <div className="sticky top-32 bg-muted p-8 rounded-2xl border border-border/20 shadow-sm">
                        <h3 className="font-heading font-bold text-primary text-xl mb-6">Contents</h3>
                        <nav className="flex flex-col gap-4 font-sans text-muted-foreground text-sm">
                            <SidebarLink href="#eligibility" label="1. Eligibility" />
                            <SidebarLink href="#rental-agreement" label="2. Rental Agreement" />
                            <SidebarLink href="#insurance-policy" label="3. Insurance Policy" />
                            <SidebarLink href="#cancellations" label="4. Cancellations" />
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <article className="md:w-3/4 bg-card rounded-[2rem] p-8 md:p-16 shadow-ambient relative overflow-hidden border border-border/10">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/5 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none z-0"></div>

                    <div className="relative z-10">
                        <header className="mb-16 border-b border-border/40 pb-12">
                            <p className="text-secondary font-sans font-bold tracking-[0.2em] uppercase text-xs mb-4">Legal Framework</p>
                            <h1 className="font-heading text-4xl md:text-6xl font-extrabold text-primary leading-tight mb-6">Terms of Service</h1>
                            <p className="font-sans text-muted-foreground text-lg">Last Updated: October 24, 2024</p>
                        </header>

                        <div className="space-y-20 font-sans text-foreground leading-relaxed">
                            <LegalSection
                                id="eligibility"
                                icon={<ShieldCheck className="w-6 h-6 text-secondary" />}
                                title="1. Eligibility"
                            >
                                <p className="mb-6">To access and utilize the premium fleet offered by Brothers Car Rental, clients must meet strict eligibility criteria designed to ensure the safety and preservation of our vehicles.</p>
                                <ul className="list-disc list-inside space-y-3 text-muted-foreground ml-4">
                                    <li>Must be at least 25 years of age.</li>
                                    <li>Must possess a valid, unexpired driver&apos;s license with no major infractions within the last 36 months.</li>
                                    <li>A valid major credit card under the primary driver&apos;s name is required for the security deposit.</li>
                                </ul>
                            </LegalSection>

                            <LegalSection
                                id="rental-agreement"
                                icon={<FileText className="w-6 h-6 text-secondary" />}
                                title="2. Rental Agreement"
                            >
                                <p className="mb-6">The rental period commences upon the handover of keys and concludes when the vehicle is returned to a designated Brothers Car Rental representative. Clients are expected to return the vehicle in the precise condition it was received, notwithstanding standard road wear.</p>
                                <p className="mb-4">Any modifications, mechanical alterations, or track usage is strictly prohibited and constitutes a material breach of this agreement.</p>
                            </LegalSection>

                            <LegalSection
                                id="insurance-policy"
                                icon={<Lock className="w-6 h-6 text-secondary" />}
                                title="3. Insurance Policy"
                            >
                                <p className="mb-6">Brothers Car Rental requires all clients to maintain comprehensive collision and liability insurance. We offer supplemental concierge coverage for peace of mind.</p>
                                <div className="bg-muted/80 p-8 rounded-2xl mt-8 border border-border/20">
                                    <h4 className="font-heading font-bold text-primary mb-3">Coverage Details</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">In the event of an incident, the renter is responsible for the deductible up to the amount specified in their specific rental tier agreement. Please consult your concierge representative for exact figures prior to departure.</p>
                                </div>
                            </LegalSection>

                            <LegalSection
                                id="cancellations"
                                icon={<XCircle className="w-6 h-6 text-secondary" />}
                                title="4. Cancellations"
                            >
                                <p className="mb-6">We understand that executive schedules are subject to change. Our cancellation policy is structured to offer flexibility while respecting the limited availability of our curated fleet.</p>
                                <ul className="list-disc list-inside space-y-3 text-muted-foreground ml-4">
                                    <li>Full refund available for cancellations made at least 72 hours prior to the scheduled pick-up time.</li>
                                    <li>Cancellations within 72 hours will incur a fee equivalent to one day&apos;s rental rate.</li>
                                    <li>No-shows will be charged the full amount of the reservation.</li>
                                </ul>
                            </LegalSection>
                        </div>
                    </div>
                </article>
            </InfoSection>
        </main>
    );
}

function SidebarLink({ href, label }: { href: string, label: string }) {
    return (
        <a
            href={href}
            className="hover:text-secondary transition-colors font-medium border-l-2 border-transparent hover:border-secondary pl-4 py-1"
        >
            {label}
        </a>
    );
}

function LegalSection({ id, icon, title, children }: { id: string, icon: React.ReactNode, title: string, children: React.ReactNode }) {
    return (
        <section id={id} className="scroll-mt-32">
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
