import React from 'react';
import { cn } from '@/lib/utils';

interface InfoPageHeaderProps {
    title: string | React.ReactNode;
    description?: string;
    className?: string;
}

export function InfoPageHeader({ title, description, className }: InfoPageHeaderProps) {
    return (
        <header className={cn("mb-16 md:mb-24 text-center md:text-left max-w-3xl", className)}>
            <h1 className="font-heading text-4xl md:text-6xl font-extrabold text-primary mb-4 tracking-tight leading-tight">
                {title}
            </h1>
            {description && (
                <p className="font-sans text-muted-foreground text-lg md:text-xl leading-relaxed">
                    {description}
                </p>
            )}
        </header>
    );
}
