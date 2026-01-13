import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface FormHintProps extends HTMLAttributes<HTMLParagraphElement> {
    children: React.ReactNode;
}

export function FormHint({ children, className, ...props }: FormHintProps) {
    return (
        <p className={cn('mt-1 text-xs text-slate-500', className)} {...props}>
            {children}
        </p>
    );
}
