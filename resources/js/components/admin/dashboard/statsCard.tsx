import { cn } from '@/lib/utils';

interface StatsCardProps {
    title: string;
    value: number;
    icon: string;
    color: 'slate' | 'blue' | 'emerald' | 'amber';
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

const colorStyles = {
    slate: {
        bg: 'from-slate-50 to-gray-50',
        border: 'border-slate-200',
        iconBg: 'from-slate-600 to-gray-700',
        text: 'text-slate-900',
        subtitle: 'text-slate-600',
    },
    blue: {
        bg: 'from-blue-50 to-cyan-50',
        border: 'border-blue-200',
        iconBg: 'from-blue-500 to-cyan-500',
        text: 'text-blue-900',
        subtitle: 'text-blue-600',
    },
    emerald: {
        bg: 'from-emerald-50 to-teal-50',
        border: 'border-emerald-200',
        iconBg: 'from-emerald-500 to-teal-500',
        text: 'text-emerald-900',
        subtitle: 'text-emerald-600',
    },
    amber: {
        bg: 'from-amber-50 to-yellow-50',
        border: 'border-amber-200',
        iconBg: 'from-amber-500 to-yellow-500',
        text: 'text-amber-900',
        subtitle: 'text-amber-600',
    },
};

export function StatsCard({
    title,
    value,
    icon,
    color,
    trend,
}: StatsCardProps) {
    const styles = colorStyles[color];

    return (
        <div
            className={cn(
                'group relative overflow-hidden rounded-2xl border-2 bg-gradient-to-br p-4 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl sm:p-6',
                styles.bg,
                styles.border,
            )}
        >
            {/* Decorative Element */}
            <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/30 blur-2xl transition-all group-hover:scale-150" />

            <div className="relative z-10 flex items-center gap-3 sm:gap-4">
                <div
                    className={cn(
                        'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg sm:h-14 sm:w-14',
                        styles.iconBg,
                    )}
                >
                    <span className="text-lg text-white sm:text-2xl">
                        {icon}
                    </span>
                </div>
                <div>
                    <p className="text-xs font-medium text-slate-500 sm:text-sm">
                        {title}
                    </p>
                    <p
                        className={cn(
                            'text-xl font-black sm:text-3xl',
                            styles.text,
                        )}
                    >
                        {value.toLocaleString()}
                    </p>
                    {trend && (
                        <p
                            className={cn(
                                'text-xs',
                                trend.isPositive
                                    ? 'text-green-600'
                                    : 'text-red-600',
                            )}
                        >
                            {trend.isPositive ? '↑' : '↓'}{' '}
                            {Math.abs(trend.value)}%
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
