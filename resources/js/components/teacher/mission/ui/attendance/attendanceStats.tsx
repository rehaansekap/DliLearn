import { cn } from '@/lib/utils';
import { Check, Users, X } from 'lucide-react';

interface AttendanceStatsProps {
    totalStudents: number;
    presentCount: number;
    absentCount: number;
}

export function AttendanceStats({
    totalStudents,
    presentCount,
    absentCount,
}: AttendanceStatsProps) {
    const percentage =
        totalStudents > 0 ? (presentCount / totalStudents) * 100 : 0;

    return (
        <div className="space-y-4">
            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Total Students */}
                <div className="group relative overflow-hidden rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-4 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                    <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/30 blur-2xl transition-all group-hover:scale-150" />
                    <div className="relative z-10 flex items-center gap-3">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                            <Users className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-blue-700">
                                Total Siswa
                            </p>
                            <p className="text-3xl font-black text-blue-900">
                                {totalStudents}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Present Count */}
                <div className="group relative overflow-hidden rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-4 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                    <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/30 blur-2xl transition-all group-hover:scale-150" />
                    <div className="relative z-10 flex items-center gap-3">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg">
                            <Check className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-green-700">
                                Hadir
                            </p>
                            <p className="text-3xl font-black text-green-900">
                                {presentCount}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Absent Count */}
                <div className="group relative overflow-hidden rounded-xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-gray-50 p-4 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                    <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/30 blur-2xl transition-all group-hover:scale-150" />
                    <div className="relative z-10 flex items-center gap-3">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-500 to-gray-500 shadow-lg">
                            <X className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-700">
                                Tidak Hadir
                            </p>
                            <p className="text-3xl font-black text-slate-900">
                                {absentCount}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700">
                        Persentase Kehadiran
                    </span>
                    <span
                        className={cn(
                            'text-lg font-black',
                            percentage >= 80
                                ? 'text-green-600'
                                : percentage >= 50
                                  ? 'text-amber-600'
                                  : 'text-red-600',
                        )}
                    >
                        {percentage.toFixed(0)}%
                    </span>
                </div>
                <div className="relative h-4 overflow-hidden rounded-full bg-slate-200">
                    <div
                        className={cn(
                            'h-full rounded-full transition-all duration-500',
                            percentage >= 80
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                : percentage >= 50
                                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500'
                                  : 'bg-gradient-to-r from-red-500 to-pink-500',
                        )}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                    {presentCount} dari {totalStudents} siswa hadir (
                    {absentCount} tidak hadir)
                </p>
            </div>
        </div>
    );
}
