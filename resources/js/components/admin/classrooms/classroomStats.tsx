import { cn } from '@/lib/utils';

interface ClassroomStatsProps {
    stats: {
        totalClassrooms: number;
        totalStudents: number;
        averageStudents: number;
        mostPopular: {
            name: string;
            count: number;
        } | null;
    };
}

export function ClassroomStats({ stats }: ClassroomStatsProps) {
    const statItems = [
        {
            label: 'Total Kelas',
            value: stats.totalClassrooms,
            icon: '🏫',
            color: 'from-indigo-500 to-purple-500',
            bgColor: 'from-indigo-50 to-purple-50',
            borderColor: 'border-indigo-200',
        },
        {
            label: 'Total Siswa',
            value: stats.totalStudents,
            icon: '👨‍🎓',
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'from-blue-50 to-cyan-50',
            borderColor: 'border-blue-200',
        },
        {
            label: 'Rata-rata Siswa',
            value: stats.averageStudents,
            icon: '📊',
            color: 'from-emerald-500 to-teal-500',
            bgColor: 'from-emerald-50 to-teal-50',
            borderColor: 'border-emerald-200',
        },
        {
            label: 'Kelas Terpopuler',
            value: stats.mostPopular?.name || '-',
            subtitle: stats.mostPopular
                ? `${stats.mostPopular.count} siswa`
                : 'Belum ada data',
            icon: '🏆',
            color: 'from-amber-500 to-orange-500',
            bgColor: 'from-amber-50 to-orange-50',
            borderColor: 'border-amber-200',
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {statItems.map((item, index) => (
                <div
                    key={index}
                    className={cn(
                        'group relative overflow-hidden rounded-2xl border-2 bg-gradient-to-br p-4 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl sm:p-6',
                        item.bgColor,
                        item.borderColor,
                    )}
                >
                    <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/30 blur-2xl transition-all group-hover:scale-150" />
                    <div className="relative z-10 flex items-center gap-3 sm:gap-4">
                        <div
                            className={cn(
                                'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg sm:h-14 sm:w-14',
                                item.color,
                            )}
                        >
                            <span className="text-2xl sm:text-3xl">
                                {item.icon}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-700">
                                {item.label}
                            </p>
                            <p className="text-3xl font-black text-slate-900 sm:text-4xl">
                                {item.value}
                            </p>
                            {item.subtitle && (
                                <p className="text-xs text-slate-500">
                                    {item.subtitle}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
