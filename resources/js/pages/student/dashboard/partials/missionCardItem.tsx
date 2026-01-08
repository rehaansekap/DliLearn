import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';

interface Mission {
    id: number;
    title: string;
    description: string;
    level: number;
    slug: string;
    status: string;
    locked: boolean;
    prerequisite?: {
        id: number;
        title: string;
        slug: string;
    } | null;
    started_at?: string | null;
    finished_at?: string | null;
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
    const parseDate = (v?: string | null) => {
        try {
            return v ? new Date(v) : null;
        } catch {
            return null;
        }
    };

    const started = parseDate(mission.started_at);
    const finished =
        parseDate(mission.finished_at) ?? (started ? new Date() : null);

    let minutesText = '—';
    if (
        started &&
        finished &&
        !Number.isNaN(started.getTime()) &&
        !Number.isNaN(finished.getTime())
    ) {
        const mins = Math.max(
            0,
            Math.round((finished.getTime() - started.getTime()) / 60000),
        );
        minutesText = `${mins} menit`;
    }

    const colors =
        levelColors[mission.level as keyof typeof levelColors] ||
        levelColors[1];

    if (mission.locked) {
        return (
            <div
                className={cn(
                    'group relative overflow-hidden rounded-2xl border-2 bg-white shadow-lg',
                    'border-slate-300 opacity-60',
                )}
            >
                {/* Lock Overlay */}
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
                    <div className="text-center">
                        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg">
                            <span className="text-4xl">🔒</span>
                        </div>
                        <p className="mb-1 text-sm font-bold text-white">
                            Misi Terkunci
                        </p>
                        {mission.prerequisite && (
                            <p className="px-4 text-xs text-slate-200">
                                Selesaikan "{mission.prerequisite.title}" dulu
                            </p>
                        )}
                    </div>
                </div>

                {/* Thumbnail (grayscale) */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 grayscale">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/60 shadow-lg backdrop-blur-sm">
                            <span className="text-5xl opacity-50">🎯</span>
                        </div>
                    </div>

                    {/* Level Badge (grayed) */}
                    <div className="absolute top-4 right-4 opacity-50">
                        <div className="flex items-center gap-1.5 rounded-full bg-slate-400 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                            <span className="text-sm">⭐</span>
                            <span>Level {mission.level}</span>
                        </div>
                    </div>
                </div>

                {/* Content (muted) */}
                <div className="p-6">
                    <h3 className="mb-2 line-clamp-2 text-xl font-black text-slate-500">
                        {mission.title}
                    </h3>
                    <p className="mb-4 line-clamp-2 text-sm text-slate-400">
                        {mission.description}
                    </p>

                    <div className="mb-4 flex items-center gap-3">
                        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500">
                            <span>🎓</span>
                            {levelLabels[
                                mission.level as keyof typeof levelLabels
                            ] || 'Pemula'}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500">
                            <span>⏱️</span>
                            {minutesText}
                        </span>
                    </div>

                    {/* Disabled Button */}
                    <button
                        disabled
                        className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-300 px-6 py-3 font-bold text-slate-500"
                    >
                        <span>🔒 Terkunci</span>
                    </button>
                </div>

                <div className="absolute right-0 bottom-0 h-24 w-24 translate-x-8 translate-y-8 rounded-full bg-slate-200 opacity-20" />
            </div>
        );
    }

    return (
        <div
            className={cn(
                'group relative overflow-hidden rounded-2xl border-2 bg-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl',
                colors.border,
            )}
        >
            {/* Thumbnail with Gradient */}
            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(99,102,241,.1)_50%,transparent_75%,transparent_100%)] bg-[length:40px_40px]" />
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/80 shadow-lg backdrop-blur-sm">
                        <span className="text-5xl">🎯</span>
                    </div>
                </div>

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

                {mission.status === 'in_progress' && (
                    <div className="absolute top-4 left-4">
                        <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                            <span className="text-sm">⚡</span>
                            <span>Sedang Berjalan</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6">
                <h3 className="mb-2 line-clamp-2 text-xl font-black text-slate-800">
                    {mission.title}
                </h3>

                <p className="mb-4 line-clamp-2 text-sm text-slate-600">
                    {mission.description}
                </p>

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
                        {minutesText}
                    </span>
                </div>

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

                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover/btn:translate-x-full" />
                </Link>
            </div>

            <div className="absolute right-0 bottom-0 h-24 w-24 translate-x-8 translate-y-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 opacity-20" />
        </div>
    );
}
