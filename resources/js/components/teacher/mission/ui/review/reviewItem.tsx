import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface ReviewItemProps {
    label: string;
    children: ReactNode;
    className?: string;
}

export function ReviewItem({ label, children, className }: ReviewItemProps) {
    return (
        <dl className={cn('space-y-1', className)}>
            <dt className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                {label}
            </dt>
            <dd className="font-medium text-slate-800">{children}</dd>
        </dl>
    );
}
