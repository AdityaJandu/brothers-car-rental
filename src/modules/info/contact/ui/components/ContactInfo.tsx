
import { Phone, Mail, MapPin } from 'lucide-react';

export function ContactInfo() {
    return (
        <div className="space-y-12">
            {/* Direct Contact */}
            <div>
                <h3 className="font-heading text-xl font-bold text-primary mb-6">Direct Contact</h3>
                <div className="space-y-6">
                    <ContactMethod
                        icon={<Phone className="w-5 h-5 fill-current" />}
                        label="Concierge Desk"
                        value="+91 98765 43210"
                    />
                    <ContactMethod
                        icon={<Mail className="w-5 h-5 fill-current" />}
                        label="Executive Support"
                        value="reservations@brothers.com"
                    />
                </div>
            </div>

            {/* Locations */}
            <div>
                <h3 className="font-heading text-xl font-bold text-primary mb-6">Our Offices</h3>
                <div className="space-y-4">
                    <LocationCard
                        city="Dehradun (HQ)"
                        address="Rajpur Road, Clock Tower, Dehradun, 248001"
                    />
                    <LocationCard
                        city="Sirsa"
                        address="Dabwali Road, City Centre, Sirsa, 125055"
                    />
                    <LocationCard
                        city="Hisar"
                        address="Delhi Road, Model Town, Hisar, 125001"
                    />
                </div>
            </div>
        </div>
    );
}

function ContactMethod({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-primary shrink-0">
                {icon}
            </div>
            <div>
                <p className="font-sans text-sm text-muted-foreground mb-1">{label}</p>
                <p className="font-sans text-lg font-semibold text-primary">{value}</p>
            </div>
        </div>
    );
}

function LocationCard({ city, address }: { city: string, address: string }) {
    return (
        <div className="bg-muted/50 p-6 rounded-xl hover:bg-muted transition-colors cursor-pointer group">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-heading font-bold text-primary mb-2">{city}</h4>
                    <p className="font-sans text-muted-foreground text-sm leading-relaxed">{address}</p>
                </div>
                <MapPin className="w-5 h-5 text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
        </div>
    );
}
