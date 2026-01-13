import { cn } from '@/lib/utils';
import { Check, Loader2, Lock } from 'lucide-react';

interface StepIndicatorProps {
    step: number;
    status: 'locked' | 'in_progress' | 'completed';
    label: string;
    isLast?: boolean;
}

export function StepIndicator({
    status,
    label,
    isLast = false,
}: StepIndicatorProps) {
    const statusStyles = {
        locked: {
            bg: 'bg-slate-200',
            border: 'border-slate-300',
            text: 'text-slate-500',
            icon: Lock,
        },
        in_progress: {
            bg: 'bg-indigo-100',
            border: 'border-indigo-400',
            text: 'text-indigo-700',
            icon: Loader2,
        },
        completed: {
            bg: 'bg-emerald-100',
            border: 'border-emerald-400',
            text: 'text-emerald-700',
            icon: Check,
        },
    };

    const style = statusStyles[status];
    const Icon = style.icon;

    return (
        <div className="flex items-center">
            <div className="flex flex-col items-center">
                {/* Circle */}
                <div
                    className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all',
                        style.bg,
                        style.border,
                        status === 'in_progress' && 'animate-pulse',
                    )}
                >
                    <Icon
                        className={cn(
                            'h-5 w-5',
                            style.text,
                            status === 'in_progress' && 'animate-spin',
                        )}
                    />
                </div>

                {/* Label */}
                <p className="mt-1 text-center text-xs font-medium text-slate-600">
                    {label}
                </p>
            </div>

            {/* Connecting Line */}
            {!isLast && (
                <div
                    className={cn(
                        'mx-2 h-0.5 w-8 transition-all',
                        status === 'completed'
                            ? 'bg-emerald-400'
                            : status === 'in_progress'
                              ? 'bg-indigo-400'
                              : 'bg-slate-300',
                    )}
                />
            )}
        </div>
    );
}
