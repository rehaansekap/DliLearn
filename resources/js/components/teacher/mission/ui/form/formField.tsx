import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function FormField({ children, className, ...props }: FormFieldProps) {
    return (
        <div className={cn('space-y-1', className)} {...props}>
            {children}
        </div>
    );
}
