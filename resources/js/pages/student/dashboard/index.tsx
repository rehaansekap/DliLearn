import StudentLayout from '@/layouts/student-layout';
import { User } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { MissionList } from './partials/missionList';
import { StatsOverview } from './partials/statsOverview';
import { TeacherDropdown } from './partials/teacherDropdown';
import { WelcomeBanner } from './partials/welcomeBanner';

interface Teacher {
    id: number;
    name: string;
    avatar: string | null;
}

interface Mission {
    id: number;
    title: string;
    description: string;
    level: number;
    slug: string;
    status: string;
    locked: boolean;
    prerequisite: string | null;
    started_at: string | null;
    finished_at: string | null;
    teacher_id: number;
    teacher_name: string;
    teacher_avatar: string | null;
    classroom_name: string;
}

interface DashboardProps {
    auth: {
        user: User;
    };
    missions: Mission[];
    teachers: Teacher[];
    userXp: number;
    userLevel: number;
}

export default function Dashboard({
    auth,
    missions,
    teachers,
    userXp,
    userLevel,
}: DashboardProps) {
    const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(
        null,
    );

    const missionCounts = useMemo(() => {
        return missions.reduce(
            (acc, m) => {
                acc[m.teacher_id] = (acc[m.teacher_id] || 0) + 1;
                return acc;
            },
            {} as Record<number, number>,
        );
    }, [missions]);

    const filteredMissions =
        selectedTeacherId === null
            ? missions
            : missions.filter((m) => m.teacher_id === selectedTeacherId);

    return (
        <StudentLayout
            user={auth.user}
            showBackButton={false}
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
                            Dashboard Petualangan
                        </h2>
                        <p className="text-xs text-slate-600 sm:text-sm">
                            Kelola misi dan pantau progres belajarmu
                        </p>
                    </div>
                    <div className="hidden items-center gap-2 sm:flex">
                        <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
                            🎯 Student
                        </span>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard Petualangan" />

            {/* Background Pattern */}
            <div className="fixed inset-0 -z-10 bg-slate-50">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
            </div>

            <div className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-8">
                    {/* Welcome Banner */}
                    <WelcomeBanner user={auth.user} />

                    {/* Stats Overview */}
                    <StatsOverview level={userLevel} xp={userXp} />

                    {/* Section Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 sm:text-3xl">
                                🎯 Misi Petualanganmu
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                {selectedTeacherId
                                    ? `Menampilkan misi dari ${teachers.find((t) => t.id === selectedTeacherId)?.name}`
                                    : 'Pilih misi dan mulai petualangan coding-mu!'}
                            </p>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            {/* Teacher Filter Dropdown */}
                            {teachers.length > 0 && (
                                <TeacherDropdown
                                    teachers={teachers}
                                    selectedId={selectedTeacherId}
                                    onChange={setSelectedTeacherId}
                                    missionCounts={missionCounts}
                                    totalMissions={missions.length}
                                />
                            )}
                            <div className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-3.5 sm:flex">
                                <span className="text-xl">📊</span>
                                <span className="text-sm font-bold text-indigo-700">
                                    {missions.length} Misi
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Mission Section with Filter */}
                    <div>
                        {/* Mission List with Pagination */}
                        <MissionList missions={filteredMissions} />
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
