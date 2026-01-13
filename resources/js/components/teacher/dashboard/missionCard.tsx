import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, Users } from 'lucide-react';
import { DeleteMissionButton } from './ui/deleteMissionButton';

interface ClassroomMission {
    id: number;
    title: string;
    description: string;
    difficulty_level: number;
    slug: string;
    classroom_name: string;
    classroom_id: number;
    total_groups: number;
    completed_groups: number;
    needs_review: number;
    started_at: string | null;
    finished_at: string | null;
}

interface MissionCardProps {
    mission: ClassroomMission;
    onDelete: (mission: { id: number; title: string; slug: string }) => void;
}

const levelColors = {
    1: {
        badge: 'from-green-400 to-emerald-500',
        label: 'Pemula',
    },
    2: {
        badge: 'from-blue-400 to-cyan-500',
        label: 'Menengah',
    },
    3: {
        badge: 'from-yellow-400 to-amber-500',
        label: 'Mahir',
    },
    4: {
        badge: 'from-orange-400 to-red-500',
        label: 'Expert',
    },
    5: {
        badge: 'from-red-500 to-pink-600',
        label: 'Master',
    },
};

export function MissionCard({ mission, onDelete }: MissionCardProps) {
    const colors =
        levelColors[mission.difficulty_level as keyof typeof levelColors] ||
        levelColors[1];

    const isActive = mission.started_at && !mission.finished_at;
    const isCompleted = mission.finished_at !== null;

    return (
        <div className="group relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-indigo-300 hover:shadow-xl">
            {/* Header */}
            <div className="relative h-36 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 p-5">
                {/* Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.2)_50%,transparent_75%)] bg-[length:60px_60px]" />
                </div>

                <div className="relative z-10">
                    {/* Classroom Name Badge */}
                    <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
                        <span className="text-xs">🏫</span>
                        <span className="text-xs font-semibold text-white">
                            {mission.classroom_name}
                        </span>
                    </div>

                    <h3 className="mb-1 line-clamp-2 text-lg font-bold text-white">
                        {mission.title}
                    </h3>
                    <p className="mb-4 line-clamp-2 text-sm text-indigo-100">
                        {mission.description}
                    </p>
                </div>

                {/* Level Badge */}
                <div className="absolute top-4 right-4">
                    <div
                        className={cn(
                            'flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold text-white shadow-lg',
                            `bg-gradient-to-r ${colors.badge}`,
                        )}
                    >
                        <span>⭐</span>
                        <span>Lv.{mission.difficulty_level}</span>
                    </div>
                </div>

                {/* Status Badge */}
                {isActive && (
                    <div className="absolute right-4 bottom-4">
                        <div className="flex items-center gap-1 rounded-full bg-green-500 px-2.5 py-1 text-xs font-semibold text-white shadow-lg">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                            <span>Aktif</span>
                        </div>
                    </div>
                )}

                {isCompleted && (
                    <div className="absolute right-4 bottom-4">
                        <div className="flex items-center gap-1 rounded-full bg-slate-500 px-2.5 py-1 text-xs font-semibold text-white shadow-lg">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Selesai</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="p-5">
                {/* Stats Row */}
                <div className="mb-4 grid grid-cols-3 gap-2">
                    <div className="flex flex-col items-center rounded-lg bg-blue-50 px-2 py-2">
                        <Users className="mb-1 h-4 w-4 text-blue-600" />
                        <span className="text-xs font-bold text-blue-900">
                            {mission.total_groups}
                        </span>
                        <span className="text-[10px] text-blue-600">
                            Kelompok
                        </span>
                    </div>
                    <div className="flex flex-col items-center rounded-lg bg-green-50 px-2 py-2">
                        <CheckCircle2 className="mb-1 h-4 w-4 text-green-600" />
                        <span className="text-xs font-bold text-green-900">
                            {mission.completed_groups}
                        </span>
                        <span className="text-[10px] text-green-600">
                            Selesai
                        </span>
                    </div>
                    <div className="flex flex-col items-center rounded-lg bg-amber-50 px-2 py-2">
                        <AlertCircle className="mb-1 h-4 w-4 text-amber-600" />
                        <span className="text-xs font-bold text-amber-900">
                            {mission.needs_review}
                        </span>
                        <span className="text-[10px] text-amber-600">
                            Review
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <Link
                        href={`/teacher/mission/${mission.slug}`}
                        className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow transition-all hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg"
                    >
                        Lihat Detail
                    </Link>
                    <Link
                        href={`/teacher/mission/${mission.slug}/edit`}
                        className="rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                        Edit
                    </Link>
                    <DeleteMissionButton
                        onClick={() =>
                            onDelete({
                                id: mission.id,
                                title: mission.title,
                                slug: mission.slug,
                            })
                        }
                    />
                </div>
            </div>
        </div>
    );
}
