import { Check, Users, X } from 'lucide-react';

interface GroupStatsProps {
    totalStudents: number;
    assignedCount: number;
    unassignedCount: number;
    totalGroups: number;
}

export function GroupStats({
    totalStudents,
    assignedCount,
    unassignedCount,
    totalGroups,
}: GroupStatsProps) {
    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {/* Total Students */}
            <div className="group relative overflow-hidden rounded-xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-4 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/30 blur-2xl transition-all group-hover:scale-150" />
                <div className="relative z-10 flex items-center gap-3">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg">
                        <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-indigo-700">
                            Total Siswa
                        </p>
                        <p className="text-3xl font-black text-indigo-900">
                            {totalStudents}
                        </p>
                    </div>
                </div>
            </div>

            {/* Assigned Students */}
            <div className="group relative overflow-hidden rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-4 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/30 blur-2xl transition-all group-hover:scale-150" />
                <div className="relative z-10 flex items-center gap-3">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg">
                        <Check className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-green-700">
                            Dalam Kelompok
                        </p>
                        <p className="text-3xl font-black text-green-900">
                            {assignedCount}
                        </p>
                    </div>
                </div>
            </div>

            {/* Unassigned Students */}
            <div className="group relative overflow-hidden rounded-xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-pink-50 p-4 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/30 blur-2xl transition-all group-hover:scale-150" />
                <div className="relative z-10 flex items-center gap-3">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-pink-500 shadow-lg">
                        <X className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-red-700">
                            Belum Kelompok
                        </p>
                        <p className="text-3xl font-black text-red-900">
                            {unassignedCount}
                        </p>
                    </div>
                </div>
            </div>

            {/* Total Groups */}
            <div className="group relative overflow-hidden rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/30 blur-2xl transition-all group-hover:scale-150" />
                <div className="relative z-10 flex items-center gap-3">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg">
                        <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-amber-700">
                            Total Kelompok
                        </p>
                        <p className="text-3xl font-black text-amber-900">
                            {totalGroups}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
