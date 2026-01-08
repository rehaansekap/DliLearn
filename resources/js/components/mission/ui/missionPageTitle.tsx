import { cn } from '@/lib/utils';

interface MissionPageTitleProps {
    step: number;
    title: string;
    subtitle?: string;
    icon?: string;
    color?: 'purple' | 'amber' | 'emerald' | 'rose' | 'blue' | 'indigo';
}

const colorStyles = {
    purple: {
        bg: 'from-purple-50 via-indigo-50 to-blue-50',
        border: 'border-purple-200',
        gradient: 'from-purple-500 to-indigo-600',
    },
    amber: {
        bg: 'from-amber-50 to-orange-50',
        border: 'border-amber-200',
        gradient: 'from-amber-400 to-orange-400',
    },
    emerald: {
        bg: 'from-emerald-50 to-teal-50',
        border: 'border-emerald-200',
        gradient: 'from-emerald-400 to-teal-400',
    },
    rose: {
        bg: 'from-rose-50 via-pink-50 to-orange-50',
        border: 'border-rose-200',
        gradient: 'from-rose-600 to-pink-600',
    },
    blue: {
        bg: 'from-blue-50 to-cyan-50',
        border: 'border-blue-200',
        gradient: 'from-blue-500 to-cyan-500',
    },
    indigo: {
        bg: 'from-indigo-50 to-purple-50',
        border: 'border-indigo-200',
        gradient: 'from-indigo-500 to-purple-500',
    },
};

export function MissionPageTitle({
    step,
    title,
    subtitle,
    icon,
    color = 'purple',
}: MissionPageTitleProps) {
    const styles = colorStyles[color];

    return (
        <div
            className={cn(
                'overflow-hidden rounded-xl border p-4 shadow-lg sm:rounded-2xl sm:p-6',
                `bg-gradient-to-br ${styles.bg}`,
                styles.border,
            )}
        >
            <div className="flex items-start gap-3 sm:gap-4">
                <div
                    className={cn(
                        'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-xl shadow-lg sm:h-14 sm:w-14 sm:rounded-2xl sm:text-2xl',
                        `bg-gradient-to-br ${styles.gradient}`,
                    )}
                >
                    {icon || '📋'}
                </div>
                <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                        <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-xs font-bold text-slate-700 shadow-sm">
                            Phase {step}
                        </span>
                    </div>
                    <h3 className="mb-1 text-lg font-black text-slate-800 sm:mb-2 sm:text-2xl">
                        {title}
                    </h3>
                    {subtitle && (
                        <p className="text-sm text-slate-600 sm:text-base">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
