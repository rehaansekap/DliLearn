import { cn } from '@/lib/utils';
import { ChevronDown, Eye, MessageCircle } from 'lucide-react';
import { useState } from 'react';

interface Student {
    id: number;
    name: string;
    avatar?: string | null;
}

interface Reflection {
    user_id: number;
    user_name: string;
    content: string;
    created_at: string;
    type: 'initial' | 'final';
}

interface GroupMonitoring {
    group_id: number;
    group_name: string;
    group_code: string;
    members: Student[];
    step1_status: 'locked' | 'in_progress' | 'completed';
    step2_status: 'locked' | 'in_progress' | 'completed';
    step3_status: 'locked' | 'in_progress' | 'completed';
    step4_status: 'locked' | 'in_progress' | 'completed';
    step5_status: 'locked' | 'in_progress' | 'completed';
    current_step: number;
    reflections: Reflection[];
}

interface TabMonitoringProps {
    groups: GroupMonitoring[];
    onViewSubmission: (groupId: number) => void;
}

const stepLabels = [
    'Orientasi',
    'Organisasi',
    'Creative Lab',
    'Penyajian',
    'Evaluasi',
];

function StatusDot({
    status,
}: {
    status: 'locked' | 'in_progress' | 'completed';
}) {
    const styles = {
        locked: 'bg-slate-300',
        in_progress: 'bg-amber-400 animate-pulse',
        completed: 'bg-green-500',
    };

    return <div className={cn('h-3 w-3 rounded-full', styles[status])} />;
}

