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
        color: 'from-blue-500 to-cyan-500',
        bgColor: 'from-blue-50 to-cyan-50',
        borderColor: 'border-blue-200',
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
        color: 'from-purple-500 to-pink-500',
        bgColor: 'from-purple-50 to-pink-50',
        borderColor: 'border-purple-200',
    },
];

export function UserStats({ stats }: UserStatsProps) {
    return (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {statItems.map((item) => (
                <div
                    key={item.key}
                    className={cn(
                        'group relative overflow-hidden rounded-2xl border-2 bg-gradient-to-br p-4 shadow-lg transition-all hover:scale-105 sm:p-6',
                        item.bgColor,
                        item.borderColor,
                    )}
                >
                    <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/30 blur-2xl transition-all group-hover:scale-150" />
                    <div className="relative z-10 flex items-center gap-3">
                        <div
                            className={cn(
                                'flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg',
                                item.color,
                            )}
                        >
                            <span className="text-2xl">{item.icon}</span>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-600">
                                {item.label}
                            </p>
                            <p className="text-2xl font-black text-slate-800">
                                {stats[item.key as keyof typeof stats]}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
