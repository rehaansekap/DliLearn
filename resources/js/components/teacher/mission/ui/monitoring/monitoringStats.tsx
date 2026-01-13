import { Activity, AlertCircle, Trophy } from 'lucide-react';

interface MonitoringStatsProps {
    activeGroups: number;
    completedGroups: number;
    needsReview: number;
}

export function MonitoringStats({
    activeGroups,
    completedGroups,
    needsReview,
}: MonitoringStatsProps) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Active Groups */}
            <div className="group relative overflow-hidden rounded-xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-4 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/30 blur-2xl transition-all group-hover:scale-150" />
                <div className="relative z-10 flex items-center gap-3">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg">
                        <Activity className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-indigo-700">
                            Kelompok Aktif
                        </p>
                        <p className="text-3xl font-black text-indigo-900">
                            {activeGroups}
                        </p>
                    </div>
                </div>
            </div>

            {/* Completed Groups */}
            <div className="group relative overflow-hidden rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-4 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/30 blur-2xl transition-all group-hover:scale-150" />
                <div className="relative z-10 flex items-center gap-3">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
                        <Trophy className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-emerald-700">
                            Misi Selesai
                        </p>
                        <p className="text-3xl font-black text-emerald-900">
                            {completedGroups}
                        </p>
                    </div>
                </div>
            </div>

            {/* Needs Review */}
            <div className="group relative overflow-hidden rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/30 blur-2xl transition-all group-hover:scale-150" />
                <div className="relative z-10 flex items-center gap-3">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg">
                        <AlertCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-amber-700">
                            Perlu Review
                        </p>
                        <p className="text-3xl font-black text-amber-900">
                            {needsReview}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
