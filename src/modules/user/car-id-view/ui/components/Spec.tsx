
interface SpecProps {
    icon: any;
    label: string;
    value: string;
};

export const Spec = ({
    icon: Icon,
    label,
    value,
}: SpecProps) => (
    <div className="bg-white border rounded-md p-4 flex flex-col items-center gap-2">
        <Icon className="w-5 h-5 text-[#D97706]" />
        <span className="text-xs uppercase text-slate-500">{label}</span>
        <span className="font-semibold">{value}</span>
    </div>
);
