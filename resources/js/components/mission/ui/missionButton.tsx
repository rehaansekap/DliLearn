import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface MissionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    icon?: ReactNode;
    fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 hover:scale-[1.02] active:scale-[0.98]',
    secondary:
        'bg-white text-indigo-700 border-2 border-indigo-100 hover:bg-indigo-50 hover:border-indigo-200',
    outline:
        'bg-transparent text-slate-700 border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400',
    danger: 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg hover:shadow-xl hover:from-red-700 hover:to-rose-700',
    success:
        'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-teal-700',
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
};

export function MissionButton({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    icon,
    children,
    disabled,
    fullWidth = false,
    className,
    ...props
}: MissionButtonProps) {
    return (
        <button
            disabled={disabled || isLoading}
            className={cn(
                'relative inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-200 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                variantStyles[variant],
                sizeStyles[size],
                fullWidth && 'w-full',
                className,
            )}
            {...props}
        >
            {isLoading ? (
                <>
                    <svg
                        className="h-5 w-5 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    <span>Loading...</span>
                </>
            ) : (
                <>
                    {icon && <span className="flex-shrink-0">{icon}</span>}
                    <span>{children}</span>
                </>
            )}
        </button>
    );
}
