import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

interface InputErrorProps {
    message?: string;
    className?: string;
}

export function InputError({ message, className }: InputErrorProps) {
    if (!message) return null;

    return (
        <p
            className={cn(
                'mt-2 flex items-start gap-2 text-sm text-red-600',
                className,
            )}
        >
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{message}</span>
        </p>
    );
}
