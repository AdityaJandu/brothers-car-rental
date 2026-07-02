"use client";

import { useState } from "react";
import { Pencil, Check, X, Phone, FileText, User } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { type inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "@/trpc/routers/_app";

type UpdateProfileOutput = inferRouterOutputs<AppRouter>["userProfile"]["updateProfile"];

interface PersonalInfoCardProps {
    name: string;
    phone: string | null;
    licenseNumber: string | null;
}

// ─── Inline editable row ─────────────────────────────────────────────────────

interface EditableRowProps {
    label: string;
    icon: React.ElementType;
    value: string | null;
    placeholder: string;
    inputType?: string;
    onSave: (val: string) => Promise<UpdateProfileOutput | void>;
    isSaving: boolean;
    readOnly?: boolean;
}

const EditableRow = ({
    label,
    icon: Icon,
    value,
    placeholder,
    inputType = "text",
    onSave,
    isSaving,
    readOnly = false,
}: EditableRowProps) => {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value ?? "");

    const handleSave = async () => {
        if (!draft.trim()) return;
        await onSave(draft.trim());
        setEditing(false);
    };

    const handleCancel = () => {
        setDraft(value ?? "");
        setEditing(false);
    };

    return (
        <div className="group border-b border-slate-100 pb-5 last:border-b-0 last:pb-0">
            <div className="flex items-center gap-1.5 mb-2">
                <Icon className="w-3.5 h-3.5 text-slate-400" />
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {label}
                </p>
            </div>

            {readOnly ? (
                <p className="text-base font-semibold text-[#0F172A] pl-5">{value ?? "—"}</p>
            ) : editing ? (
                <div className="flex items-center gap-2 pl-5">
                    <input
                        autoFocus
                        type={inputType}
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSave();
                            if (e.key === "Escape") handleCancel();
                        }}
                        placeholder={placeholder}
                        className="flex-1 bg-white border border-slate-200 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[#FF8C00] transition-shadow shadow-sm"
                    />
                    <button
                        onClick={handleSave}
                        disabled={isSaving || !draft.trim()}
                        className="w-8 h-8 rounded-md bg-[#0F172A] text-white flex items-center justify-center hover:bg-[#1e293b] disabled:opacity-40 transition-colors shrink-0"
                    >
                        <Check className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleCancel}
                        className="w-8 h-8 rounded-md border border-slate-200 text-slate-500 flex items-center justify-center hover:bg-slate-50 transition-colors shrink-0"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <div className="flex items-center justify-between pl-5">
                    {value ? (
                        <p className="text-base font-semibold text-[#0F172A]">{value}</p>
                    ) : (
                        <p className="text-sm text-slate-400 italic">{placeholder}</p>
                    )}
                    <button
                        onClick={() => setEditing(true)}
                        className="opacity-0 group-hover:opacity-100 ml-3 w-7 h-7 rounded-md border border-slate-200 text-slate-400 flex items-center justify-center hover:text-[#FF8C00] hover:border-[#FF8C00]/30 transition-all shrink-0"
                        title={`Edit ${label}`}
                    >
                        <Pencil className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}
        </div>
    );
};

// ─── Main card ────────────────────────────────────────────────────────────────

export const PersonalInfoCard = ({ name, phone, licenseNumber }: PersonalInfoCardProps) => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const { mutateAsync: updateProfile, isPending } = useMutation(
        trpc.userProfile.updateProfile.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries(trpc.userProfile.getUser.queryOptions());
                toast.success("Profile updated");
            },
            onError: () => {
                toast.error("Failed to save — please try again");
            },
        })
    );

    return (
        <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-bold text-[#0F172A]">Personal Info</h2>
                <p className="text-slate-500 text-sm mt-1">
                    Hover a field to edit it inline.
                </p>
            </div>

            <div className="space-y-5">
                <EditableRow
                    label="Full Name"
                    icon={User}
                    value={name}
                    placeholder={name}
                    onSave={async () => { }} // name is managed by auth provider
                    isSaving={false}
                    readOnly
                />

                <EditableRow
                    label="Phone Number"
                    icon={Phone}
                    value={phone}
                    placeholder="+91 79068 91427"
                    inputType="tel"
                    onSave={(val) => updateProfile({ phone: val })}
                    isSaving={isPending}
                />

                <EditableRow
                    label="Driver's License"
                    icon={FileText}
                    value={licenseNumber}
                    placeholder="Enter your license number"
                    onSave={(val) => updateProfile({ licenseNumber: val })}
                    isSaving={isPending}
                />
            </div>
        </div>
    );
};
