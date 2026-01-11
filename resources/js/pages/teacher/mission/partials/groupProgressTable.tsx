import { cn } from '@/lib/utils';
import { Eye } from 'lucide-react';

interface Member {
    id: number;
    name: string;
    avatar?: string | null;
}

interface GroupProgress {
    group_id: number;
    group_name: string;
    members: Member[];
    step1_status: 'locked' | 'in_progress' | 'completed';
    step2_status: 'locked' | 'in_progress' | 'completed';
    step3_status: 'locked' | 'in_progress' | 'completed';
    step4_status: 'locked' | 'in_progress' | 'completed';
    step5_status: 'locked' | 'in_progress' | 'completed';
    current_step: number;
    has_submission: boolean;
}

interface GroupProgressTableProps {
    groups: GroupProgress[];
    onViewDetail: (groupId: number) => void;
}

const stepLabels = [
    'Orientasi',
    'Organisasi',
    'Creative Lab',
    'Penyajian',
    'Evaluasi',
];

function StatusBadge({
    status,
}: {
    status: 'locked' | 'in_progress' | 'completed';
}) {
    const styles = {
        locked: 'bg-slate-200 border-slate-300',
        in_progress: 'bg-amber-200 border-amber-300 animate-pulse',
        completed: 'bg-green-200 border-green-300',
    };

    return (
        <div
            className={cn(
                'h-3 w-3 rounded-full border-2 transition-all',
                styles[status],
            )}
            title={
                status === 'completed'
                    ? 'Selesai'
                    : status === 'in_progress'
                      ? 'Sedang Proses'
                      : 'Terkunci'
            }
        />
    );
}

function MemberAvatarStack({ members }: { members: Member[] }) {
    const displayMembers = members.slice(0, 3);
    const remaining = Math.max(0, members.length - 3);

    return (
        <div className="flex items-center">
            <div className="flex -space-x-2">
                {displayMembers.map((member, idx) => (
                    <div
                        key={member.id}
                        className="relative inline-block h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-gradient-to-br from-indigo-400 to-purple-500 shadow-sm"
                        title={member.name}
                        style={{ zIndex: displayMembers.length - idx }}
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-md">
                            <span className="text-sm font-bold">
                                {(member.name || '?').charAt(0)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            {remaining > 0 && (
                <span className="ml-2 text-xs font-medium text-slate-500">
                    +{remaining}
                </span>
            )}
        </div>
    );
}

export function GroupProgressTable({
    groups,
    onViewDetail,
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
                    Pantau perkembangan setiap kelompok secara real-time
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
                            {stepLabels.map((label, idx) => (
                                <th
                                    key={idx}
                                    className="px-6 py-3 text-center text-xs font-semibold tracking-wider text-slate-600 uppercase"
                                >
                                    <div className="flex flex-col items-center gap-1">
                                        <span>Tahap {idx + 1}</span>
                                        <span className="text-[10px] font-normal text-slate-400">
                                            {label}
                                        </span>
                                    </div>
                                </th>
                            ))}
                            <th className="px-6 py-3 text-center text-xs font-semibold tracking-wider text-slate-600 uppercase">
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
                                            <p className="text-xs text-slate-500">
                                                Step {group.current_step}/5
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                {/* Members */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <MemberAvatarStack
                                        members={group.members}
                                    />
                                </td>

                                {/* Step Status */}
                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center">
                                        <StatusBadge
                                            status={group.step1_status}
                                        />
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center">
                                        <StatusBadge
                                            status={group.step2_status}
                                        />
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center">
                                        <StatusBadge
                                            status={group.step3_status}
                                        />
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center">
                                        <StatusBadge
                                            status={group.step4_status}
                                        />
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center">
                                        <StatusBadge
                                            status={group.step5_status}
                                        />
                                    </div>
                                </td>

                                {/* Action */}
                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                    <button
                                        onClick={() =>
                                            onViewDetail(group.group_id)
                                        }
                                        className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
                                    >
                                        <Eye className="h-4 w-4" />
                                        <span>Detail</span>
                                    </button>
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
