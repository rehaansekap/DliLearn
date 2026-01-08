import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';

interface Mission {
    id: number;
    title: string;
    description: string;
    level: number;
    slug: string;
    status: string;
}

interface MissionCardItemProps {
    mission: Mission;
}

const levelColors = {
    1: {
        badge: 'from-green-400 to-emerald-500',
        text: 'text-green-700',
        bg: 'bg-green-50',
        border: 'border-green-200',
    },
    2: {
        badge: 'from-blue-400 to-cyan-500',
        text: 'text-blue-700',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
    },
    3: {
        badge: 'from-yellow-400 to-amber-500',
        text: 'text-yellow-700',
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
    },
    4: {
        badge: 'from-orange-400 to-red-500',
        text: 'text-orange-700',
        bg: 'bg-orange-50',
        border: 'border-orange-200',
    },
    5: {
        badge: 'from-red-500 to-pink-600',
        text: 'text-red-700',
        bg: 'bg-red-50',
        border: 'border-red-200',
    },
};

const levelLabels = {
    1: 'Pemula',
    2: 'Menengah',
    3: 'Mahir',
    4: 'Expert',
    5: 'Master',
};

export function MissionCardItem({ mission }: MissionCardItemProps) {
    const colors =
        levelColors[mission.level as keyof typeof levelColors] ||
        levelColors[1];

    return (
        <div
            className={cn(
                'group relative overflow-hidden rounded-2xl border-2 bg-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl',
                colors.border,
            )}
        >
            {/* Thumbnail with Gradient */}
            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
                {/* Pattern Overlay */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(99,102,241,.1)_50%,transparent_75%,transparent_100%)] bg-[length:40px_40px]" />
                </div>

                {/* Mission Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/80 shadow-lg backdrop-blur-sm">
                        <span className="text-5xl">🎯</span>
                    </div>
                </div>

                {/* Level Badge */}
                <div className="absolute top-4 right-4">
                    <div
                        className={cn(
                            'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-white shadow-lg',
                            `bg-gradient-to-r ${colors.badge}`,
                        )}
                    >
                        <span className="text-sm">⭐</span>
                        <span>Level {mission.level}</span>
                    </div>
                </div>

                {/* Status Badge (if in progress) */}
                {mission.status === 'in_progress' && (
                    <div className="absolute top-4 left-4">
                        <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                            <span className="text-sm">⚡</span>
                            <span>Sedang Berjalan</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Title */}
                <h3 className="mb-2 line-clamp-2 text-xl font-black text-slate-800">
                    {mission.title}
                </h3>

                {/* Description */}
                <p className="mb-4 line-clamp-2 text-sm text-slate-600">
                    {mission.description}
                </p>

                {/* Meta Info */}
                <div className="mb-4 flex items-center gap-3">
                    <span
                        className={cn(
                            'inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium',
                            colors.bg,
                            colors.text,
                        )}
                    >
                        <span>🎓</span>
                        {levelLabels[
                            mission.level as keyof typeof levelLabels
                        ] || 'Pemula'}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                        <span>⏱️</span>
                        ~60 menit
                    </span>
                </div>

                {/* Action Button */}
                <Link
                    href={`/mission/${mission.slug}`}
                    className={cn(
                        'group/btn relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl',
                        mission.status === 'in_progress'
                            ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700'
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700',
                    )}
                >
                    <span className="relative z-0 flex items-center gap-2">
                        <span>
                            {mission.status === 'in_progress'
                                ? '⚡ Lanjutkan Petualangan'
                                : '🚀 Mulai Petualangan'}
                        </span>
                        <svg
                            className="h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                        </svg>
                    </span>

                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover/btn:translate-x-full" />
                </Link>
            </div>

            {/* Corner decoration */}
            <div className="absolute right-0 bottom-0 h-24 w-24 translate-x-8 translate-y-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 opacity-20" />
        </div>
    );
}
