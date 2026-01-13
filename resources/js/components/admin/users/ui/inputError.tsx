import { cn } from '@/lib/utils';

interface InputErrorProps {
    message?: string;
    className?: string;
}

export function InputError({ message, className }: InputErrorProps) {
    if (!message) return null;

    return (
        <p className={cn('mt-1 text-xs font-medium text-red-600', className)}>
            {message}
        </p>
    );
}
