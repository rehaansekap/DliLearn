import { cn } from '@/lib/utils';

interface StatsCardProps {
    title: string;
    value: number;
    icon: string;
    color: 'indigo' | 'emerald' | 'amber' | 'rose';
    subtitle?: string;
}

const colorStyles = {
    indigo: {
        bg: 'from-indigo-50 to-purple-50',
        border: 'border-indigo-200',
        iconBg: 'from-indigo-500 to-purple-500',
        text: 'text-indigo-900',
        subtitle: 'text-indigo-600',
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
    rose: {
        bg: 'from-rose-50 to-pink-50',
        border: 'border-rose-200',
        iconBg: 'from-rose-500 to-pink-500',
        text: 'text-rose-900',
        subtitle: 'text-rose-600',
    },
};

export function StatsCard({
    title,
    value,
    icon,
    color,
    subtitle,
}: StatsCardProps) {
    const styles = colorStyles[color];

    return (
        <div
            className={cn(
                'group relative overflow-hidden rounded-2xl border-2 bg-gradient-to-br p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl',
                styles.bg,
                styles.border,
            )}
        >
            {/* Decorative Element */}
            <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/30 blur-2xl transition-all group-hover:scale-150" />

            <div className="relative z-10 flex items-center gap-4">
                <div
                    className={cn(
                        'flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg',
                        styles.iconBg,
                    )}
                >
                    <span className="text-2xl">{icon}</span>
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>
                    <p className={cn('text-3xl font-black', styles.text)}>
                        {value.toLocaleString()}
                    </p>
                    {subtitle && (
                        <p className={cn('text-xs', styles.subtitle)}>
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
