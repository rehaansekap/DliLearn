import TeacherLayout from '@/layouts/teacher-layout';
import { User } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit } from 'lucide-react';
import { useState } from 'react';
import { GroupProgressTable } from './partials/groupProgressTable';
import { MissionStats } from './partials/missionStats';
import { MissionTabs } from './partials/missionTabs';

interface Mission {
    id: number;
    title: string;
    description: string;
    difficulty_level: number;
    slug: string;
}

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

interface Stats {
    totalGroups: number;
    completedGroups: number;
    needsReview: number;
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
    const [activeTab, setActiveTab] = useState<
        'overview' | 'submissions' | 'settings'
    >('overview');

    return (
        <TeacherLayout
            user={auth.user}
            header={
                <div>
                    <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
                        Detail Misi
                    </h2>
                    <p className="text-xs text-slate-500 sm:text-sm">
                        Pantau progress kelompok pada misi ini
                    </p>
                </div>
            }
        >
            <Head title={`Detail Misi: ${mission.title}`} />

            {/* Background Pattern */}
            <div className="fixed inset-0 -z-10 bg-slate-50">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
            </div>

            <div className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-8">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Link
                            href="/teacher/dashboard"
                            className="transition hover:text-indigo-600"
                        >
                            Dashboard
                        </Link>
                        <span>›</span>
                        <span className="font-medium text-slate-800">
                            {mission.title}
                        </span>
                    </div>

                    {/* Mission Header */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                        <div className="border-b border-slate-200 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <Link
                                        href="/teacher/dashboard"
                                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition hover:bg-white/30"
                                    >
                                        <ArrowLeft className="h-5 w-5 text-white" />
                                    </Link>
                                    <div>
                                        <div className="mb-2 flex items-center gap-2">
                                            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                                                Level {mission.difficulty_level}
                                            </span>
                                        </div>
                                        <h1 className="mb-2 text-2xl font-black text-white sm:text-3xl">
                                            {mission.title}
                                        </h1>
                                        <p className="max-w-2xl text-sm text-indigo-100 sm:text-base">
                                            {mission.description}
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    href={`/teacher/mission/${mission.id}/edit`}
                                    className="flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/30"
                                >
                                    <Edit className="h-4 w-4" />
                                    <span className="hidden sm:inline">
                                        Edit Soal
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <MissionStats
                        totalGroups={stats.totalGroups}
                        completedGroups={stats.completedGroups}
                        needsReview={stats.needsReview}
                    />

                    {/* Tabs */}
                    <MissionTabs
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />

                    {/* Tab Content */}
                    <div className="min-h-[400px]">
                        {activeTab === 'overview' && (
                            <GroupProgressTable
                                groups={groups}
                                missionId={mission.id}
                            />
                        )}

                        {activeTab === 'submissions' && (
                            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-lg">
                                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                                    <span className="text-4xl">📝</span>
                                </div>
                                <h3 className="mb-2 text-lg font-bold text-slate-700">
                                    Area Penilaian
                                </h3>
                                <p className="text-sm text-slate-500">
                                    Fitur penilaian submission akan tersedia
                                    segera
                                </p>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-lg">
                                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                                    <span className="text-4xl">⚙️</span>
                                </div>
                                <h3 className="mb-2 text-lg font-bold text-slate-700">
                                    Pengaturan Misi
                                </h3>
                                <p className="text-sm text-slate-500">
                                    Konfigurasi misi akan tersedia segera
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
