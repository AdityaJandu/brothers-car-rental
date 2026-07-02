import { LucideIcon } from "lucide-react";

interface SpecProps {
    icon: LucideIcon;
    label: string;
    value: string;
};

export const Spec = ({
    icon: Icon,
    label,
    value,
}: SpecProps) => (
    <div className="bg-white border rounded-md p-4 flex flex-col items-center gap-2">
        <Icon className="w-5 h-5 text-[#517fa4]" />
        <span className="text-xs uppercase text-slate-500">{label}</span>
        <span className="font-semibold">{value}</span>
    </div>
);
