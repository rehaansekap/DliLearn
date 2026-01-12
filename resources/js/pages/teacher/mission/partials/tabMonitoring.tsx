import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { ChevronDown, Eye, MessageCircle, Trophy } from 'lucide-react';
import { useMemo, useState } from 'react';

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
    group_name?: string;
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

interface VoteResult {
    group_id: number;
    group_name: string;
    group_code: string | null;
    vote_count: number;
}

interface TabMonitoringProps {
    groups: GroupMonitoring[];
    voteResults: VoteResult[];
    allReflections: Reflection[];
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
    voteResults,
    allReflections = [],
    onViewSubmission,
}: TabMonitoringProps) {
    const isMobile = useIsMobile();

    const voteMap = useMemo(() => {
        const m = new Map<number, number>();
        voteResults.forEach((v) => m.set(v.group_id, v.vote_count));
        return m;
    }, [voteResults]);

    const combinedResults = useMemo(
        () =>
            groups
                .map((g) => ({
                    group_id: g.group_id,
                    group_name: g.group_name,
                    group_code: g.group_code,
                    vote_count: voteMap.get(g.group_id) ?? 0,
                }))
                .sort((a, b) => b.vote_count - a.vote_count),
        [groups, voteMap],
    );

    const totalVotes = combinedResults.reduce(
        (sum, r) => sum + r.vote_count,
        0,
    );

    const [expandedReflectionType, setExpandedReflectionType] = useState<
        'initial' | 'final' | null
    >(null);

    const toggleReflectionType = (type: 'initial' | 'final') => {
        setExpandedReflectionType((prev) => (prev === type ? null : type));
    };

    const initialReflections = allReflections.filter(
        (r) => r.type === 'initial',
    );
    const finalReflections = allReflections.filter((r) => r.type === 'final');

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

            {/* Vote Results Section - now shows all groups + empty state */}
            <div className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-lg">
                <div className="border-b border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <Trophy className="h-6 w-6 text-amber-600" />
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">
                                🏆 Hasil Voting Kelompok
                            </h3>
                            <p className="text-sm text-slate-500">
                                Ringkasan vote per kelompok
                            </p>
                        </div>
                    </div>
                </div>

                {totalVotes === 0 ? (
                    <div className="p-6 text-center">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
                            <span className="text-2xl">🗳️</span>
                        </div>
                        <p className="mb-1 text-lg font-semibold text-slate-800">
                            Belum Ada Vote
                        </p>
                        <p className="text-sm text-slate-500">
                            Belum ada siswa yang memberikan vote untuk kelompok
                            terbaik.
                        </p>
                    </div>
                ) : isMobile ? (
                    <div className="p-4">
                        <div className="flex gap-3 overflow-x-auto pb-2">
                            {combinedResults.map((result, index) => {
                                const isTop = index === 0;
                                return (
                                    <div
                                        key={result.group_id}
                                        className={cn(
                                            'min-w-[180px] flex-shrink-0 rounded-2xl border px-4 py-3',
                                            isTop
                                                ? 'border-amber-200 bg-amber-50'
                                                : 'border-slate-200 bg-white',
                                        )}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p
                                                    className={cn(
                                                        'font-bold',
                                                        isTop
                                                            ? 'text-amber-900'
                                                            : 'text-slate-800',

                                                        'text-wrap break-words',
                                                    )}
                                                >
                                                    {result.group_name}
                                                </p>
                                                <p className="text-[11px] text-slate-500">
                                                    {result.group_code ||
                                                        'No Code'}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p
                                                    className={cn(
                                                        'text-2xl font-black',
                                                        isTop
                                                            ? 'text-amber-700'
                                                            : 'text-slate-700',
                                                    )}
                                                >
                                                    {result.vote_count}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {result.vote_count === 1
                                                        ? 'vote'
                                                        : 'votes'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-200">
                        {combinedResults.map((result, index) => {
                            const isWinner = index === 0;
                            return (
                                <div
                                    key={result.group_id}
                                    className={cn(
                                        'flex items-center justify-between px-6 py-4 transition hover:bg-slate-50',
                                        isWinner &&
                                            'bg-gradient-to-r from-amber-50 to-yellow-50',
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={cn(
                                                'flex h-12 w-12 items-center justify-center rounded-full font-black text-white shadow-md',
                                                isWinner
                                                    ? 'bg-gradient-to-br from-amber-500 to-yellow-500 text-2xl'
                                                    : index === 1
                                                      ? 'bg-gradient-to-br from-slate-400 to-slate-500 text-xl'
                                                      : index === 2
                                                        ? 'bg-gradient-to-br from-orange-400 to-amber-600 text-xl'
                                                        : 'bg-gradient-to-br from-slate-300 to-slate-400',
                                            )}
                                        >
                                            {index === 0
                                                ? '🥇'
                                                : index === 1
                                                  ? '🥈'
                                                  : index === 2
                                                    ? '🥉'
                                                    : index + 1}
                                        </div>

                                        <div>
                                            <p
                                                className={cn(
                                                    'font-bold text-slate-800',
                                                    isWinner &&
                                                        'text-lg text-amber-900',
                                                )}
                                            >
                                                {result.group_name}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {result.group_code || 'No Code'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p
                                            className={cn(
                                                'text-3xl font-black',
                                                isWinner
                                                    ? 'text-amber-700'
                                                    : 'text-slate-700',
                                            )}
                                        >
                                            {result.vote_count}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {result.vote_count === 1
                                                ? 'vote'
                                                : 'votes'}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
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

                {groups.length === 0 ? (
                    <div className="flex min-h-[240px] items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8">
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-200">
                                <span className="text-2xl">👥</span>
                            </div>
                            <h4 className="mb-2 text-lg font-bold text-slate-700">
                                Belum Ada Kelompok
                            </h4>
                            <p className="text-sm text-slate-500">
                                Buat kelompok terlebih dahulu agar progress bisa
                                dipantau di sini.
                            </p>
                        </div>
                    </div>
                ) : isMobile ? (
                    <div className="space-y-3 p-4">
                        {groups.map((group) => (
                            <div
                                key={group.group_id}
                                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3"
                            >
                                <div>
                                    <p className="font-semibold text-slate-800">
                                        {group.group_name}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {group.group_code}
                                    </p>
                                    <div className="mt-2 flex gap-2">
                                        {[
                                            group.step1_status,
                                            group.step2_status,
                                            group.step3_status,
                                            group.step4_status,
                                            group.step5_status,
                                        ].map((s, i) => (
                                            <div
                                                key={i}
                                                className="flex flex-col items-center"
                                            >
                                                <StatusDot status={s} />
                                                <span className="mt-1 text-[10px] text-slate-400">
                                                    T-{i + 1}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <button
                                        onClick={() =>
                                            onViewSubmission(group.group_id)
                                        }
                                        className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                                    >
                                        <Eye className="h-4 w-4" />
                                        <span>Detail</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
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
                                                    onViewSubmission(
                                                        group.group_id,
                                                    )
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
                )}
            </div>

            {/* ✅ Reflection Log (Accordion per-tipe) */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                <div className="border-b border-slate-200 bg-indigo-600 px-6 py-4">
                    <h3 className="text-white-800 text-lg font-bold">
                        💬 Log Refleksi Siswa
                    </h3>
                    <p className="text-white-300 text-sm">
                        Jawaban refleksi awal & akhir dari semua siswa
                    </p>
                </div>

                <div className="divide-y divide-slate-200">
                    {/* Refleksi Awal Accordion */}
                    <div>
                        <button
                            onClick={() => toggleReflectionType('initial')}
                            className="flex w-full items-center justify-between px-6 py-4 text-left transition hover:bg-slate-50"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500 font-bold text-white">
                                    🤔
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800">
                                        Refleksi Awal (Tahap 1)
                                    </p>
                                    <p className="flex items-center gap-2 text-xs text-slate-500">
                                        <MessageCircle className="h-3 w-3" />
                                        <span>
                                            {initialReflections.length} refleksi
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <ChevronDown
                                className={cn(
                                    'h-5 w-5 text-slate-400 transition-transform',
                                    expandedReflectionType === 'initial' &&
                                        'rotate-180',
                                )}
                            />
                        </button>

                        {expandedReflectionType === 'initial' && (
                            <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">
                                {initialReflections.length > 0 ? (
                                    <div className="space-y-3">
                                        {initialReflections.map(
                                            (reflection) => (
                                                <div
                                                    key={`${reflection.user_id}-initial-${reflection.created_at}`}
                                                    className="rounded-lg border border-green-200 bg-green-50 p-4"
                                                >
                                                    <div className="mb-2 flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm font-bold text-green-900">
                                                                {
                                                                    reflection.user_name
                                                                }
                                                            </p>
                                                            <p className="text-xs text-green-700">
                                                                Kelompok:{' '}
                                                                {
                                                                    reflection.group_name
                                                                }
                                                            </p>
                                                        </div>
                                                        <p className="text-xs text-green-600">
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
                                                    <p className="text-sm text-green-800">
                                                        {reflection.content}
                                                    </p>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                ) : (
                                    <div className="rounded-lg border-2 border-dashed border-slate-200 p-6 text-center">
                                        <span className="mb-2 block text-2xl">
                                            📝
                                        </span>
                                        <p className="text-sm text-slate-500">
                                            Belum ada refleksi awal dari siswa
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Refleksi Akhir Accordion */}
                    <div>
                        <button
                            onClick={() => toggleReflectionType('final')}
                            className="flex w-full items-center justify-between px-6 py-4 text-left transition hover:bg-slate-50"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 font-bold text-white">
                                    ✅
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800">
                                        Refleksi Akhir (Tahap 5)
                                    </p>
                                    <p className="flex items-center gap-2 text-xs text-slate-500">
                                        <MessageCircle className="h-3 w-3" />
                                        <span>
                                            {finalReflections.length} refleksi
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <ChevronDown
                                className={cn(
                                    'h-5 w-5 text-slate-400 transition-transform',
                                    expandedReflectionType === 'final' &&
                                        'rotate-180',
                                )}
                            />
                        </button>

                        {expandedReflectionType === 'final' && (
                            <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">
                                {finalReflections.length > 0 ? (
                                    <div className="space-y-3">
                                        {finalReflections.map((reflection) => (
                                            <div
                                                key={`${reflection.user_id}-final-${reflection.created_at}`}
                                                className="rounded-lg border border-blue-200 bg-blue-50 p-4"
                                            >
                                                <div className="mb-2 flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-bold text-blue-900">
                                                            {
                                                                reflection.user_name
                                                            }
                                                        </p>
                                                        <p className="text-xs text-blue-700">
                                                            Kelompok:{' '}
                                                            {
                                                                reflection.group_name
                                                            }
                                                        </p>
                                                    </div>
                                                    <p className="text-xs text-blue-600">
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
                                                <p className="text-sm text-blue-800">
                                                    {reflection.content}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-lg border-2 border-dashed border-slate-200 p-6 text-center">
                                        <span className="mb-2 block text-2xl">
                                            📝
                                        </span>
                                        <p className="text-sm text-slate-500">
                                            Belum ada refleksi akhir dari siswa
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
