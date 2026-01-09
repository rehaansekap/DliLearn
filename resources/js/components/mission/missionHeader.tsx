import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface MissionHeaderProps {
    title: string;
    description?: string;
    level: number;
    role?: string;
}

export function MissionHeader({
    title,
    description,
    level,
    role,
}: MissionHeaderProps) {
    return (
        <div className="mb-8 overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-purple-50 to-teal-50 shadow-lg">
            <div className="p-4 sm:p-8">
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:gap-6">
                    <Link
                        href="/dashboard"
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600/80 backdrop-blur-sm transition hover:bg-indigo-700/30"
                    >
                        <ArrowLeft className="h-5 w-5 text-white" />
                    </Link>
                    {/* Mission Icon */}
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl shadow-lg sm:h-16 sm:w-16 sm:text-3xl">
                        🚀
                    </div>

                    {/* Mission Info */}
                    <div className="min-w-0 flex-1">
                        <h1 className="mb-2 text-lg font-black break-words whitespace-normal text-slate-800 sm:text-3xl">
                            {title}
                        </h1>
                        {description && (
                            <p className="text-sm text-slate-700 sm:text-base">
                                {description}
                            </p>
                        )}

                        {/* Badges */}
                        <div className="mt-4 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
                            <span className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm sm:text-sm">
                                ⚡ Difficulty:{' '}
                                <span className="font-bold text-indigo-600">
                                    Level {level}
                                </span>
                            </span>
                            {role && (
                                <span className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm sm:text-sm">
                                    👤 Role:{' '}
                                    <span className="font-bold text-purple-600">
                                        {role}
                                    </span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
