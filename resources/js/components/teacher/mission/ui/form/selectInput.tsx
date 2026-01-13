import { cn } from '@/lib/utils';
import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
    options: SelectOption[];
    isError?: boolean;
    placeholder?: string;
}

export const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
    ({ options, isError = false, placeholder, className, ...props }, ref) => {
        return (
            <select
                ref={ref}
                className={cn(
                    'w-full rounded-xl border-2 px-4 py-3 text-slate-700 transition-all outline-none',
                    isError
                        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                        : 'border-slate-200 bg-white hover:border-indigo-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100',
                    className,
                )}
                {...props}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        );
    },
);

SelectInput.displayName = 'SelectInput';
