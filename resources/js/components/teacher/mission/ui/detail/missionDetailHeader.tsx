import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

interface MissionDetailHeaderProps {
    mission: {
        slug: string;
        title: string;
        description: string;
        difficulty_level: number;
    };
    isMobile?: boolean;
    onDelete?: () => void;
}

export function MissionDetailHeader({
    mission,
    isMobile = false,
    onDelete,
}: MissionDetailHeaderProps) {
    return (
        <div
            className={cn(
                'rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50',
                isMobile ? 'p-4' : 'p-8',
            )}
        >
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                {/* Mobile Layout */}
                {isMobile && (
                    <div className="flex items-center gap-3">
                        <Link
                            href="/teacher/dashboard"
                            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 backdrop-blur-sm transition hover:opacity-90"
                        >
                            <ArrowLeft className="h-5 w-5 text-white" />
                        </Link>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-2xl shadow-lg">
                            🎯
                        </div>
                    </div>
                )}

                {/* Desktop Layout - Mission Info */}
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex">
                        <Link
                            href="/teacher/dashboard"
                            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 backdrop-blur-sm transition hover:opacity-90"
                        >
                            <ArrowLeft className="h-5 w-5 text-white" />
                        </Link>
                    </div>
                    {!isMobile && (
                        <div className="hidden h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-2xl shadow-lg sm:flex sm:h-16 sm:w-16 sm:text-3xl">
                            🎯
                        </div>
                    )}
                    <div>
                        <h1
                            className={cn(
                                'font-black text-slate-800',
                                isMobile ? 'text-xl' : 'text-3xl',
                            )}
                        >
                            {mission.title}
                        </h1>
                        <p
                            className={cn(
                                'mt-1 text-slate-600',
                                isMobile ? 'text-xs' : 'text-sm',
                            )}
                        >
                            {mission.description}
                        </p>
                        <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1 text-xs font-semibold text-indigo-700">
                            <span>⭐</span>
                            <span>Level {mission.difficulty_level}</span>
                        </div>
                    </div>
                </div>

                {/* Edit & Delete Buttons */}
                <div className="flex gap-2">
                    <Link
                        href={`/teacher/mission/${mission.slug}/edit`}
                        className="rounded-lg border-2 border-indigo-200 bg-white px-3 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
                    >
                        <Edit className="h-4 w-4" />
                    </Link>
                    {onDelete && (
                        <button
                            type="button"
                            onClick={onDelete}
                            title="Delete mission"
                            className="rounded-lg border-2 border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
