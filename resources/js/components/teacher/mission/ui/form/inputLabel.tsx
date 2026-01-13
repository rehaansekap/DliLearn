import { cn } from '@/lib/utils';
import { LabelHTMLAttributes } from 'react';

interface InputLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
    value: string;
    required?: boolean;
    icon?: string;
}

export function InputLabel({
    value,
    required = false,
    icon,
    className,
    ...props
}: InputLabelProps) {
    return (
        <label
            className={cn(
                'mb-2 flex items-center gap-2 text-sm font-bold text-slate-700',
                className,
            )}
            {...props}
        >
            {icon && <span>{icon}</span>}
            <span>{value}</span>
            {required && <span className="text-red-500">*</span>}
        </label>
    );
}
