import { cn } from '@/lib/utils';
import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextAreaInputProps
    extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    isError?: boolean;
}

export const TextAreaInput = forwardRef<
    HTMLTextAreaElement,
    TextAreaInputProps
>(({ isError = false, className, ...props }, ref) => {
    return (
        <textarea
            ref={ref}
            className={cn(
                'w-full resize-none rounded-xl border-2 px-4 py-3 text-slate-700 transition-all outline-none',
                isError
                    ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                    : 'border-slate-200 bg-white hover:border-indigo-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100',
                className,
            )}
            {...props}
        />
    );
});

TextAreaInput.displayName = 'TextAreaInput';
