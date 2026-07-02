import { Check } from "lucide-react";
import { featuresData } from "../../data/features_data";
import { cn } from "@/lib/utils";

const benefits = [
    "No Hidden Insurance Costs",
    "Doorstep Delivery & Pickup"
];

export function FeaturesSection() {
    return (

        <div className="max-w-7xl mx-auto px-6 lg:px-12">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                {/* LEFT COLUMN: Feature Cards (Bento Grid) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {featuresData.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={feature.id}
                                className={cn(
                                    "p-8 rounded-md transition-transform duration-300 hover:-translate-y-1",
                                    feature.isDark
                                        ? "bg-primary text-white shadow-ambient"
                                        : "bg-white text-primary shadow-sm hover:shadow-ambient"
                                )}
                            >
                                {/* Icon */}
                                <div className="mb-6">
                                    <Icon
                                        className={`w-8 h-8 ${feature.isDark ? "text-[#6BAED6]" : "text-[#517fa4]"}`}
                                        strokeWidth={2}
                                    />
                                </div>

                                {/* Text */}
                                <h3 className="text-xl font-bold font-heading mb-3 tracking-tight">
                                    {feature.title}
                                </h3>
                                <p className={`text-sm leading-relaxed ${feature.isDark ? "text-white/80" : "text-muted-foreground"}`}>
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* RIGHT COLUMN: Typography & Benefits */}
                <div className="flex flex-col">
                    <h2 className="text-4xl lg:text-[3.25rem] leading-[1.1] font-bold text-primary font-heading mb-6 tracking-tight">
                        Precision in Every <br className="hidden lg:block" />
                        Detail.
                    </h2>

                    <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-lg">
                        At Brothers, we don&apos;t just rent cars; we provide the freedom to explore with confidence. Our commitment to excellence ensures that every mile you drive is backed by our promise of quality and safety.
                    </p>

                    {/* Checkmark List */}
                    <div className="flex flex-col gap-5">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-[#E0EEF7] flex items-center justify-center shrink-0">
                                    <Check className="w-4 h-4 text-[#517fa4]" strokeWidth={3} />
                                </div>
                                <span className="text-base font-bold text-primary">
                                    {benefit}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </div>

    );
}