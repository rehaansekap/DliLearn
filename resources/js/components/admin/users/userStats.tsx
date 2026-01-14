import { cn } from '@/lib/utils';

interface UserStatsProps {
    stats: {
        totalUsers: number;
        totalStudents: number;
        totalTeachers: number;
        totalAdmins: number;
    };
}

const statItems = [
    {
        key: 'totalUsers',
        label: 'Total User',
        icon: '👥',
        color: 'from-slate-500 to-gray-600',
        bgColor: 'from-slate-50 to-gray-50',
        borderColor: 'border-slate-200',
    },
    {
        key: 'totalStudents',
        label: 'Siswa',
        icon: '👨‍🎓',
        color: 'from-indigo-500 to-purple-500',
        bgColor: 'from-indigo-50 to-purple-50',
        borderColor: 'border-indigo-200',
    },
    {
        key: 'totalTeachers',
        label: 'Guru',
        icon: '👨‍🏫',
        color: 'from-emerald-500 to-teal-500',
        bgColor: 'from-emerald-50 to-teal-50',
        borderColor: 'border-emerald-200',
    },
    {
        key: 'totalAdmins',
        label: 'Admin',
        icon: '👑',
        color: 'from-amber-500 to-orange-500',
        bgColor: 'from-amber-50 to-orange-50',
        borderColor: 'border-amber-200',
    },
];

export function UserStats({ stats }: UserStatsProps) {
    return (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {statItems.map((item) => (
                <div
                    key={item.key}
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
                                {stats[item.key as keyof typeof stats]}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
