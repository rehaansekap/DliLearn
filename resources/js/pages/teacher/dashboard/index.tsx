import TeacherLayout from '@/layouts/teacher-layout';
import { User } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ClassroomDropdown } from './partials/classroomDropdown';
import { MissionCard } from './partials/missionCard';
import { StatsCard } from './partials/statsCard';
import { WelcomeBanner } from './partials/welcomeBanner';

interface Classroom {
    id: number;
    name: string;
    academic_year: string;
}

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
    classrooms: Classroom[];
    stats: Stats;
}

export default function Dashboard({
    auth,
    missions,
    classrooms,
    stats,
}: DashboardProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClassroomId, setSelectedClassroomId] = useState<
        number | null
    >(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const missionCounts = useMemo(() => {
        return missions.reduce(
            (acc, mission) => {
                acc[mission.classroom_id] =
                    (acc[mission.classroom_id] || 0) + 1;
                return acc;
            },
            {} as Record<number, number>,
        );
    }, [missions]);

    const filteredMissions = missions.filter((mission) => {
        const matchesSearch =
            mission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mission.classroom_name
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

        const matchesClassroom =
            selectedClassroomId === null ||
            mission.classroom_id === selectedClassroomId;

        return matchesSearch && matchesClassroom;
    });

    const totalPages = Math.ceil(filteredMissions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedMissions = filteredMissions.slice(
        startIndex,
        startIndex + itemsPerPage,
    );

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    const handleClassroomChange = (id: number | null) => {
        setSelectedClassroomId(id);
        setCurrentPage(1);
    };

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
                            icon="🎯"
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
                        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-slate-800 sm:text-2xl">
                                    🎯 Daftar Misi
                                </h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    {selectedClassroomId
                                        ? `Menampilkan misi untuk ${classrooms.find((c) => c.id === selectedClassroomId)?.name}`
                                        : 'Kelola misi pembelajaran untuk setiap kelas'}
                                </p>
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                {/* Classroom Filter Dropdown */}
                                {classrooms.length > 0 && (
                                    <ClassroomDropdown
                                        classrooms={classrooms}
                                        selectedId={selectedClassroomId}
                                        onChange={handleClassroomChange}
                                        missionCounts={missionCounts}
                                        totalMissions={missions.length}
                                    />
                                )}

                                {/* Search */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Cari misi..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            handleSearchChange(e.target.value)
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-white py-4 pr-4 pl-10 text-sm text-slate-700 placeholder-slate-400 shadow-sm transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none sm:w-48"
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
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-4 text-sm font-semibold text-white shadow-lg transition-all hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl"
                                >
                                    <Plus className="h-5 w-5" />
                                    <span>Buat Misi</span>
                                </Link>
                            </div>
                        </div>

                        {paginatedMissions.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {paginatedMissions.map((mission) => (
                                        <MissionCard
                                            key={mission.id}
                                            mission={mission}
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-8 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-6">
                                        <p className="text-sm text-slate-600">
                                            Menampilkan{' '}
                                            <span className="font-bold text-slate-800">
                                                {filteredMissions.length === 0
                                                    ? 0
                                                    : startIndex + 1}{' '}
                                                –{' '}
                                                {Math.min(
                                                    startIndex + itemsPerPage,
                                                    filteredMissions.length,
                                                )}
                                            </span>{' '}
                                            dari{' '}
                                            <span className="font-bold text-slate-800">
                                                {filteredMissions.length}
                                            </span>{' '}
                                            misi
                                        </p>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() =>
                                                    setCurrentPage((p) =>
                                                        Math.max(1, p - 1),
                                                    )
                                                }
                                                disabled={currentPage === 1}
                                                className="inline-flex items-center gap-2 rounded-lg border border-indigo-100 bg-white px-3 py-1 text-sm font-medium text-indigo-700 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <span className="text-sm">
                                                    ←
                                                </span>
                                                <span className="hidden sm:inline">
                                                    Prev
                                                </span>
                                            </button>

                                            <div className="hidden items-center gap-1 sm:flex">
                                                {Array.from(
                                                    { length: totalPages },
                                                    (_, i) => i + 1,
                                                ).map((page) => (
                                                    <button
                                                        key={page}
                                                        onClick={() =>
                                                            setCurrentPage(page)
                                                        }
                                                        className={`rounded-md px-3 py-1 text-sm font-medium transition ${
                                                            currentPage === page
                                                                ? 'bg-indigo-600 text-white shadow'
                                                                : 'border border-indigo-100 bg-white text-slate-600 hover:bg-indigo-50'
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Mobile page indicator */}
                                            <div className="px-2 text-sm text-slate-500 sm:hidden">
                                                {currentPage} / {totalPages}
                                            </div>

                                            <button
                                                onClick={() =>
                                                    setCurrentPage((p) =>
                                                        Math.min(
                                                            totalPages,
                                                            p + 1,
                                                        ),
                                                    )
                                                }
                                                disabled={
                                                    currentPage === totalPages
                                                }
                                                className="inline-flex items-center gap-2 rounded-lg border border-indigo-100 bg-white px-3 py-1 text-sm font-medium text-indigo-700 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <span className="hidden sm:inline">
                                                    Next
                                                </span>
                                                <span className="text-sm">
                                                    →
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : missions.length === 0 ? (
                            <div className="flex min-h-[400px] items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12">
                                <div className="text-center">
                                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                                        <span className="text-4xl">🎯</span>
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
                                        Tidak ada misi yang cocok dengan filter
                                        yang dipilih
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
