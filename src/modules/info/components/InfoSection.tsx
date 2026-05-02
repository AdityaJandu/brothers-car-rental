import React from 'react';
import { cn } from '@/lib/utils';

interface InfoSectionProps {
    children: React.ReactNode;
    className?: string;
    containerClassName?: string;
}

export function InfoSection({ children, className, containerClassName }: InfoSectionProps) {
    return (
        <section className={cn("py-12", className)}>
            <div className={cn("max-w-7xl mx-auto px-6", containerClassName)}>
                {children}
            </div>
        </section>
    );
}
