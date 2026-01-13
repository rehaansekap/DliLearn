import { WelcomeBanner } from '@/components/teacher/dashboard';
import {
    DashboardLayout,
    MissionListSection,
    StatsGrid,
} from '@/components/teacher/dashboard/ui';
import TeacherLayout from '@/layouts/teacher-layout';
import { User } from '@/types';
import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';

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

    // Calculate mission counts per classroom
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

    // Filter missions
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

    // Paginate missions
    const totalPages = Math.ceil(filteredMissions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedMissions = filteredMissions.slice(
        startIndex,
        startIndex + itemsPerPage,
    );

    // Handlers
    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    const handleClassroomChange = (id: number | null) => {
        setSelectedClassroomId(id);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
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

            <DashboardLayout>
                {/* Welcome Banner */}
                <WelcomeBanner user={auth.user} />

                {/* Stats Grid */}
                <StatsGrid stats={stats} />

                {/* Mission List Section */}
                <MissionListSection
                    missions={missions}
                    paginatedMissions={paginatedMissions}
                    filteredMissions={filteredMissions}
                    classrooms={classrooms}
                    searchQuery={searchQuery}
                    selectedClassroomId={selectedClassroomId}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    missionCounts={missionCounts}
                    onSearchChange={handleSearchChange}
                    onClassroomChange={handleClassroomChange}
                    onPageChange={handlePageChange}
                />
            </DashboardLayout>
        </TeacherLayout>
    );
}
