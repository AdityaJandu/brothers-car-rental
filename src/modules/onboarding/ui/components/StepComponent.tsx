import { LucideIcon } from "lucide-react";

type Step = {
    title: string;
    description: string;
    icon: LucideIcon;
};

export function StepComponent({ steps }: { steps: Step[] }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
                <div
                    key={index}
                    className="group relative bg-white rounded-xl p-6 transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-ambient"
                >
                    {/* Big Background Number */}
                    <span className="absolute top-4 right-6 text-6xl font-bold text-gray-200 opacity-40 pointer-events-none">
                        {`0${index + 1}`}
                    </span>

                    {/* Icon */}
                    <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-(--surface-high) mb-5 transition-all duration-300 group-hover:bg-primary">
                        <step.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-primary mb-2">
                        {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {step.description}
                    </p>
                </div>
            ))}
        </div>
    );
}