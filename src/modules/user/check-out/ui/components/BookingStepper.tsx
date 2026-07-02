import { Check } from "lucide-react";
import React from "react";

type Step = {
    id: number;
    title: string;
    status: "complete" | "current" | "upcoming";
};

const steps: Step[] = [
    { id: 1, title: "LOCATION", status: "complete" },
    { id: 2, title: "CAR", status: "complete" },
    { id: 3, title: "DETAILS", status: "current" },
    { id: 4, title: "PAYMENT", status: "upcoming" },
    { id: 5, title: "CONFIRM", status: "upcoming" },
];

export function BookingStepper() {
    return (
        <div className="flex items-center justify-center max-w-3xl mx-auto w-full">
            {steps.map((step, index) => (
                <React.Fragment key={step.id}>

                    {/* Step Item */}
                    <div className="flex flex-col items-center gap-3 relative z-10">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm border-[3px] transition-colors
                            ${step.status === 'complete' ? 'bg-[#0F172A] text-white border-white' : ''}
                            ${step.status === 'current' ? 'bg-[#517fa4] text-white border-white' : ''}
                            ${step.status === 'upcoming' ? 'bg-[#F4F5F7] text-slate-400 border-white' : ''}
                        `}>
                            {step.status === 'complete' ? <Check className="w-5 h-5" /> : step.id}
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider absolute -bottom-6 whitespace-nowrap
                            ${step.status === 'current' ? 'text-[#517fa4]' : 'text-slate-900'}
                            ${step.status === 'upcoming' ? 'text-slate-400' : ''}
                        `}>
                            {step.title}
                        </span>
                    </div>

                    {/* Connecting Line (Don't render after the last item) */}
                    {index < steps.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-4 lg:mx-6 rounded-full transition-colors
                            ${step.status === 'complete' ? 'bg-slate-200' : 'bg-slate-100'}
                            ${step.status === 'current' && steps[index + 1].status === 'upcoming' ? 'bg-slate-100' : ''}
                        `}></div>
                    )}

                </React.Fragment>
            ))}
        </div>
    );
}