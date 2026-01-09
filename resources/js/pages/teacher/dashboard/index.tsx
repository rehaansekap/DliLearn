import TeacherLayout from '@/layouts/teacher-layout';
import { User } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { MissionCard } from './partials/missionCard';
import { StatsCard } from './partials/statsCard';
import { WelcomeBanner } from './partials/welcomeBanner';

interface ClassroomMission {
    id: number;
    title: string;
    description: string;
    difficulty_level: number;
    slug: string;
    classroom_name: string;
    classroom_id: number;
    total_groups: number;
    completed_groups: number;
    needs_review: number;
    started_at: string | null;
    finished_at: string | null;
}

interface Stats {
    totalMissions: number;
    totalStudents: number;
    activeMissions: number;
    pendingReview: number;
}

interface DashboardProps {
    auth: {
        user: User;
    };
    missions: ClassroomMission[];
    stats: Stats;
}

export default function Dashboard({ auth, missions, stats }: DashboardProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredMissions = missions.filter(
        (mission) =>
            mission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mission.classroom_name
                .toLowerCase()
                .includes(searchQuery.toLowerCase()),
    );

    return (
        <TeacherLayout
            user={auth.user}
            header={
                <div className="hidden sm:block">
                    <h2 className="text-lg font-bold text-slate-800">
                        Dashboard Guru
                    </h2>
                    <p className="text-xs text-slate-500">
                        Kelola misi pembelajaran untuk kelas Anda
                    </p>
                </div>
            }
        >
            <Head title="Dashboard Guru" />

            {/* Background Pattern */}
            <div className="fixed inset-0 -z-10 bg-slate-50">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
            </div>

            <div className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-8">
                    {/* Welcome Banner */}
                    <WelcomeBanner user={auth.user} />

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
                        <StatsCard
                            title="Total Misi"
                            value={stats.totalMissions}
                            icon="📋"
                            color="indigo"
                        />
                        <StatsCard
                            title="Total Siswa"
                            value={stats.totalStudents}
                            icon="👨‍🎓"
                            color="emerald"
                        />
                        <StatsCard
                            title="Misi Aktif"
                            value={stats.activeMissions}
                            icon="⚡"
                            color="amber"
                        />
                        <StatsCard
                            title="Perlu Review"
                            value={stats.pendingReview}
                            icon="📝"
                            color="rose"
                        />
                    </div>

                    {/* Mission Section */}
                    <div>
                        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 sm:text-2xl">
                                    📋 Daftar Misi
                                </h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    Kelola misi pembelajaran untuk setiap kelas
                                </p>
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                {/* Search */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Cari misi atau kelas..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-4 pl-10 text-sm text-slate-700 placeholder-slate-400 shadow-sm transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none sm:w-64"
                                    />
                                    <svg
                                        className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>

                                {/* Create Mission Button */}
                                <Link
                                    href="/teacher/mission/create"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl"
                                >
                                    <Plus className="h-5 w-5" />
                                    <span>Buat Misi Baru</span>
                                </Link>
                            </div>
                        </div>

                        {filteredMissions.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {filteredMissions.map((mission) => (
                                    <MissionCard
                                        key={mission.id}
                                        mission={mission}
                                    />
                                ))}
                            </div>
                        ) : missions.length === 0 ? (
                            <div className="flex min-h-[400px] items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12">
                                <div className="text-center">
                                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                                        <span className="text-4xl">�</span>
                                    </div>
                                    <h4 className="mb-2 text-lg font-bold text-slate-700">
                                        Belum Ada Misi
                                    </h4>
                                    <p className="mb-4 text-sm text-slate-500">
                                        Mulai dengan membuat misi pertama untuk
                                        kelas Anda
                                    </p>
                                    <Link
                                        href="/teacher/mission/create"
                                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:from-indigo-700 hover:to-purple-700"
                                    >
                                        <Plus className="h-5 w-5" />
                                        <span>Buat Misi Baru</span>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-slate-200 bg-white p-12">
                                <div className="text-center">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                                        <span className="text-3xl">🔍</span>
                                    </div>
                                    <h4 className="mb-2 text-lg font-bold text-slate-700">
                                        Tidak Ditemukan
                                    </h4>
                                    <p className="text-sm text-slate-500">
                                        Tidak ada misi yang cocok dengan "
                                        {searchQuery}"
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
