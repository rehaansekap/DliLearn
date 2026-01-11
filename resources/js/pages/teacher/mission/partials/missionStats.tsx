import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, Loader2, Users } from 'lucide-react';

interface MissionStatsProps {
    totalGroups: number;
    completedGroups: number;
    inProgressGroups: number;
    notStartedGroups: number;
}

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: 'blue' | 'green' | 'amber' | 'slate';
    subtitle?: string;
}

const colorStyles = {
    blue: {
        bg: 'from-blue-50 to-cyan-50',
        border: 'border-blue-200',
        iconBg: 'from-blue-500 to-cyan-500',
        text: 'text-blue-900',
        subtitle: 'text-blue-600',
    },
    green: {
        bg: 'from-green-50 to-emerald-50',
        border: 'border-green-200',
        iconBg: 'from-green-500 to-emerald-500',
        text: 'text-green-900',
        subtitle: 'text-green-600',
    },
    amber: {
        bg: 'from-amber-50 to-yellow-50',
        border: 'border-amber-200',
        iconBg: 'from-amber-500 to-yellow-500',
        text: 'text-amber-900',
        subtitle: 'text-amber-600',
    },
    slate: {
        bg: 'from-slate-50 to-gray-50',
        border: 'border-slate-200',
        iconBg: 'from-slate-500 to-gray-500',
        text: 'text-slate-900',
        subtitle: 'text-slate-600',
    },
};

function StatCard({ title, value, icon, color, subtitle }: StatCardProps) {
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
                    <div className="text-white">{icon}</div>
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

export function MissionStats({
    totalGroups,
    completedGroups,
    inProgressGroups,
    notStartedGroups,
}: MissionStatsProps) {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
                title="Total Kelompok"
                value={totalGroups}
                icon={<Users className="h-6 w-6" />}
                color="blue"
                subtitle="Mengerjakan misi ini"
            />
            <StatCard
                title="Selesai"
                value={completedGroups}
                icon={<CheckCircle2 className="h-6 w-6" />}
                color="green"
                subtitle="Misi telah diselesaikan"
            />
            <StatCard
                title="Sedang Mengerjakan"
                value={inProgressGroups}
                icon={<Loader2 className="h-6 w-6" />}
                color="amber"
                subtitle="Progress berlangsung"
            />
            <StatCard
                title="Belum Mulai"
                value={notStartedGroups}
                icon={<Clock className="h-6 w-6" />}
                color="slate"
                subtitle="Menunggu dimulai"
            />
        </div>
    );
}
