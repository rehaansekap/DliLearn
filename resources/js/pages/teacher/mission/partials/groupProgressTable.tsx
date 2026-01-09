import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Eye, FileCheck } from 'lucide-react';

interface GroupProgress {
    group_id: number;
    group_name: string;
    group_code: string | null;
    current_step: number;
    status: 'locked' | 'in_progress' | 'completed';
    members_count: number;
    has_submitted: boolean;
    is_graded: boolean;
}

interface GroupProgressTableProps {
    groups: GroupProgress[];
    missionId: number;
}

const statusConfig = {
    locked: {
        label: 'Terkunci',
        color: 'bg-slate-100 text-slate-700 border-slate-300',
    },
    in_progress: {
        label: 'Sedang Berlangsung',
        color: 'bg-amber-100 text-amber-700 border-amber-300',
    },
    completed: {
        label: 'Selesai',
        color: 'bg-green-100 text-green-700 border-green-300',
    },
};

const stepLabels = [
    'Belum Dimulai',
    'Orientasi Masalah',
    'Organisasi Tim',
    'Creative Lab',
    'Penyajian Hasil',
    'Evaluasi',
];

function ProgressBar({
    current,
    total = 5,
}: {
    current: number;
    total?: number;
}) {
    const percentage = Math.min((current / total) * 100, 100);

    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-600">
                    Step {current}/{total}
                </span>
                <span className="text-slate-500">
                    {Math.round(percentage)}%
                </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                    className={cn(
                        'h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500',
                    )}
                    style={{ width: `${percentage}%` }}
                    role="progressbar"
                    aria-valuenow={current}
                    aria-valuemin={0}
                    aria-valuemax={total}
                />
            </div>
            <p className="text-xs text-slate-500">
                {stepLabels[current] || 'Unknown'}
            </p>
        </div>
    );
}

export function GroupProgressTable({
    groups,
    missionId,
}: GroupProgressTableProps) {
    if (groups.length === 0) {
        return (
            <div className="flex min-h-[300px] items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-12">
                <div className="text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-200">
                        <span className="text-4xl">👥</span>
                    </div>
                    <h4 className="mb-2 text-lg font-bold text-slate-700">
                        Belum Ada Kelompok
                    </h4>
                    <p className="text-sm text-slate-500">
                        Belum ada kelompok yang mengerjakan misi ini
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
            {/* Table Header */}
            <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4">
                <h3 className="text-lg font-bold text-slate-800">
                    📊 Progress Kelompok
                </h3>
                <p className="text-sm text-slate-500">
                    Pantau perkembangan setiap kelompok
                </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-600 uppercase">
                                Kelompok
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-600 uppercase">
                                Anggota
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-600 uppercase">
                                Progress
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-600 uppercase">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-600 uppercase">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                        {groups.map((group) => (
                            <tr
                                key={group.group_id}
                                className="transition-colors hover:bg-slate-50"
                            >
                                {/* Group Name */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-md">
                                            <span className="font-bold">
                                                {group.group_name.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800">
                                                {group.group_name}
                                            </p>
                                            {group.group_code && (
                                                <p className="font-mono text-xs text-slate-500">
                                                    {group.group_code}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </td>

                                {/* Members Count */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-1 text-sm text-slate-600">
                                        <span>👥</span>
                                        <span className="font-medium">
                                            {group.members_count} Siswa
                                        </span>
                                    </div>
                                </td>

                                {/* Progress */}
                                <td className="px-6 py-4">
                                    <div className="min-w-[200px]">
                                        <ProgressBar
                                            current={group.current_step}
                                        />
                                    </div>
                                </td>

                                {/* Status Badge */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={cn(
                                            'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold',
                                            statusConfig[group.status].color,
                                        )}
                                    >
                                        {statusConfig[group.status].label}
                                    </span>
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/teacher/mission/${missionId}/group/${group.group_id}`}
                                            className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
                                        >
                                            <Eye className="h-4 w-4" />
                                            <span>Detail</span>
                                        </Link>

                                        {group.has_submitted && (
                                            <Link
                                                href={`/teacher/mission/${missionId}/group/${group.group_id}/grade`}
                                                className={cn(
                                                    'inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-semibold transition',
                                                    group.is_graded
                                                        ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                                                        : 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100',
                                                )}
                                            >
                                                <FileCheck className="h-4 w-4" />
                                                <span>
                                                    {group.is_graded
                                                        ? 'Sudah Dinilai'
                                                        : 'Beri Nilai'}
                                                </span>
                                            </Link>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Table Footer */}
            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
                <p className="text-sm text-slate-600">
                    Menampilkan{' '}
                    <span className="font-bold text-slate-800">
                        {groups.length}
                    </span>{' '}
                    kelompok
                </p>
            </div>
        </div>
    );
}
