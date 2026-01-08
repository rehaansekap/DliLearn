interface StatsOverviewProps {
    level: number;
    xp: number;
}

export function StatsOverview({ level, xp }: StatsOverviewProps) {
    const xpPerLevel = 100;
    const xpProgress = xp % xpPerLevel;
    const xpToNextLevel = xpPerLevel - xpProgress;
    const progressPercentage = (xpProgress / xpPerLevel) * 100;

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Level Card */}
            <div className="group relative overflow-hidden rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl sm:p-8">
                <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-amber-200/30 blur-3xl" />

                <div className="relative z-0 flex items-center gap-4">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 shadow-lg sm:h-20 sm:w-20">
                        <span className="text-3xl sm:text-4xl">⭐</span>
                    </div>
                    <div className="flex-1">
                        <p className="mb-1 text-sm font-medium tracking-wide text-amber-700 uppercase">
                            Level Kamu
                        </p>
                        <p className="text-4xl font-black text-amber-900 sm:text-5xl">
                            {level}
                        </p>
                        <p className="mt-1 text-xs text-amber-600">
                            Tingkat Keahlian
                        </p>
                    </div>
                </div>

                {/* Decorative dots */}
                <div className="absolute right-4 bottom-4 flex gap-1 opacity-20">
                    <div className="h-2 w-2 rounded-full bg-amber-600" />
                    <div className="h-2 w-2 rounded-full bg-amber-600" />
                    <div className="h-2 w-2 rounded-full bg-amber-600" />
                </div>
            </div>

            {/* XP Card with Progress */}
            <div className="group relative overflow-hidden rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl sm:p-8">
                <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-indigo-200/30 blur-3xl" />

                <div className="relative z-0">
                    <div className="mb-4 flex items-center gap-4">
                        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg sm:h-20 sm:w-20">
                            <span className="text-3xl sm:text-4xl">⚡</span>
                        </div>
                        <div className="flex-1">
                            <p className="mb-1 text-sm font-medium tracking-wide text-indigo-700 uppercase">
                                Experience Points
                            </p>
                            <p className="text-4xl font-black text-indigo-900 sm:text-5xl">
                                {xp}
                            </p>
                            <p className="mt-1 text-xs text-indigo-600">
                                {xpToNextLevel} XP lagi ke Level {level + 1}
                            </p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-indigo-700">
                            <span className="font-medium">Progress</span>
                            <span className="font-bold">
                                {Math.round(progressPercentage)}%
                            </span>
                        </div>
                        <div className="h-3 w-full overflow-hidden rounded-full bg-indigo-200/50">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg transition-all duration-500"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Decorative dots */}
                <div className="absolute right-4 bottom-4 flex gap-1 opacity-20">
                    <div className="h-2 w-2 rounded-full bg-indigo-600" />
                    <div className="h-2 w-2 rounded-full bg-indigo-600" />
                    <div className="h-2 w-2 rounded-full bg-indigo-600" />
                </div>
            </div>
        </div>
    );
}
