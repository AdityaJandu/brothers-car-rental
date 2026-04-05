import { Star, CheckCircle2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GeneratedAvatar } from "@/components/self/generated-avatar";

export const EmailBadge = ({ verified }: { verified: boolean }) => {
    if (verified) {
        return <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full">Verified</span>;
    }
    return <span className="bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full">Unverified</span>;
};

interface ProfileHeaderProps {
    name: string;
    email: string;
    image: string | null;
    emailVerified: boolean;
}

export const ProfileHeader = ({ name, email, image, emailVerified }: ProfileHeaderProps) => {
    return (
        <section className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                        {image ?
                            <Avatar className="size-32" >
                                <AvatarImage src={image} />
                                <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            :
                            <GeneratedAvatar className="size-32" seed={name} variant={"initials"} />
                        }
                    </div>
                    <div className="absolute bottom-1 right-1 bg-[#FF8C00] text-white p-1 rounded-full border-2 border-white">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                </div>

                <div className="flex flex-col items-center md:items-start mt-2">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-[#1E293B] text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full flex items-center gap-1.5">
                            <Star className="w-3 h-3 fill-current" />
                            Executive Member
                        </span>
                    </div>
                    <h1 className="text-4xl font-bold text-[#0F172A] tracking-tight">{name}</h1>
                    <div className="flex items-center gap-3 mt-1.5">
                        <p className="text-slate-500 font-medium">{email}</p>
                        <EmailBadge verified={emailVerified} />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 mt-4 md:mt-0">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 min-w-[120px] flex flex-col items-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Total Trips</span>
                    <span className="text-2xl font-bold text-[#0F172A]">24</span>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 min-w-[140px] flex flex-col items-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Loyalty Points</span>
                    <span className="text-2xl font-bold text-[#FF8C00]">12,850</span>
                </div>
            </div>
        </section>
    );
};
