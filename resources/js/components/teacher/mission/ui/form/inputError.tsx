import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import { HTMLAttributes } from 'react';

interface InputErrorProps extends HTMLAttributes<HTMLParagraphElement> {
    message?: string;
}

export function InputError({ message, className, ...props }: InputErrorProps) {
    if (!message) return null;

    return (
        <p
            className={cn(
                'mt-2 flex items-center gap-1 text-sm text-red-600',
                className,
            )}
            {...props}
        >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{message}</span>
        </p>
    );
}