export function TabMonitoring({
    groups,
    onViewSubmission,
}: TabMonitoringProps) {
    const [expandedGroups, setExpandedGroups] = useState<Set<number>>(
        new Set(),
    );

    const toggleGroup = (groupId: number) => {
        setExpandedGroups((prev) => {
            const next = new Set(prev);
            if (next.has(groupId)) {
                next.delete(groupId);
            } else {
                next.add(groupId);
            }
            return next;
        });
    };

    return (
        <div className="space-y-6">
            {/* Header Card */}
            <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
                <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-2xl shadow-lg">
                        📊
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            Monitoring & Refleksi
                        </h2>
                        <p className="text-sm text-slate-600">
                            Pantau progress dan lihat refleksi setiap siswa
                        </p>
                    </div>
                </div>
            </div>

            {/* Progress Matrix Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4">
                    <h3 className="text-lg font-bold text-slate-800">
                        📈 Progress Matrix
                    </h3>
                    <p className="text-sm text-slate-500">
                        Status setiap tahap per kelompok
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-600 uppercase">
                                    Kelompok
                                </th>
                                {stepLabels.map((label, idx) => (
                                    <th
                                        key={idx}
                                        className="px-6 py-3 text-center text-xs font-semibold tracking-wider text-slate-600 uppercase"
                                    >
                                        <div className="flex flex-col items-center gap-1">
                                            <span>T-{idx + 1}</span>
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
                        <tbody className="divide-y divide-slate-200">
                            {groups.map((group) => (
                                <tr
                                    key={group.group_id}
                                    className="hover:bg-slate-50"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 font-bold text-white shadow-md">
                                                {group.group_name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800">
                                                    {group.group_name}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {group.group_code}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                            <StatusDot
                                                status={group.step1_status}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                            <StatusDot
                                                status={group.step2_status}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                            <StatusDot
                                                status={group.step3_status}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                            <StatusDot
                                                status={group.step4_status}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                            <StatusDot
                                                status={group.step5_status}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() =>
                                                onViewSubmission(group.group_id)
                                            }
                                            className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
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
            </div>

            {/* Reflection Log (Accordion) */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                <div className="border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4">
                    <h3 className="text-lg font-bold text-slate-800">
                        💬 Log Refleksi Siswa
                    </h3>
                    <p className="text-sm text-slate-500">
                        Jawaban refleksi awal & akhir per kelompok
                    </p>
                </div>

                <div className="divide-y divide-slate-200">
                    {groups.map((group) => {
                        const isExpanded = expandedGroups.has(group.group_id);
                        const initialReflections = group.reflections.filter(
                            (r) => r.type === 'initial',
                        );
                        const finalReflections = group.reflections.filter(
                            (r) => r.type === 'final',
                        );

                        return (
                            <div key={group.group_id}>
                                {/* Accordion Header */}
                                <button
                                    onClick={() => toggleGroup(group.group_id)}
                                    className="flex w-full items-center justify-between px-6 py-4 text-left transition hover:bg-slate-50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 font-bold text-white">
                                            {group.group_name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800">
                                                {group.group_name}
                                            </p>
                                            <p className="flex items-center gap-2 text-xs text-slate-500">
                                                <MessageCircle className="h-3 w-3" />
                                                <span>
                                                    {group.reflections.length}{' '}
                                                    refleksi
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronDown
                                        className={cn(
                                            'h-5 w-5 text-slate-400 transition-transform',
                                            isExpanded && 'rotate-180',
                                        )}
                                    />
                                </button>

                                {/* Accordion Content */}
                                {isExpanded && (
                                    <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">
                                        {/* Members */}
                                        <div className="mb-4">
                                            <p className="mb-2 text-xs font-semibold text-slate-600 uppercase">
                                                Anggota
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {group.members.map((member) => (
                                                    <div
                                                        key={member.id}
                                                        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5"
                                                    >
                                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-xs font-bold text-white">
                                                            {member.name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>
                                                        <span className="text-sm font-medium text-slate-700">
                                                            {member.name}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Initial Reflections */}
                                        {initialReflections.length > 0 && (
                                            <div className="mb-4">
                                                <p className="mb-2 text-xs font-semibold text-slate-600 uppercase">
                                                    🤔 Refleksi Awal (Tahap 1)
                                                </p>
                                                <div className="space-y-2">
                                                    {initialReflections.map(
                                                        (reflection) => (
                                                            <div
                                                                key={`${reflection.user_id}-initial`}
                                                                className="rounded-lg border border-green-200 bg-green-50 p-3"
                                                            >
                                                                <p className="mb-1 text-xs font-semibold text-green-900">
                                                                    {
                                                                        reflection.user_name
                                                                    }
                                                                </p>
                                                                <p className="text-sm text-green-800">
                                                                    {
                                                                        reflection.content
                                                                    }
                                                                </p>
                                                                <p className="mt-1 text-xs text-green-600">
                                                                    {new Date(
                                                                        reflection.created_at,
                                                                    ).toLocaleDateString(
                                                                        'id-ID',
                                                                        {
                                                                            day: 'numeric',
                                                                            month: 'short',
                                                                            year: 'numeric',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit',
                                                                        },
                                                                    )}
                                                                </p>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Final Reflections */}
                                        {finalReflections.length > 0 && (
                                            <div>
                                                <p className="mb-2 text-xs font-semibold text-slate-600 uppercase">
                                                    ✅ Refleksi Akhir (Tahap 5)
                                                </p>
                                                <div className="space-y-2">
                                                    {finalReflections.map(
                                                        (reflection) => (
                                                            <div
                                                                key={`${reflection.user_id}-final`}
                                                                className="rounded-lg border border-blue-200 bg-blue-50 p-3"
                                                            >
                                                                <p className="mb-1 text-xs font-semibold text-blue-900">
                                                                    {
                                                                        reflection.user_name
                                                                    }
                                                                </p>
                                                                <p className="text-sm text-blue-800">
                                                                    {
                                                                        reflection.content
                                                                    }
                                                                </p>
                                                                <p className="mt-1 text-xs text-blue-600">
                                                                    {new Date(
                                                                        reflection.created_at,
                                                                    ).toLocaleDateString(
                                                                        'id-ID',
                                                                        {
                                                                            day: 'numeric',
                                                                            month: 'short',
                                                                            year: 'numeric',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit',
                                                                        },
                                                                    )}
                                                                </p>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Empty State */}
                                        {group.reflections.length === 0 && (
                                            <div className="rounded-lg border-2 border-dashed border-slate-200 p-6 text-center">
                                                <span className="mb-2 block text-2xl">
                                                    📝
                                                </span>
                                                <p className="text-sm text-slate-500">
                                                    Belum ada refleksi dari
                                                    kelompok ini
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
