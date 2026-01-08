import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface MissionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?:
        | 'primary'
        | 'secondary'
        | 'success'
        | 'danger'
        | 'outline'
        | 'warning';
    size?: 'sm' | 'md' | 'lg';
    icon?: string;
    isLoading?: boolean;
    fullWidth?: boolean;
}

export function MissionButton({
    children,
    variant = 'primary',
    size = 'md',
    icon,
    isLoading,
    fullWidth,
    className,
    disabled,
    ...props
}: MissionButtonProps) {
    const baseStyles =
        'inline-flex items-center justify-center gap-2 rounded-xl font-bold shadow transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60';

    const variants = {
        primary:
            'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]',
        secondary:
            'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-[1.02] active:scale-[0.98]',
        success:
            'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]',
        danger: 'bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]',
        outline:
            'border-2 border-slate-300 bg-white text-slate-700 hover:border-indigo-400 hover:bg-indigo-50 hover:scale-[1.02] active:scale-[0.98]',
        warning:
            'bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm',
        md: 'px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base',
        lg: 'px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg',
    };

    return (
        <button
            className={cn(
                baseStyles,
                variants[variant],
                sizes[size],
                fullWidth && 'w-full',
                className,
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            ) : icon ? (
                <span>{icon}</span>
            ) : null}
            {children}
        </button>
    );
}
