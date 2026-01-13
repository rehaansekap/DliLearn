import {
    DashboardLayout,
    MissionListSection,
    StatsGrid,
} from '@/components/teacher/dashboard/ui';
import { WelcomeBanner } from '@/components/teacher/dashboard/welcomeBanner';
import { DeleteMissionModal } from '@/components/teacher/mission/ui/delete/deleteMissionModal';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDeleteMission } from '@/hooks/useDeleteMission';
import TeacherLayout from '@/layouts/teacher-layout';
import { User } from '@/types';
import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';

interface Classroom {
    id: number;
    name: string;
    academic_year: string;
}

interface Mission {
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
    missions: Mission[];
    classrooms: Classroom[];
    stats: Stats;
}

export default function Dashboard({
    auth,
    missions,
    classrooms,
    stats,
}: DashboardProps) {
    const isMobile = useIsMobile();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClassroomId, setSelectedClassroomId] = useState<
        number | null
    >(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const {
        showDeleteModal,
        missionToDelete,
        openDeleteModal,
        closeDeleteModal,
    } = useDeleteMission();

    const filteredMissions = useMemo(() => {
        return missions.filter((mission) => {
            const matchesSearch =
                mission.title
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                mission.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());

            const matchesClassroom =
                selectedClassroomId === null ||
                mission.classroom_id === selectedClassroomId;

            return matchesSearch && matchesClassroom;
        });
    }, [missions, searchQuery, selectedClassroomId]);

    const totalPages = Math.ceil(filteredMissions.length / itemsPerPage);

    const paginatedMissions = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredMissions.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredMissions, currentPage, itemsPerPage]);

    const missionCounts = useMemo(() => {
        return classrooms.reduce(
            (acc, classroom) => {
                acc[classroom.id] = missions.filter(
                    (m) => m.classroom_id === classroom.id,
                ).length;
                return acc;
            },
            {} as Record<number, number>,
        );
    }, [classrooms, missions]);

    return (
        <TeacherLayout
            user={auth.user}
            header={
                <div className="hidden sm:block">
                    <h2 className="text-lg font-bold text-slate-800">
                        Dashboard
                    </h2>
                    <p className="text-xs text-slate-500">
                        Kelola misi dan pantau progress pembelajaran
                    </p>
                </div>
            }
        >
            <Head title="Dashboard Guru" />

            <DashboardLayout>
                <WelcomeBanner user={auth.user} />
                <StatsGrid stats={stats} />
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
                    onSearchChange={setSearchQuery}
                    onClassroomChange={setSelectedClassroomId}
                    onPageChange={setCurrentPage}
                    onDeleteMission={openDeleteModal}
                />
            </DashboardLayout>

            {/* Delete Confirmation Modal */}
            {missionToDelete && (
                <DeleteMissionModal
                    isOpen={showDeleteModal}
                    onClose={closeDeleteModal}
                    mission={missionToDelete}
                    isMobile={isMobile}
                />
            )}
        </TeacherLayout>
    );
}
