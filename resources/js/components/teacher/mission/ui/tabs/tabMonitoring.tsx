import {
    GroupProgressCard,
    LeaderboardCard,
    MonitoringStats,
    ReflectionAccordion,
} from '@/components/teacher/mission/ui/monitoring';
import { useMemo } from 'react';

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

export function TabMonitoring({
    groups,
    voteResults,
    allReflections = [],
    onViewSubmission,
}: TabMonitoringProps) {
    const activeGroups = groups.filter(
        (g) => g.current_step >= 2 && g.current_step < 5,
    ).length;

    const completedGroups = groups.filter((g) => g.current_step === 5).length;

    const needsReview = groups.filter(
        (g) =>
            g.step4_status === 'completed' &&
            (g.step5_status !== 'completed' || g.current_step < 5),
    ).length;

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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-4 sm:p-6">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-2xl shadow-lg sm:h-14 sm:w-14">
                        📊
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
                            Monitoring & Refleksi
                        </h2>
                        <p className="text-xs text-slate-600 sm:text-sm">
                            Pantau progres dan lihat refleksi setiap siswa
                        </p>
                    </div>
                </div>
            </div>

            {/* Statistics */}
            <MonitoringStats
                activeGroups={activeGroups}
                completedGroups={completedGroups}
                needsReview={needsReview}
            />

            {/* Main Content - Two Column Layout */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                {/* Left Column - Main Content (3/4 width) */}
                <div className="space-y-6 lg:col-span-3">
                    {/* Reflection Accordion - Moved from sidebar */}
                    <ReflectionAccordion reflections={allReflections} />

                    {/* Group Progress Cards */}
                    {groups.length === 0 ? (
                        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-12">
                            <div className="text-center">
                                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-200">
                                    <span className="text-4xl">👥</span>
                                </div>
                                <h4 className="mb-2 text-lg font-bold text-slate-700">
                                    Belum Ada Kelompok
                                </h4>
                                <p className="text-sm text-slate-500">
                                    Buat kelompok terlebih dahulu agar progress
                                    bisa dipantau di sini
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="mb-4 rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-3">
                                <h3 className="font-bold text-slate-800">
                                    📋 Progress Kelompok
                                </h3>
                                <p className="text-sm text-slate-500">
                                    Pantau perkembangan setiap kelompok secara
                                    real-time
                                </p>
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {groups.map((group) => (
                                    <GroupProgressCard
                                        key={group.group_id}
                                        group={group}
                                        onViewSubmission={onViewSubmission}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Leaderboard Only (1/4 width) */}
                <div className="lg:col-span-1">
                    <LeaderboardCard
                        results={combinedResults}
                        totalVotes={totalVotes}
                    />
                </div>
            </div>
        </div>
    );
}
