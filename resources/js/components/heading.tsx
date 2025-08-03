import React from 'react';

interface HeadingProps {
    title?: string;
    description?: string;
    children?: React.ReactNode;
}

export function Heading({ title, description, children }: HeadingProps) {
    return (
        <div className="mb-8 space-y-0.5">
            <h2 className="text-xl font-semibold tracking-tight">
                {children || title}
            </h2>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
    );
}

// Default export for backward compatibility
export default function DefaultHeading({ title, description }: { title: string; description?: string }) {
    return <Heading title={title} description={description} />;
}
