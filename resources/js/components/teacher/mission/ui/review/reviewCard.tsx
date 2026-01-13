import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface ReviewCardProps {
    title: string;
    icon: ReactNode;
    borderColor: string;
    bgColor: string;
    children: ReactNode;
}

export function ReviewCard({
    title,
    icon,
    borderColor,
    bgColor,
    children,
}: ReviewCardProps) {
    return (
        <div
            className={cn(
                'overflow-hidden rounded-2xl border-2 shadow-md',
                borderColor,
                bgColor,
            )}
        >
            <div
                className={cn(
                    'flex items-center gap-3 border-b-2 px-6 py-4',
                    borderColor,
                )}
            >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/80 shadow">
                    {icon}
                </div>
                <h3 className="text-lg font-bold text-slate-800">{title}</h3>
            </div>
            <div className="space-y-4 p-6">{children}</div>
        </div>
    );
}
