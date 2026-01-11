import TeacherLayout from '@/layouts/teacher-layout';
import { User } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit } from 'lucide-react';
import { useState } from 'react';
import { GroupProgressTable } from './partials/groupProgressTable';
import { MissionStats } from './partials/missionStats';
import { SubmissionDetailModal } from './partials/submissionDetailModal';

interface Mission {
    id: number;
    title: string;
    description: string;
    difficulty_level: number;
    slug: string;
}

interface GroupMember {
    id: number;
    name: string;
    avatar?: string | null;
}

interface GroupProgress {
    group_id: number;
    group_name: string;
    group_code: string | null;
    members: GroupMember[];
    step1_status: 'locked' | 'in_progress' | 'completed';
    step2_status: 'locked' | 'in_progress' | 'completed';
    step3_status: 'locked' | 'in_progress' | 'completed';
    step4_status: 'locked' | 'in_progress' | 'completed';
    step5_status: 'locked' | 'in_progress' | 'completed';
    current_step: number;
    has_submission: boolean;
    file_path?: string | null;
    code_answer?: string | null;
    submitted_at?: string | null;
}

interface Stats {
    totalGroups: number;
    completedGroups: number;
    inProgressGroups: number;
    notStartedGroups: number;
}

interface ShowProps {
    auth: {
        user: User;
    };
    mission: Mission;
    groups: GroupProgress[];
    stats: Stats;
}

export default function Show({ auth, mission, groups, stats }: ShowProps) {
    const [selectedSubmission, setSelectedSubmission] =
        useState<GroupProgress | null>(null);
    const [showModal, setShowModal] = useState(false);

    const handleViewDetail = (groupId: number) => {
        const group = groups.find((g) => g.group_id === groupId);
        if (group) {
            setSelectedSubmission(group);
            setShowModal(true);
        }
    };

    return (
        <TeacherLayout
            user={auth.user}
            header={
                <div className="hidden sm:block">
                    <h2 className="text-lg font-bold text-slate-800">
                        Detail Misi & Monitoring
                    </h2>
                    <p className="text-xs text-slate-500">
                        Pantau progress setiap kelompok secara real-time
                    </p>
                </div>
            }
        >
            <Head title={`Monitoring: ${mission.title}`} />

            {/* Background Pattern */}
            <div className="fixed inset-0 -z-10 bg-slate-50">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
            </div>

            <div className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-8">
                    {/* Back Button */}
                    <Link
                        href="/teacher/dashboard"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-indigo-600"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Kembali ke Dashboard</span>
                    </Link>

                    {/* Mission Header */}
                    <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 sm:p-8">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-3xl shadow-lg">
                                    🎯
                                </div>
                                <div>
                                    <h1 className="text-2xl font-black text-slate-800 sm:text-3xl">
                                        {mission.title}
                                    </h1>
                                    <p className="mt-1 text-sm text-slate-600">
                                        {mission.description}
                                    </p>
                                    <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1 text-xs font-semibold text-indigo-700">
                                        <span>⭐</span>
                                        <span>
                                            Level {mission.difficulty_level}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <Link
                                href={`/teacher/mission/${mission.slug}/edit`}
                                className="inline-flex items-center gap-2 rounded-xl border border-indigo-300 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
                            >
                                <Edit className="h-4 w-4" />
                                <span className="hidden sm:inline">
                                    Edit Misi
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* Statistics */}
                    <MissionStats
                        totalGroups={stats.totalGroups}
                        completedGroups={stats.completedGroups}
                        inProgressGroups={stats.inProgressGroups}
                        notStartedGroups={stats.notStartedGroups}
                    />

                    {/* Group Progress Table */}
                    <GroupProgressTable
                        groups={groups}
                        onViewDetail={handleViewDetail}
                    />
                </div>
            </div>

            {/* Submission Detail Modal */}
            {selectedSubmission && (
                <SubmissionDetailModal
                    isOpen={showModal}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedSubmission(null);
                    }}
                    submission={{
                        group_id: selectedSubmission.group_id,
                        group_name: selectedSubmission.group_name,
                        group_code: selectedSubmission.group_code,
                        members: selectedSubmission.members,
                        file_path: selectedSubmission.file_path || null,
                        code_answer: selectedSubmission.code_answer || null,
                        submitted_at: selectedSubmission.submitted_at || null,
                    }}
                />
            )}
        </TeacherLayout>
    );
}
